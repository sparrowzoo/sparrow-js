"use client";
import { useRef } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);

  function scrollToId(itemId: number) {
    const map: any = getMap();
    const node = map.get(itemId);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap(): any {
    if (!itemsRef.current) {
      // 首次运行时初始化 Map。
      // @ts-ignore
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToId(6)}>Tom</button>
        <br />
        <button onClick={() => scrollToId(5)}>Maru</button>
        <br />
        <button onClick={() => scrollToId(9)}>Jellylorum</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat.id}
              ref={(node: HTMLLIElement | null) => {
                debugger;
                const map: any = getMap();
                if (node) {
                  map.set(cat.id, node);
                }
              }}
            >
              <img src={cat.imageUrl} alt={"Cat #" + cat.id} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList: any[] = [];

catList.push({
  id: 1,
  imageUrl: "https://ww3.sinaimg.cn/mw690/b0effebely1how77eux2aj227t2yf1l2.jpg",
});
catList.push({
  id: 2,
  imageUrl: "https://ww3.sinaimg.cn/mw690/b0effebely1how77eux2aj227t2yf1l2.jpg",
});
catList.push({
  id: 3,
  imageUrl: "https://ww3.sinaimg.cn/mw690/b0effebely1how77eux2aj227t2yf1l2.jpg",
});
catList.push({
  id: 4,
  imageUrl: "https://ww3.sinaimg.cn/mw690/b0effebely1how77eux2aj227t2yf1l2.jpg",
});
catList.push({
  id: 5,
  imageUrl: "https://ww3.sinaimg.cn/mw690/b0effebely1how77eux2aj227t2yf1l2.jpg",
});
catList.push({
  id: 6,
  imageUrl: "https://ww3.sinaimg.cn/mw690/b0effebely1how77eux2aj227t2yf1l2.jpg",
});
catList.push({
  id: 7,
  imageUrl: "https://ww3.sinaimg.cn/mw690/b0effebely1how77eux2aj227t2yf1l2.jpg",
});
catList.push({
  id: 8,
  imageUrl: "https://ww3.sinaimg.cn/mw690/b0effebely1how77eux2aj227t2yf1l2.jpg",
});
catList.push({
  id: 9,
  imageUrl: "https://ww3.sinaimg.cn/mw690/b0effebely1how77eux2aj227t2yf1l2.jpg",
});

catList.push({
  id: 10,
  imageUrl: "https://ww3.sinaimg.cn/mw690/b0effebely1how77eux2aj227t2yf1l2.jpg",
});
