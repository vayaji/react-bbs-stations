import { useEffect, useRef } from "react";
import { data, useFetcher } from "react-router";
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

  // Fetch thread details from the API
  const response = await fetch(
    `https://railway.bulletinboard.techtrain.dev/threads/${id}/posts?offset=0`,
  );
  if (!response.ok) {
    return data(
      { error: "スレッドの取得に失敗しました。" },
      { status: response.status },
    );
  }
  return (await response.json()) as Thread;
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const { id } = params;
  const postContent = formData.get("post");

  if (typeof postContent !== "string" || postContent.trim() === "") {
    return data({ errors: { post: "投稿内容は必須です。" } }, { status: 400 });
  }

  const response = await fetch(
    `https://railway.bulletinboard.techtrain.dev/threads/${id}/posts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: postContent }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    console.log(JSON.stringify({ post: postContent }));
    console.log(`https://railway.bulletinboard.techtrain.dev/${id}/posts`);
    if (error.message) {
      return data(
        { errors: { post: error.message } },
        { status: response.status },
      );
    } else {
      console.error(error);
      return data(
        { errors: { post: "投稿の作成に失敗しました。" } },
        { status: response.status },
      );
    }
  }
}
export default function ThreadDetail({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const data = loaderData as Thread;
  const posts = data.posts || [];
  const errors = fetcher.data?.errors;
  useEffect(() => {
    if (formRef.current && posts.length > 0) {
      formRef.current.reset();
    }
  }, [posts]);
  return (
    <div className="max-w-2xl mx-auto">
      {"error" in loaderData ? (
        <p className="text-red-500 text-center mt-4">{loaderData.error}</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-rose-500 dark:text-rose-300 mb-6">
            投稿一覧
          </h2>
          <fetcher.Form method="post" className="mb-3" ref={formRef}>
            {errors?.post && (
              <p className="text-red-500 text-sm">{errors.post}</p>
            )}
            <div className="flex gap-2 items-stretch">
              <input
                type="text"
                name="post"
                placeholder="投稿内容を入力"
                className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-neutral-800 shadow p-4 border border-rose-100 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-900 dark:text-gray-100"
              />
              <button
                type="submit"
                className="bg-rose-400 text-white text-lg font-semibold px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
              >
                投稿
              </button>
            </div>
          </fetcher.Form>
          <div className="flex flex-col gap-4">
            {loaderData.posts.map(({ id, post }) => (
              <div
                key={id}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 border border-rose-100 dark:border-neutral-600"
              >
                <p className="text-gray-900 dark:text-gray-100 text-base">
                  {post}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
