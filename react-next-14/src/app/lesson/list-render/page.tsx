import React from "react";
import Image from "next/image";

interface AvatarProp {
    id: number;
    name: string;
    avatar: string;
    desc: string;
}

function Avatar(avatar: AvatarProp) {
    return (
        <div key={avatar.id}>
            <h1>{avatar.name}</h1>
            <Image width={100} height={100} src={avatar.avatar} alt={""}/>
            <div>{avatar.desc}</div>
        </div>
    );
}

const userList: AvatarProp[] = [
    {
        id: 3, //唯一标识在map唯一中的位置，不影响渲染的顺序，标识会影响react探测是否重新渲染，因为ID变化会重新渲染
        name: "张三",
        avatar:
            "https://qcloud.dpfile.com/pc/1IzO3QJj183PWI9_DNFDUhPxdc2-ciRYmq6dMULg0dTEvud6kpFOWKITUPDAZ-kDTYGVDmosZWTLal1WbWRW3A.jpg",
        desc: "张三个人简介",
    },
    {
        id: 2,
        name: "李四",
        avatar:
            "https://qcloud.dpfile.com/pc/1IzO3QJj183PWI9_DNFDUhPxdc2-ciRYmq6dMULg0dTEvud6kpFOWKITUPDAZ-kDTYGVDmosZWTLal1WbWRW3A.jpg",
        desc: "李四个人简介",
    },
    {
        id: 1,
        name: "王五",
        avatar:
            "https://qcloud.dpfile.com/pc/1IzO3QJj183PWI9_DNFDUhPxdc2-ciRYmq6dMULg0dTEvud6kpFOWKITUPDAZ-kDTYGVDmosZWTLal1WbWRW3A.jpg",
        desc: "王五个人简介",
    },
];

function UserList() {
    //https://react.docschina.org/learn/passing-props-to-a-component
    //传参时要求按解构结构传，简便方法使用...展开表达式
    const userListCom = userList
        .filter((user) => {
            return user.id >= 1;
        })
        .map((user) => <Avatar key={user.id} {...user} />);

    const userListCom2 = userList.map((user) => (
        <Avatar key={user.id}
                id={user.id}
                name={user.name}
                avatar={user.avatar}
                desc={user.desc}
        />
    ));
    return userListCom;
}

export default function UserHome() {
    return (
        <>
            <h1>列表渲染</h1>
            <p>
                重复代码没有错（它可以更清晰）。但有时你可能会重视简洁。一些组件将它们所有的
                props 转发给子组件，正如 Profile 转给 Avatar
                那样。因为这些组件不直接使用他们本身的任何
                props，所以使用更简洁的“展开”语法是有意义的：
            </p>
            <UserList/>
        </>
    );
}
