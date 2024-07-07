// @ts-ignore
import md from './aspect-ratio.md';
import Markdown from "react-markdown";
import React from "react";

export default function AspectRatio() {
    return <div>
        <Markdown>{md}</Markdown>
        <iframe className="w-full aspect-video hover:aspect-square md:aspect-square"
            src="//player.bilibili.com/player.html?isOutside=true&aid=1706034835&bvid=BV1CT421r7uK&cid=1604475279&p=1"
           ></iframe>
自定义宽高比

    </div>
}