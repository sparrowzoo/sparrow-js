export default function Page() {
  return (
    <>
      <div className="relative border border-red-700 h-[1200px]">
        <h1>relative absolute parent</h1>
        <p>
          绝对定位使元素脱离文档流，它的位置取决于最近的relative定位祖先元素。如果找不到这样的祖先元素，就相对于浏览器视窗进行定位。
        </p>
        <div className={"h-[1000px]"}></div>
        <div className="absolute bottom-0 left-0 border border-red-700 h-[100px] w-[400px] text-red-700 bg-black">
          <p>Absolute child</p>
        </div>
      </div>
    </>
  );
}
