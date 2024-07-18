export default function Page() {
  return (
    <>
      <div className=" border border-red-700">
        <h1>Static parent 默认定位方式</h1>
        <p>Static parent 默认定位方式，子元素不会随着父元素的滚动而滚动。</p>
        <p>
          默认定位方式，元素按照标准的文档流（normal
          flow）顺序进行排列。这意味着元素不会受到top、right、bottom、left属性的影响，
          始终保持在原本的位置。
        </p>
        <div className="absolute bottom-0 left-0 border border-red-700 h-[100px] w-[400px] text-red-700 bg-black">
          <p>Absolute child</p>
        </div>
      </div>
    </>
  );
}
