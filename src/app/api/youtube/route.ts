import { NextRequest, NextResponse } from "next/server";
import { fetchVideoDetails, searchVideoIds, YoutubeApiClientError } from "@/lib/youtube";
import { buildKeywordStats, buildSummary, buildVideoStats, extractFrequentTerms } from "@/lib/analysis";
import type { Period, TrendAnalysisResponse } from "@/types/youtube";

export const runtime = "nodejs";

const MAX_RESULTS_PER_KEYWORD = 15;
const MAX_KEYWORDS = 12;
const MAX_VIDEOS_RETURNED = 30;
const ALLOWED_PERIODS: Period[] = [7, 30];

function parseKeywords(raw: string | null): string[] {
  if (!raw) return [];
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0)
    )
  ).slice(0, MAX_KEYWORDS);
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "서버에 YOUTUBE_API_KEY가 설정되어 있지 않습니다. .env.local을 확인하세요." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const keywords = parseKeywords(searchParams.get("keywords"));
  const periodParam = Number(searchParams.get("period") ?? 7) as Period;
  const period: Period = ALLOWED_PERIODS.includes(periodParam) ? periodParam : 7;

  if (keywords.length === 0) {
    return NextResponse.json({ error: "검색할 키워드를 1개 이상 입력해 주세요." }, { status: 400 });
  }

  const publishedAfter = new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString();

  try {
    const keywordsByVideoId = new Map<string, string[]>();

    const searchResults = await Promise.all(
      keywords.map(async (keyword) => {
        const searchQuery = keyword.includes("주식") ? keyword : `${keyword} 주식`;
        const ids = await searchVideoIds(searchQuery, publishedAfter, apiKey, MAX_RESULTS_PER_KEYWORD);
        return { keyword, ids };
      })
    );

    const allIds = new Set<string>();
    for (const { keyword, ids } of searchResults) {
      for (const id of ids) {
        allIds.add(id);
        const existing = keywordsByVideoId.get(id) ?? [];
        existing.push(keyword);
        keywordsByVideoId.set(id, existing);
      }
    }

    const rawDetails = await fetchVideoDetails(Array.from(allIds), apiKey);
    const videos = buildVideoStats(rawDetails, keywordsByVideoId).sort(
      (a, b) => b.trendScore - a.trendScore || b.viewCount - a.viewCount
    );

    const topVideos = videos.slice(0, 10);
    const topKeywords = buildKeywordStats(videos, keywords);
    const frequentTerms = extractFrequentTerms(videos.map((v) => `${v.title} ${v.description}`), 10);
    const summary = buildSummary(period, topKeywords, frequentTerms, videos.length);

    const payload: TrendAnalysisResponse = {
      period,
      keywords,
      videos: videos.slice(0, MAX_VIDEOS_RETURNED),
      topVideos,
      topKeywords,
      frequentTerms,
      summary,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof YoutubeApiClientError) {
      return NextResponse.json({ error: `YouTube API 오류: ${error.message}` }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ error: "트렌드 분석 중 알 수 없는 오류가 발생했습니다." }, { status: 500 });
  }
}
