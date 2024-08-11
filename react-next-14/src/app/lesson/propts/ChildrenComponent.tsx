
import React from "react";

function Card({ children }: any) {
  return <div className="card">{children}</div>;
}

/**
 * - error Error: Objects are not valid as a React child (found: object with keys {children}). If you meant to render a collection of children, use an array instead.
 * @param array
 * @constructor
 */
// function Card(array: any) {
//   return <div className="card">{array}</div>;
// }

function Children() {
  return <div>children</div>;
}

export default function ChildrenComponent() {
  return (
    <Card>
        {/*https://react.docschina.org/learn/passing-props-to-a-component*/}
      <Children />
      <Children />
    </Card>
  );
}
