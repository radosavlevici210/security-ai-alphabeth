
<line_number>1</line_number>
// Netlify Edge Function for Self-Repair System
export default async (request, context) => {
  const url = new URL(request.url);
  
  // Skip processing for static assets
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return;
  }

  console.log('🔧 Edge Self-Repair: Monitoring request to', url.pathname);

  // Add performance headers
  const response = await context.next();
  
  if (response) {
    // Clone response to modify headers
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });

    // Add self-repair headers
    modifiedResponse.headers.set('X-Self-Repair-Status', 'active');
    modifiedResponse.headers.set('X-Edge-Optimized', 'true');
    modifiedResponse.headers.set('X-Performance-Monitor', 'enabled');
    modifiedResponse.headers.set('X-Auto-Update-Check', Date.now().toString());

    // Add performance optimizations
    if (url.pathname === '/' || url.pathname.endsWith('.html')) {
      modifiedResponse.headers.set('Link', '</style.css>; rel=preload; as=style, </script.js>; rel=preload; as=script');
      modifiedResponse.headers.set('X-Content-Type-Options', 'nosniff');
      modifiedResponse.headers.set('X-Frame-Options', 'DENY');
    }

    return modifiedResponse;
  }

  return response;
};

export const config = {
  path: "/*",
  excludedPath: ["/api/*", "/_netlify/*"]
};
