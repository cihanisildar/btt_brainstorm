import type { Topic, Idea, Comment, Like, SortOption } from "./entities";

export interface CreateTopicRequest {
  title: string;
  description?: string;
}

export interface CreateTopicResponse {
  topic: Topic;
}

export interface GetTopicsResponse {
  topics: Topic[];
}

export interface GetTopicResponse {
  topic: Topic;
}

export interface CreateIdeaRequest {
  topic_id: string;
  content: string;
}

export interface CreateIdeaResponse {
  idea: Idea;
}

export interface GetIdeasRequest {
  topic_id: string;
  sort?: SortOption;
}

export interface GetIdeasResponse {
  ideas: Idea[];
}

export interface UpdateIdeaRequest {
  idea_id: string;
  content: string;
}

export interface UpdateIdeaResponse {
  idea: Idea;
}

export interface DeleteIdeaResponse {
  success: boolean;
}

export interface ToggleLikeRequest {
  idea_id: string;
}

export interface ToggleLikeResponse {
  liked: boolean;
  likes_count: number;
}

export interface GetLikesResponse {
  likes: Like[];
}

export interface CreateCommentRequest {
  idea_id: string;
  content: string;
}

export interface CreateCommentResponse {
  comment: Comment;
}

export interface GetCommentsResponse {
  comments: Comment[];
}

export interface UpdateCommentRequest {
  comment_id: string;
  content: string;
}

export interface UpdateCommentResponse {
  comment: Comment;
}

export interface DeleteCommentResponse {
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
}

