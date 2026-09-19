import { useEffect, useState } from "react";

export default function ThreeDotLoading() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <></>;
  }
  return (
    <div
      className="flex items-center justify-center gap-2 py-4"
      role="status"
      aria-label="loading"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-3 w-3 animate-bounce rounded-full bg-gray-400"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
