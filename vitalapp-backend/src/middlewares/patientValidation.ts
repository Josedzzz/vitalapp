import { Context, Status } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { errorResponse } from "../utils/response.ts";

// middleware to validate the pagination
export const validatePagination = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const url = ctx.request.url;
  const pageParam = url.searchParams.get("page") ?? "1";
  const limitParam = url.searchParams.get("limit") ?? "10";
  const page = parseInt(pageParam);
  const limit = parseInt(limitParam);
  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse(
      "INVALID_PAGINATION",
      "Invalid pagination parameters",
    );
    return;
  }
  ctx.state.pagination = { page, limit };
  await next();
};
