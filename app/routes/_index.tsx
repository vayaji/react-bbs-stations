import { Link } from "react-router";
import type { Route } from "./+types/_index";

type Thread = {
  id: string;
  title: string;
};

export async function loader() {
  const threads = await fetch(
    "https://railway.bulletinboard.techtrain.dev/threads?offset=0",
  );
  return (await threads.json()) as Thread[];
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {loaderData.map(({ id, title }) => (
        <Link
          key={id}
          to={`/threads/${id}`}
          className="block bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-4 border border-rose-100 dark:border-rose-900 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
          tabIndex={0}
          aria-label={title}
        >
          <span className="text-rose-500 dark:text-rose-300 text-lg font-semibold hover:underline">
            {title}
          </span>
        </Link>
      ))}
    </div>
  );
}
