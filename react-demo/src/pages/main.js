import {greet} from "./layout/heading";
import './main.css'
greet("zhagnsan");
/**
 * 一定有dom 使用的方法才会被导出，否则不预导出
 */
// document.getElementById("hello").addEventListener('click', function () {
//     alert(greet('zhangsan'));
//     alert(greet);
// });

export default  function (){
    greet("zhangsan");
}
// document.getElementById("hello").classList.add("main");

