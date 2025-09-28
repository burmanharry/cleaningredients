export const revalidate = 0;
export async function GET() {
  return new Response(`<ok/>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}