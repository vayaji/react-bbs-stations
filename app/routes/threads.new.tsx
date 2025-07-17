import { data, Form, redirect, useFetcher } from "react-router";
import type { Route } from "./+types/threads.new";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  if (typeof title !== "string" || title.trim() === "") {
    return data({ errors: { title: "タイトルは必須です。" } }, { status: 400 });
  }
  const response = await fetch(
    "https://railway.bulletinboard.techtrain.dev/threads",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    if (error.message) {
      return data(
        { errors: { message: error.message } },
        { status: response.status },
      );
    } else {
      console.log(error);
      return data(
        { errors: { message: "スレッドの作成に失敗しました。" } },
        { status: response.status },
      );
    }
  }
  const newThread = await response.json();
  return redirect(`/threads/${newThread.id}`);
}

export default function NewThread() {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors;
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-rose-100 dark:border-rose-900">
      <h2 className="text-2xl font-bold text-rose-500 dark:text-rose-300 mb-6">
        新規スレッド作成
      </h2>
      <fetcher.Form method="post" className="flex flex-col gap-4">
        {errors?.message && (
          <p className="text-red-500 text-sm">{errors.message}</p>
        )}
        <input
          type="text"
          name="title"
          placeholder="タイトルを入力"
          // required
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
        {errors?.title && (
          <p className="text-red-500 text-sm">{errors.title}</p>
        )}
        <button
          type="submit"
          className="bg-rose-400 text-white text-lg font-semibold py-2 rounded-xl shadow hover:shadow-lg transition-all"
        >
          作成する
        </button>
      </fetcher.Form>
    </div>
  );
}
