import Link from "next/link";

function Dashboard() {
  return <div>dashboard</div>;
}

export default function Page() {
  return (
    <>
      <Dashboard key={"dashboard"} />
      <Link href="/post?slug=something" as="/post/something" content={"HI"}>
        hi
      </Link>
    </>
  );
}
