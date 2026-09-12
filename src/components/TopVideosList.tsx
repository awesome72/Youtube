import Image from "next/image";
import type { VideoStat } from "@/types/youtube";
import { formatCompactKo, formatDate } from "@/lib/format";

interface TopVideosListProps {
  videos: VideoStat[];
}

export default function TopVideosList({ videos }: TopVideosListProps) {
  if (videos.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        표시할 영상이 없습니다.
      </div>
    );
  }

  return (
    <ol className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
      {videos.map((video, index) => (
        <li key={video.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
          <span className="w-6 shrink-0 text-center text-lg font-semibold text-slate-300 dark:text-slate-600">
            {index + 1}
          </span>

          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700"
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
              className="truncate text-sm font-semibold text-slate-900 hover:text-blue-600 dark:text-slate-50"
              title={video.title}
            >
              {video.title}
            </a>
            <span className="truncate text-xs text-slate-500 dark:text-slate-400">
              {video.channelTitle} · {formatDate(video.publishedAt)}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span>조회수 {formatCompactKo(video.viewCount)}</span>
              <span>좋아요 {formatCompactKo(video.likeCount)}</span>
              <span>참여율 {video.engagementRate.toFixed(2)}%</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end justify-center gap-1">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Trend {video.trendScore}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
