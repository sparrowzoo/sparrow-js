import { AccessibleIcon } from "@radix-ui/react-accessible-icon";

const CrossIcon = () => (
  <svg
    viewBox="0 0 32 32"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
  >
    <path d="M2 30 L30 2 M30 30 L2 2" />
  </svg>
);

export default function Page() {
  return (
    <p>
      Some text with an inline accessible icon{" "}
      <AccessibleIcon label="Close">
        <CrossIcon />
      </AccessibleIcon>
      <CrossIcon />
      <AccessibleIcon label="Close">
        <span>X</span>
      </AccessibleIcon>
    </p>
  );
}
