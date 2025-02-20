import Link from "next/link";

function Dashboard() {
  return <div>dashboard</div>;
}

export default function Page() {
  return (
    <>
      <Link
        href="/home"
        as="/home"
        content={"home"}
      >
        Page Route
      </Link>
      <br />
      <Link
        href="/lesson/next/route/link/client"
        as="/lesson/next/route/link/client"
        content={"App Route Client"}
      >
        App Route Client
      </Link>
      <br />
      <Link
        href="/lesson/next/route/link/server"
        as="/lesson/next/route/link/server"
        content={"App Route Server"}
      >
        App Route Server
      </Link>
      <br />

      <a
        href="/lesson/next/route/link/server"
      >
        App Route Server A标签
      </a>
      <br />
    </>
  );
}
