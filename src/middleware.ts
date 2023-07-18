import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({ 
  publicRoutes: ["/", "/weather"]
 });

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};