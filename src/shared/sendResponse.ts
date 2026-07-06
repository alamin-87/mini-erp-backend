import type { Response } from "express";

interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface IApiResponse<T> {
  httpStatusCode: number;
  success?: boolean; 
  message: string;
  data?: T;
  meta?: IPaginationMeta;
}


export const sendResponse = <T>(
  res: Response,
  response: IApiResponse<T>
) => {
  const { httpStatusCode, success, message, data, meta } = response;

  const responseBody: Record<string, unknown> = {
    success: success ?? (httpStatusCode >= 200 && httpStatusCode < 300),
    message,
  };

  if (data !== undefined) responseBody.data = data;
  if (meta !== undefined) responseBody.meta = meta;

  res.status(httpStatusCode).json(responseBody);
};