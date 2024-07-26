export default function Page() {
  return (
    <>
      <div className="flex w-full px-[100px]">
        <div className="sticky top-0 w-[100px] h-[200px] bg-slate-400   border border-red-700">
          left
        </div>
        <div className=" flex-1 h-[2000px] bg-gray-500 mr-[20px]  border border-red-700">
          content
        </div>
        <div className="sticky top-0 w-[500px] h-fit border border-red-700 ">
          必须有明确的h-[500px]，只有 min-h-screen 则会失效
          {/*<div className={min-h-screen}>min-h-screen</div>*/}
          <h1>position: sticky（粘性定位）</h1>
          粘性定位是一种混合定位模式，元素在滚动范围内满足特定条件时表现为相对定位，在滚动超出这个范围时则转换为固定定位。
          <p>
            position &#58;sticky; top: 0; /*
            <br />
            当元素到达浏览器视口顶部时，它会“粘”在那里 */ <br />
          </p>
        </div>
        <div className="sticky top-0 w-[100px] min-h-screen border border-red-700 ">
          我飘了
        </div>
      </div>
    </>
  );
}
