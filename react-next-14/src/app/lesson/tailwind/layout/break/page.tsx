export default function page() {
  return (
    <>
      默认按内容平均分成N列，但如果某个元素的长度过高，会被平均到另一列
      这种情况可能通过break-after-column 强制换行，避免跨多个列
      <div className="columns-2">
        <p>Well, let me tell you something, ...</p>
        <p className="hover:break-after-column">
          Sure, go ahead, laugh... laugh 我爱北京天安门天安门上太阳升,
          我爱北京天安门天安门上太阳升
        </p>
        <p>Maybe we can live without...</p>
        <p>Look. If you think this is...</p>
      </div>
      <div className="columns-2">
        <p>Well, let me tell you something, ...</p>
        <p className="hover:break-before-column">
          Sure, go ahead, laugh... laugh 我爱北京天安门天安门上太阳升,
          我爱北京天安门天安门上太阳升
        </p>
        <p>Maybe we can live without...</p>
        <p>Look. If you think this is...</p>
      </div>
    </>
  );
}
