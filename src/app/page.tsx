import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          BioDB Next
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Next.js /PostgreSQL を使ったバイオデータベース演習
        </p>
        <div className="mt-8">
          <Link
            href="/example"
            className="inline-block px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Example →
          </Link>
        </div>
      </main>
    </div>
  );
}
