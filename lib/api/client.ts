import axios, { AxiosError, type AxiosInstance } from "axios";
import type {
  ApiError,
  CreateTopicRequest,
  CreateTopicResponse,
  GetTopicsResponse,
  GetTopicResponse,
  CreateIdeaRequest,
  CreateIdeaResponse,
  GetIdeasRequest,
  GetIdeasResponse,
  UpdateIdeaRequest,
  UpdateIdeaResponse,
  DeleteIdeaResponse,
  ToggleLikeRequest,
  ToggleLikeResponse,
  GetLikesResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  GetCommentsResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  DeleteCommentResponse,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        // You can add token from localStorage or cookies here
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        // Handle errors globally
        return Promise.reject(error);
      }
    );
  }

  // Topics
  async createTopic(data: CreateTopicRequest): Promise<CreateTopicResponse> {
    const response = await this.client.post<CreateTopicResponse>("/topics", data);
    return response.data;
  }

  async getTopics(): Promise<GetTopicsResponse> {
    const response = await this.client.get<GetTopicsResponse>("/topics");
    return response.data;
  }

  async getTopicById(id: string): Promise<GetTopicResponse> {
    const response = await this.client.get<GetTopicResponse>(`/topics/${id}`);
    return response.data;
  }

  // Ideas
  async createIdea(data: CreateIdeaRequest): Promise<CreateIdeaResponse> {
    const response = await this.client.post<CreateIdeaResponse>("/ideas", data);
    return response.data;
  }

  async getIdeas(params: GetIdeasRequest): Promise<GetIdeasResponse> {
    const response = await this.client.get<GetIdeasResponse>("/ideas", {
      params,
    });
    return response.data;
  }

  async updateIdea(data: UpdateIdeaRequest): Promise<UpdateIdeaResponse> {
    const response = await this.client.put<UpdateIdeaResponse>(
      `/ideas/${data.idea_id}`,
      { content: data.content }
    );
    return response.data;
  }

  async deleteIdea(ideaId: string): Promise<DeleteIdeaResponse> {
    const response = await this.client.delete<DeleteIdeaResponse>(
      `/ideas/${ideaId}`
    );
    return response.data;
  }

  // Likes
  async toggleLike(data: ToggleLikeRequest): Promise<ToggleLikeResponse> {
    const response = await this.client.post<ToggleLikeResponse>(
      "/likes/toggle",
      data
    );
    return response.data;
  }

  async getLikes(ideaId: string): Promise<GetLikesResponse> {
    const response = await this.client.get<GetLikesResponse>(
      `/likes?idea_id=${ideaId}`
    );
    return response.data;
  }

  // Comments
  async createComment(data: CreateCommentRequest): Promise<CreateCommentResponse> {
    const response = await this.client.post<CreateCommentResponse>(
      "/comments",
      data
    );
    return response.data;
  }

  async getComments(ideaId: string): Promise<GetCommentsResponse> {
    const response = await this.client.get<GetCommentsResponse>(
      `/comments?idea_id=${ideaId}`
    );
    return response.data;
  }

  async updateComment(data: UpdateCommentRequest): Promise<UpdateCommentResponse> {
    const response = await this.client.put<UpdateCommentResponse>(
      `/comments/${data.comment_id}`,
      { content: data.content }
    );
    return response.data;
  }

  async deleteComment(commentId: string): Promise<DeleteCommentResponse> {
    const response = await this.client.delete<DeleteCommentResponse>(
      `/comments/${commentId}`
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();

