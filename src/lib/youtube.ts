const YT_BASE = "https://www.googleapis.com/youtube/v3";

interface YoutubeApiError {
  error?: { message?: string };
}

interface SearchListItem {
  id: { videoId: string };
}

interface SearchListResponse {
  items: SearchListItem[];
}

interface VideosListItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails?: {
      medium?: { url: string };
      default?: { url: string };
    };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

interface VideosListResponse {
  items: VideosListItem[];
}

export class YoutubeApiClientError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function ytFetch<T>(path: string, params: Record<string, string>, apiKey: string): Promise<T> {
  const url = new URL(`${YT_BASE}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as YoutubeApiError | null;
    const message = body?.error?.message ?? `YouTube API request failed with status ${res.status}`;
    throw new YoutubeApiClientError(message, res.status);
  }
  return (await res.json()) as T;
}

/** Searches for videos matching a keyword, published after the given ISO timestamp. */
export async function searchVideoIds(
  keyword: string,
  publishedAfter: string,
  apiKey: string,
  maxResults: number
): Promise<string[]> {
  const data = await ytFetch<SearchListResponse>(
    "search",
    {
      part: "snippet",
      q: keyword,
      type: "video",
      order: "viewCount",
      publishedAfter,
      maxResults: String(maxResults),
      relevanceLanguage: "ko",
      regionCode: "KR",
      safeSearch: "none",
    },
    apiKey
  );
  return data.items.map((item) => item.id.videoId).filter(Boolean);
}

export interface RawVideoDetail {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

/** Fetches statistics + snippet for up to 50 video ids per call (YouTube API limit), batching as needed. */
export async function fetchVideoDetails(ids: string[], apiKey: string): Promise<RawVideoDetail[]> {
  const results: RawVideoDetail[] = [];
  const batchSize = 50;

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    if (batch.length === 0) continue;
    const data = await ytFetch<VideosListResponse>(
      "videos",
      {
        part: "snippet,statistics",
        id: batch.join(","),
      },
      apiKey
    );

    for (const item of data.items) {
      results.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description ?? "",
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnail:
          item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? "",
        viewCount: Number(item.statistics?.viewCount ?? 0),
        likeCount: Number(item.statistics?.likeCount ?? 0),
        commentCount: Number(item.statistics?.commentCount ?? 0),
      });
    }
  }

  return results;
}
