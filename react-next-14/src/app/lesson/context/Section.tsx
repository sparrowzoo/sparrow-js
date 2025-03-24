"use client";
import { LevelContext } from "./LevelContext";

export default function Section({ level, children }) {
  return (
    <section className="section">
      <p>section provider</p>
      <LevelContext.Provider value={level}>{children}</LevelContext.Provider>
    </section>
  );
}
