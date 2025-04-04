"use client";
import React, { Suspense, use } from "react";
import ErrorShower from "@/common/components/Error";

interface Post {
  id: string;
  title: string;
}

function Posts() {
  const result = use(fetcher);
  if (result.code != "0") {
    return (
      <div>
        <ErrorShower error={result.message} />
      </div>
    );
  }
  return (
    <ul>
      {result.data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

const fetcher = new Promise<Result>((resolve, reject) => {
  setTimeout(() => {
    // reject({ code: "100", message: "Failed to fetch posts" });
    const postArray: Post[] = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" },
      { id: "3", title: "Post 3" },
    ];
    const result: Result = {
      data: postArray,
      code: "0",
      message: "success",
    };

    resolve(result);
  }, 5000);
});
export default function Page() {
  // Don't await the data fetching function

  return (
    <Suspense fallback={<div>suspense fallback</div>}>
      <Posts />
    </Suspense>
  );
}
