export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Welcome to ExpressIt BD</h1>
        <p className="mt-2 text-lg">
          A Next.js challenge with TypeScript, Tailwind, and Zod
        </p>
      </header>

      {/* Tech Stack Section */}
      <section className="container mx-auto my-8 p-6 text-center">
        <h2 className="text-2xl font-semibold">Built With</h2>
        <div className="flex justify-center gap-4 mt-4">
          <span className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Next.js
          </span>
          <span className="bg-gray-800 text-white px-4 py-2 rounded-lg">
            TypeScript
          </span>
          <span className="bg-teal-500 text-white px-4 py-2 rounded-lg">
            Tailwind CSS
          </span>
          <span className="bg-purple-600 text-white px-4 py-2 rounded-lg">
            Zod
          </span>
        </div>
      </section>
    </div>
  );
}
