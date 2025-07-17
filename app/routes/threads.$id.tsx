import type { Route } from "./+types/threads.$id";

type Post = {
  id: string;
  post: string;
};

type Thread = {
  threadId: string;
  posts: Post[];
};

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  console.log("Loading thread with ID:", id);

  // Fetch thread details from the API
  const response = await fetch(
    `https://railway.bulletinboard.techtrain.dev/threads/${id}/posts?offset=0`,
  );

  // console.log("Response:", await response.json());

  // if (!response.ok) {
  //   return data(
  //     { error: "スレッドの取得に失敗しました。" },
  //     { status: response.status },
  //   );
  // }
  return (await response.json()) as Thread;
}
export default function ThreadDetail({ loaderData }: Route.ComponentProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-rose-500 dark:text-rose-300 mb-6">
        投稿一覧
      </h2>
      <div className="flex flex-col gap-4">
        {loaderData.posts.map(({ id, post }) => (
          <div
            key={id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-rose-100 dark:border-rose-900"
          >
            <p className="text-gray-900 dark:text-gray-100 text-base">{post}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
