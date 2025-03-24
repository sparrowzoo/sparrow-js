import Section from "@/app/lesson/context/Section";
import { Child } from "@/app/lesson/context/Child";

export default function Page() {
  return (
    <Section level={1}>
      <Child />
      <Section level={2}>
        <Child />
      </Section>
    </Section>
  );
}
