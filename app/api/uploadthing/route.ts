import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Configuration pour indiquer à Next.js que cette route est dynamique
export const dynamic = "force-dynamic";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});