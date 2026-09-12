export type Period = 7 | 30;

export interface VideoStat {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  matchedKeywords: string[];
  daysSincePublished: number;
  viewsPerDay: number;
  engagementRate: number;
  trendScore: number;
}

export interface KeywordStat {
  keyword: string;
  videoCount: number;
  totalViews: number;
  avgTrendScore: number;
}

export interface FrequentTerm {
  term: string;
  count: number;
}

export interface TrendAnalysisResponse {
  period: Period;
  keywords: string[];
  videos: VideoStat[];
  topVideos: VideoStat[];
  topKeywords: KeywordStat[];
  frequentTerms: FrequentTerm[];
  summary: string;
  fetchedAt: string;
}

export interface TrendAnalysisError {
  error: string;
}
