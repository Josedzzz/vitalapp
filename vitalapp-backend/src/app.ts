import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import router from "./routes/router.ts";
import { errorResponse } from "./utils/response.ts";

const app = new Application();

// global middleware of errors
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Unhandled error:", err);
    ctx.response.status = 500;
    ctx.response.body = errorResponse("INTERNAL_ERROR", "Something went wrong");
  }
});

// used routes
app.use(router.routes());
app.use(router.allowedMethods());

// start the server
const PORT = Number(Deno.env.get("PORT")) || 3000;
console.log(`🚀 Server running at http://localhost:${PORT}`);
await app.listen({ port: PORT });
