"use client";
import { DirectionProvider } from "@radix-ui/react-direction";
import React from "react";

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rtl, setRtl] = React.useState(false);

  return (
    <div style={{ height: "100vh", backgroundColor: "#e5e8eb" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 20,
          paddingBottom: 30,
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={rtl}
            onChange={(event) => setRtl(event.currentTarget.checked)}
          />
          Right-to-left
        </label>
      </div>
      <DirectionProvider dir={rtl ? "rtl" : "ltr"}>
        <div dir={rtl ? "rtl" : "ltr"}>
          <h2>Test page content</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            purus odio, vestibulum in dictum et,{" "}
            <a href="#example">sagittis vel nibh</a>. Fusce placerat arcu lorem,
            a scelerisque odio fringilla sit amet. Suspendisse volutpat sed diam
            ut cursus. Nulla facilisi. Ut at volutpat nibh. Nullam justo mi,
            elementum vitae ex eu, <a href="#example">gravida dictum metus</a>.
            Morbi vulputate consectetur cursus. Fusce vitae nisi nunc.
            Suspendisse pellentesque aliquet tincidunt. Aenean molestie pulvinar
            ipsum.
          </p>
        </div>
      </DirectionProvider>
    </div>
  );
};
export default Page;
