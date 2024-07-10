export default function page() {
  return (
    <>
      <h1>用于爆布流图片展示</h1>
      <h1>直接分三列</h1>
      <h2>Adding based on column count(基于列数添加)</h2>
      <p>
        Use utilities like columns-2 and columns-3 to set the number of columns
        that should be created for the content within an element. The column
        width will be automatically adjusted to accommodate that number.
        用象'columns-2
        columns-3'这样的类来设置列的数量（元素中内容被创建的列数）
        内容的列宽会自动调整来适配这个number
      </p>
      <div className="columns-3">
        <img className="w-full" src="/columns/1.jpg" />
        <img className="w-full" src="/columns/2.jpg" />
        <img className="w-full" src="/columns/3.jpg" />
        <img className="w-full" src="/columns/4.jpg" />
        <img className="w-full" src="/columns/5.jpg" />
      </div>
      <h1>每列宽columns: 16rem; /* 256px */</h1>

      <h2>Adding based on column width(基于理想列宽进行添加)</h2>
      <p>
        Use utilities like columns-xs and columns-sm to set the ideal(理想)
        column width for the content within an element(最外层的DIV), with the
        number of columns (the count) automatically adjusting to
        accommodate（适应） that value.
        使用像columns-xs和columns-sm这样的实用工具为元素中的内容设置理想的列宽度，
        列的数量会自动调整以适应该值。
      </p>
      <div className="columns-3xs">
        <img className="w-full" src="/columns/1.jpg" />
        <img className="w-full" src="/columns/2.jpg" />
        <img className="w-full" src="/columns/3.jpg" />
        <img className="w-full" src="/columns/4.jpg" />
        <img className="w-full" src="/columns/5.jpg" />
      </div>
    </>
  );
}
