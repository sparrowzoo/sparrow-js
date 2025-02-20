import SessionItem from "@/components/SessionItem";

export default function SessionList() {
  return (
    <div className={"flex flex-col"}>
      <SessionItem sessionKey={"1"} />
      <SessionItem sessionKey={"2"} />
      <SessionItem sessionKey={"3"} />
    </div>
  );
};
