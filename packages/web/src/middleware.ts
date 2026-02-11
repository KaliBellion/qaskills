import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicWebhook = createRouteMatcher(['/api/webhooks(.*)']);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/skills/create(.*)',
  '/api/reviews(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/api/')) {
    console.log(`🛡️ [v7-hotfix] Middleware running for: ${path} | method: ${request.method}`);
  }
  if (isPublicWebhook(request)) {
    return;
  }
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
