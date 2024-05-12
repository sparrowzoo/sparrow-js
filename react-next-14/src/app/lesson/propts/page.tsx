"use client";
import React from "react";
import ChildrenComponent from "@/app/lesson/propts/ChildrenComponent";
import ChildrenEvent from "@/app/lesson/propts/ChildrenEvent";

interface AvatarPropt {
  title: string;
  avatar: string;
  desc: string;
}

function Avatar({ title, avatar, desc }: AvatarPropt) {
  return (
    <div>
      <h1>{title}</h1>
      <img width={100} height={100} alt={" "} src={avatar} />
      <div>{desc}</div>
    </div>
  );
}

export default function Profile() {
  return (
    <>
      <h2>
        当您将内容嵌套在 JSX 标签中时，父组件将在名为 children 的 prop
        中接收到该内容。例如，下面的 Card 组件将接收一个被设为 &lt;Avatar /&gt;
        的 children prop 并将其包裹在 div 中渲染
      </h2>
      <br />
      <h2>
        可以将带有 children prop 的组件看作有一个“洞”，可以由其父组件使用任意
        JSX 来“填充”。你会经常使用 children prop
        来进行视觉包装：面板、网格等等。
      </h2>

      <Avatar
        desc={"小白"}
        title={"张三"}
        avatar={
          "https://qcloud.dpfile.com/pc/1IzO3QJj183PWI9_DNFDUhPxdc2-ciRYmq6dMULg0dTEvud6kpFOWKITUPDAZ-kDTYGVDmosZWTLal1WbWRW3A.jpg"
        }
      />

      <ChildrenComponent />

      <ChildrenEvent />
    </>
  );
}
