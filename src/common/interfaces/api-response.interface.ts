export interface ApiResponse<T> {
  code?: string;
  message: string;
  data: T;
  isError: boolean;
  status: number;
  timestamp: string;
  path: string;
}
