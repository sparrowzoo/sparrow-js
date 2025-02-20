import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return <div>
    <Header />
    <h1>Home Page</h1>
    <Link
      href="/about"
      as="/about"
      content={"about"}
    >
      About
    </Link>
<br />
    <Link
      href="/hello"
      as="/hello"
      content={"hello"}
    >
      Hello
    </Link>
  </div>;
}
