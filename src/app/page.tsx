"use client";

import { useCallback, useEffect, useState } from "react";
import KeywordPicker from "@/components/KeywordPicker";
import PeriodToggle from "@/components/PeriodToggle";
import StatCard from "@/components/StatCard";
import FrequentTermsChart from "@/components/FrequentTermsChart";
import KeywordPerformanceChart from "@/components/KeywordPerformanceChart";
import TopVideosList from "@/components/TopVideosList";
import { DEFAULT_KEYWORDS } from "@/lib/constants";
import { formatCompactKo } from "@/lib/format";
import type { Period, TrendAnalysisResponse } from "@/types/youtube";

export default function Home() {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(DEFAULT_KEYWORDS);
  const [period, setPeriod] = useState<Period>(7);
  const [data, setData] = useState<TrendAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    if (selectedKeywords.length === 0) {
      setError("검색할 키워드를 1개 이상 선택하거나 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        keywords: selectedKeywords.join(","),
        period: String(period),
      });
      const res = await fetch(`/api/youtube?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "요청 처리 중 오류가 발생했습니다.");
      }

      setData(json as TrendAnalysisResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedKeywords, period]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional initial data fetch on mount
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only; keyword/period changes are applied via the button
  }, []);

  const totalViews = data?.videos.reduce((sum, v) => sum + v.viewCount, 0) ?? 0;
  const avgTrendScore = data?.videos.length
    ? Math.round(data.videos.reduce((sum, v) => sum + v.trendScore, 0) / data.videos.length)
    : 0;
  const avgEngagement = data?.videos.length
    ? data.videos.reduce((sum, v) => sum + v.engagementRate, 0) / data.videos.length
    : 0;

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-card-border)] bg-[var(--color-card-bg)]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <h1 className="text-[34px] font-semibold leading-[1.15] tracking-[-0.374px] text-[var(--color-text-primary)]">
            YouTube Trend Lens
          </h1>
          <p className="mt-1 text-[14px] tracking-[-0.224px] text-[var(--color-text-secondary)]">
            키워드 기반 YouTube 영상 트렌드 분석 대시보드
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <section className="rounded-card border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="mb-2 text-[17px] font-semibold tracking-[0.231px] text-[var(--color-text-primary)]">
                검색 키워드
              </h2>
              <KeywordPicker selected={selectedKeywords} onChange={setSelectedKeywords} />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-2 text-[17px] font-semibold tracking-[0.231px] text-[var(--color-text-primary)]">
                  분석 기간
                </h2>
                <PeriodToggle value={period} onChange={setPeriod} />
              </div>
              <button
                type="button"
                onClick={runAnalysis}
                disabled={loading}
                className="rounded-pill bg-primary px-[22px] py-[11px] text-[17px] font-normal text-white transition-transform hover:bg-[var(--color-primary-focus)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "분석 중..." : "트렌드 분석하기"}
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-card border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] px-4 py-3 text-[14px] text-[var(--color-danger-text)]">
            {error}
          </div>
        )}

        {data && (
          <>
            <section className="rounded-card border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 text-[17px] leading-[1.47] tracking-[-0.374px] text-[var(--color-text-primary)]">
              {data.summary}
            </section>

            <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="수집 영상 수" value={`${data.videos.length}건`} />
              <StatCard label="평균 Trend Score" value={`${avgTrendScore}`} hint="0~100, 조회수 증가 속도 기반 추정치" />
              <StatCard label="총 조회수" value={formatCompactKo(totalViews)} />
              <StatCard label="평균 참여율" value={`${avgEngagement.toFixed(2)}%`} hint="(좋아요+댓글) / 조회수" />
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-card border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6">
                <h2 className="mb-4 text-[17px] font-semibold tracking-[0.231px] text-[var(--color-text-primary)]">
                  자주 등장하는 키워드 TOP 10
                </h2>
                <FrequentTermsChart data={data.frequentTerms} />
              </div>

              <div className="rounded-card border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6">
                <h2 className="mb-4 text-[17px] font-semibold tracking-[0.231px] text-[var(--color-text-primary)]">
                  검색어별 성과 비교
                </h2>
                <KeywordPerformanceChart data={data.topKeywords} />
              </div>
            </section>

            <section className="rounded-card border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6">
              <h2 className="mb-4 text-[17px] font-semibold tracking-[0.231px] text-[var(--color-text-primary)]">
                조회수 증가 가능성이 높은 영상 TOP 10
              </h2>
              <TopVideosList videos={data.topVideos} />
            </section>
          </>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-[12px] tracking-[-0.12px] text-[var(--color-text-secondary)] sm:px-6">
        Trend Score는 YouTube API의 실시간 조회수와 게시 경과일을 기반으로 한 추정치이며, 투자 자문이 아닙니다.
      </footer>
    </div>
  );
}
