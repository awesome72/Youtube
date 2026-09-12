import type { FrequentTerm, KeywordStat, VideoStat } from "@/types/youtube";
import type { RawVideoDetail } from "@/lib/youtube";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const STOPWORDS = new Set(
  [
    // Korean particles / common filler words
    "이", "가", "은", "는", "을", "를", "에", "의", "와", "과", "도", "로", "으로",
    "에서", "에게", "부터", "까지", "이다", "합니다", "하는", "했다", "그리고", "그러나",
    "하지만", "정말", "너무", "오늘", "이번", "우리", "여러분", "영상", "채널", "구독",
    "좋아요", "댓글", "shorts", "Shorts", "SHORTS",
    // English filler words
    "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are",
    "this", "that", "with", "you", "your", "how", "what", "why", "vs", "video",
  ].map((w) => w.toLowerCase())
);

/** Extracts frequent meaningful terms (Korean/English, length >= 2) from a batch of text. */
export function extractFrequentTerms(texts: string[], topN = 10): FrequentTerm[] {
  const counts = new Map<string, number>();

  for (const text of texts) {
    const cleaned = text
      .replace(/https?:\/\/\S+/g, " ")
      .replace(/[#@][\w가-힣]+/g, " ");

    const tokens = cleaned.match(/[\p{Script=Hangul}\p{L}\p{N}]+/gu) ?? [];

    for (const raw of tokens) {
      const token = raw.trim();
      if (token.length < 2) continue;
      const lower = token.toLowerCase();
      if (STOPWORDS.has(lower)) continue;
      if (/^\d+$/.test(token)) continue;

      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Builds VideoStat objects with derived metrics. Trend Score is a proxy for "growth
 * potential" — the YouTube API exposes only a point-in-time snapshot of view counts,
 * not a historical time series, so we approximate momentum via views-per-day-since-published
 * (log-scaled and min-max normalized to 0-100 across the current result set).
 */
export function buildVideoStats(
  raw: RawVideoDetail[],
  keywordsByVideoId: Map<string, string[]>,
  now: Date = new Date()
): VideoStat[] {
  const withVelocity = raw.map((video) => {
    const publishedAt = new Date(video.publishedAt);
    const daysSincePublished = Math.max(
      1 / 24, // floor at 1 hour to avoid divide-by-near-zero spikes
      (now.getTime() - publishedAt.getTime()) / MS_PER_DAY
    );
    const viewsPerDay = video.viewCount / daysSincePublished;
    const engagementRate =
      video.viewCount > 0 ? ((video.likeCount + video.commentCount) / video.viewCount) * 100 : 0;

    return { video, daysSincePublished, viewsPerDay, engagementRate };
  });

  const logVelocities = withVelocity.map((v) => Math.log1p(v.viewsPerDay));
  const minLog = logVelocities.length ? Math.min(...logVelocities) : 0;
  const maxLog = logVelocities.length ? Math.max(...logVelocities) : 0;
  const range = maxLog - minLog;

  return withVelocity.map(({ video, daysSincePublished, viewsPerDay, engagementRate }, i) => {
    const normalized = range > 0 ? (logVelocities[i] - minLog) / range : 0.5;
    const trendScore = clamp(Math.round(normalized * 100), 0, 100);

    return {
      id: video.id,
      title: video.title,
      description: video.description,
      channelTitle: video.channelTitle,
      publishedAt: video.publishedAt,
      thumbnail: video.thumbnail,
      viewCount: video.viewCount,
      likeCount: video.likeCount,
      commentCount: video.commentCount,
      matchedKeywords: keywordsByVideoId.get(video.id) ?? [],
      daysSincePublished: Math.round(daysSincePublished * 10) / 10,
      viewsPerDay: Math.round(viewsPerDay),
      engagementRate: Math.round(engagementRate * 100) / 100,
      trendScore,
    };
  });
}

export function buildKeywordStats(videos: VideoStat[], keywords: string[]): KeywordStat[] {
  const stats: KeywordStat[] = keywords.map((keyword) => {
    const matched = videos.filter((v) => v.matchedKeywords.includes(keyword));
    const totalViews = matched.reduce((sum, v) => sum + v.viewCount, 0);
    const avgTrendScore = matched.length
      ? Math.round(matched.reduce((sum, v) => sum + v.trendScore, 0) / matched.length)
      : 0;

    return { keyword, videoCount: matched.length, totalViews, avgTrendScore };
  });

  return stats.sort((a, b) => b.avgTrendScore - a.avgTrendScore || b.totalViews - a.totalViews).slice(0, 10);
}

export function buildSummary(
  period: number,
  topKeywords: KeywordStat[],
  frequentTerms: FrequentTerm[],
  videoCount: number
): string {
  if (videoCount === 0) {
    return "선택한 조건에 해당하는 영상을 찾지 못했습니다. 키워드나 기간을 조정해 보세요.";
  }

  const leadKeyword = topKeywords[0]?.keyword;
  const topTerms = frequentTerms.slice(0, 3).map((t) => t.term);

  const parts: string[] = [];
  parts.push(`최근 ${period}일간 수집된 영상 ${videoCount}건을 분석한 결과`);
  if (leadKeyword) {
    parts.push(`'${leadKeyword}' 키워드의 트렌드 점수가 가장 높게 나타났습니다.`);
  }
  if (topTerms.length > 0) {
    parts.push(`제목·설명에서는 '${topTerms.join("', '")}' 등의 단어가 가장 자주 등장했습니다.`);
  }

  return parts.join(" ");
}
