How to correct React Portal error: Target container is not a DOM element
November 4, 2022 by Magenaut
im having an issue getting react portals working. I dont understand why I am receiving error message portal id is not DOM element that is clearly a valid DOM element.

I have a sandbox here

Code in its entirety presented here. The console.log reports correctly that the element is a DOM element but React is throwing an error.
```
import "./styles.css";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function App() {
const [portalDiv, setPortalDiv] = useState(undefined);

useEffect(() => {
let pd = document.getElementById("portalDiv");
console.log(pd);
setPortalDiv(pd);
}, []);

return (
<>
<div id="portalDiv">portal container</div>
<div className="app">
{/* {console.log("render portaldiv", portalDiv)} */}
{
(portalDiv &&
createPortal(
<>
<h1>Inside portal</h1>
</>
),
portalDiv)
}
<h1>Outside portal</h1>
</div>
</>
);
}
```
Any advice appreciated. Thanks.

Thank you for visiting the Q&A section on Magenaut. Please note that all the answers may not help you solve the issue immediately. So please treat them as advisements. If you found the post helpful (or not), leave a comment & I’ll get back to you as soon as possible.


This usecase is not recommended as stated in my comment, but here is a reproducible example.

If you intend to inject a React Node into VDOM, you should use React API for that, so you won’t get a race condition while querying the DOM via DOM API.
```
import "./styles.css";
import { createPortal } from "react-dom";
import { useRef } from "react";

export default function App() {
const containerRef = useRef();

return (
<>
<div ref={containerRef}>portal container</div>
<div id="app">
{containerRef.current &&
createPortal(<h1>Example Element</h1>, containerRef.current)}
<h1>Outside portal</h1>
</div>
</>
);
}
```

How to correct React Portal error: Target container is not a DOM element

https://www.5axxw.com/questions/content/c0wh26
