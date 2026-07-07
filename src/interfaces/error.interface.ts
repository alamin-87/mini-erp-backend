export interface TErrorSources {
  path?: string;
  message: string;
  value?: unknown;
}

export interface TErrorResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  errorSources: TErrorSources[];
  stack?: string;
  error?: unknown;
  metadata?: Record<string, any> | undefined;
}
