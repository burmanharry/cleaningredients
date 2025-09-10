// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-gray-100 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6">
            The Trusted Marketplace for Functional Ingredients
          </h1>
          
          <form action="/search" method="GET" className="mt-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-black/10 shadow">
              <input
                name="q"
                type="search"
                placeholder="e.g. ashwagandha"
                className="w-full bg-transparent placeholder-black/60 focus:outline-none text-base md:text-lg"
              />
              <button className="px-4 py-2 rounded-xl bg-black text-white font-medium">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>
      
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-semibold mb-8">Coming Soon</h2>
          <p>Your ingredients marketplace will be restored shortly.</p>
        </div>
      </section>
    </main>
  );
}