import Image from "next/image";
import type { VideoStat } from "@/types/youtube";
import { formatCompactKo, formatDate } from "@/lib/format";

interface TopVideosListProps {
  videos: VideoStat[];
}

export default function TopVideosList({ videos }: TopVideosListProps) {
  if (videos.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-[14px] text-[var(--color-text-secondary)]">
        표시할 영상이 없습니다.
      </div>
    );
  }

  return (
    <ol className="flex flex-col divide-y divide-[var(--color-card-border)]">
      {videos.map((video, index) => (
        <li key={video.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
          <span className="w-6 shrink-0 text-center text-lg font-semibold text-[var(--color-text-secondary)]">
            {index + 1}
          </span>

          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-sm bg-[var(--color-divider-soft)] dark:bg-white/5"
          >
            {video.thumbnail ? (
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
            ) : null}
          </a>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-[14px] font-semibold tracking-[-0.224px] text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
              title={video.title}
            >
              {video.title}
            </a>
            <span className="truncate text-[12px] tracking-[-0.12px] text-[var(--color-text-secondary)]">
              {video.channelTitle} · {formatDate(video.publishedAt)}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] tracking-[-0.12px] text-[var(--color-text-secondary)]">
              <span>조회수 {formatCompactKo(video.viewCount)}</span>
              <span>좋아요 {formatCompactKo(video.likeCount)}</span>
              <span>참여율 {video.engagementRate.toFixed(2)}%</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end justify-center gap-1">
            <span className="rounded-pill bg-primary/10 px-2.5 py-1 text-[12px] font-semibold tracking-[-0.12px] text-primary dark:bg-primary-on-dark/15 dark:text-[var(--color-primary-on-dark)]">
              Trend {video.trendScore}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
