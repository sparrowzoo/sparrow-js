export default function FlexJustItemPage() {
  return (
    <div>
      <p>主轴排列看 `justify`，交叉轴对齐用 `items`</p>
      <p>当方向发现改变时 两者作用也会交换 </p>
      <h1>Flex Row with Just Item</h1>
      <div className={"flex flex-row justify-end items-center "}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </div>
      <h1>Flex Column with Just Item</h1>
      <div
        className={
          "flex flex-col justify-start items-start h-[300px]  text-red-700 "
        }
      >
        <div>Item 11111</div>
        <div>Item 2</div>
        <div>Item 31</div>
      </div>
    </div>
  );
}
