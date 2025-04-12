export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export const successResponse = <T>(
  data: T,
  message: string,
): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const errorResponse = (
  code: string,
  message: string,
): ApiResponse<null> => ({
  success: false,
  error: { code, message },
});

export interface AppError {
  error: {
    code: string;
    message: string;
  };
}
