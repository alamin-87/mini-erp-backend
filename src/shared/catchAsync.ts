import type { NextFunction, Request, Response, RequestHandler } from "express";

const catchAsync = <
  ReqBody = any,
  ResBody = any,
  ReqQuery = any,
  Locals extends Record<string, any> = Record<string, any>,
>(
  fn: (
    req: Request<ReqQuery, ResBody, ReqBody, any, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ) => Promise<any>,
): RequestHandler<ReqQuery, ResBody, ReqBody, any, Locals> => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      console.error("Async route error:", error);
      if (!(error instanceof Error)) {
        error = new Error(typeof error === "string" ? error : "Unknown error");
      }

      next(error);
    });
  };
};

export default catchAsync;
