import { greet } from "./layout/heading"; //引js
import "./main.css"; //引css
import logo from "./logo.png"; //引图片
greet("zhagnsan");
/**
 * 一定有dom 使用的方法才会被导出，否则不预导出
 */
document.getElementById("clickButton").addEventListener("click", function () {
  alert(greet("zhangsan"));
  alert(greet);
});

export default function () {
  greet("zhangsan");
}

const image = new Image();
image.src = logo;
document.getElementById("img").append(image);
