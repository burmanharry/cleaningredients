// app/account/loading.tsx
export default function Loading() {
  return (
    <div className="container-page">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-40 rounded bg-gray-200" />
        <div className="h-4 w-72 rounded bg-gray-200" />
        <div className="h-4 w-52 rounded bg-gray-200" />
        <div className="h-10 w-64 rounded bg-gray-300" />
      </div>
    </div>
  );
}
