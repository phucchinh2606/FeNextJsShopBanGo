export enum NewsStatus {
  Draft = 0,
  Published = 1,
  Archived = 2,
}

export interface NewsDto {
  newsId: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  status: NewsStatus;
  createdAt: string;
  updatedAt?: string | null;
  authorId: string;
  authorName: string;
}

export interface GetAllNewsQuery {
  searchTerm?: string;
  status?: NewsStatus;
  authorId?: string;
  sortBy?: string;
  isDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateNewsCommand {
  title: string;
  summary: string;
  content: string;
  status?: NewsStatus;
  authorId: string;
  image?: File;
}

export interface UpdateNewsCommand {
  title: string;
  summary: string;
  content: string;
  status: NewsStatus;
  authorId: string;
  image?: File;
}
