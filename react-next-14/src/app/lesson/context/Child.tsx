"use client";
import { LevelContext } from "./LevelContext";
import { useContext } from "react";

export function Child() {
  const level = useContext(LevelContext);
  return (
    <div>
      <p>Level: {level}</p>
      {(() => {
        switch (level) {
          case 1:
            return <h1>Level 1</h1>;
          case 2:
            return <h2>Level 2</h2>;
          case 3:
            return <h3>Level 3</h3>;
          default:
            return <>Level {level}</>;
        }
      })()}
    </div>
  );
}
