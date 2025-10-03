// Test route to show cache status
export async function GET() {
  return Response.json({
    timestamp: new Date().toISOString(),
    message:
      "This timestamp changes every request in dynamic routes, but stays static in ISR pages",
    cacheStatus: "dynamic",
  });
}
