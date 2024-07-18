export default function Page() {
  return (
    <>
      <div className="border border-red-700 h-[1200px]">
        <h1>Fixed parent</h1>
        <p>
          固定定位同样让元素脱离文档流，但它总是相对于浏览器视口定位，也就是说，无论页面如何滚动，元素都会保持在屏幕上的同一位置。
        </p>
        <div className={"h-[1000px]"}></div>

        <div className="fixed bottom-0 left-0 border border-red-700 h-[100px] w-[400px] text-red-700 bg-black">
          <p>Absolute child</p>
        </div>
      </div>
    </>
  );
}
