"use client";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { IoLogoWechat } from "react-icons/io5";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";
import { DynamicImage } from "@/components/img/DynamicImage";
import Talk from "@/components/im/Talk";
import QunPlazaCom from "@/components/qun/QunPlaza";

export default function Page() {
  const ds = [`${NEXT_ASSET_PREFIX}/ds.webp`, `${NEXT_ASSET_PREFIX}/ds2.webp`];
  const pro = [
    `${NEXT_ASSET_PREFIX}/pro1.png`,
    `${NEXT_ASSET_PREFIX}/pro2.png`,
    `${NEXT_ASSET_PREFIX}/pro3.png`,
  ];
  return (
    <div className="h-fix w-full p-4 text-gray-500 dark:text-gray-300">
      <article className={"flex flex-row justify-between items-center"}>
        <DynamicImage
          width={500}
          height={0}
          key={"zhige"}
          alt="志哥"
          className="float-left ..."
          src={`${NEXT_ASSET_PREFIX}/zhige.webp`}
        />
        <div className="p-4 m-4">
          <h2 className="text-3xl font-bold p-4">欢迎来到志哥聊编程</h2>
          <p>
            志哥，一个热爱编程的程序员，热爱分享，热爱开源。欢迎来到志哥聊编程，一起交流编程技术，分享自己的编程经验。
          </p>
          <h2 className="text-3xl font-bold p-4">志哥的工作经历</h2>
          <p>08参加工作,先后就职于:</p>
          <ul className="list-disc list-inside gap-4">
            <li>同程旅游（负责国际机票，全球十亿级运价数据）</li>
            <li>美菜网，负责推荐系统平台架构</li>
            <li>每日优鲜搜推团队，负责最大的流量入口</li>
            <li>每日优鲜算法平台搭建，支持公司供应链采销补配业务</li>
            <li>国内某教育平台技术总监</li>
            <li>现就职于某新零售公司，负责供应链智能补货</li>
          </ul>
          <DynamicImage
            height={0}
            width={200}
            key={"wexin"}
            alt="志哥"
            className="float-right ..."
            src={`${NEXT_ASSET_PREFIX}/wexin.jpeg`}
          />
        </div>
      </article>
      <h1 className="text-center">这里都有啥??</h1>
      <div>
        <h2>起步项目【零基础转盘抽奖项目】</h2>
        <div className="flex flex-row justify-center items-center p-4 m-4">
          <a href="http://lottery.sparrowzoo.com/">
            <DynamicImage
              height={0}
              width={0}
              key={"lottery"}
              className={"w-256"}
              alt="转盘抽奖项目"
              src={`${NEXT_ASSET_PREFIX}/lottery.png`}
            />
          </a>
          <div className="p-4 m-4">
            <h2 className="text-3xl font-bold p-4">项目简介</h2>
            转盘抽奖项目是一个基于Java开发的简单项目: 主要功能
            <ul className="list-disc list-inside gap-4">
              <li>JAVA环境搭建</li>
              <li>JAVA基础语法</li>
              <li>抽奖概率计算统计，随机数生成，融入程序员数学思维</li>
              <li>原生前后端代码实现，从零开始</li>

              <li>项目部署，发布，运维</li>
              <li>nginx 配置，开机自启动配置 单机高可用配置，生产级环境部署</li>
              <li>域名解析上线</li>
              <li>阿里云云效平台使用，进一步了解企业级真实环境</li>
              <li>课程答疑</li>
            </ul>
            <h2 className="text-3xl font-bold p-4">目标</h2>
            <p>
              项目初期，希望能够帮助到有Java基础的同学，快速入门，熟悉Java开发环境，了解Java语法，掌握Java开发的基本技能。
              能将自己开发的简单的小项目，从零到部署上线。
            </p>
            <h2 className="text-3xl font-bold p-4">项目体验地址</h2>
            <a target="_blank" href="https://lottery.sparrowzoo.com/">
              https://lottery.sparrowzoo.com/
            </a>
          </div>
        </div>
      </div>

      <div>
        <h2>进阶 数据结构与算法课程</h2>
        <div className="flex flex-row justify-center items-center gap-4 p-4 m-4">
          <div className={"block w-200"}>
            <Carousel className="w-full">
              <CarouselContent>
                {ds.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <DynamicImage
                            height={0}
                            width={0}
                            key={index}
                            src={img}
                            alt="数据结构与算法课程"
                            className="w-full"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="p-4 m-4">
            <h2 className="text-3xl font-bold p-4">项目简介</h2>
            主要功能
            <ul className="list-disc list-inside gap-4">
              <li>参考国外经典 教材保证内容的权威性和精确性</li>
              <li>结合JDK集合类(数据结构)源分析</li>
              <li>结合志哥多年面试经验，深入剖析数据结构与算法</li>
              <li>Leetcode 经验面试题解析，助力面试加分</li>
            </ul>
            <h2 className="text-3xl font-bold p-4">目标</h2>
            <p>
              逐步深入理解数据结构与算法，掌握Java集合类(数据结构)的使用，对实现工作中的常用数据结构和算法有深入理解。
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2>企业级项目实战</h2>
        <div className="flex flex-row justify-center items-center gap-4 p-4 m-4">
          <div className={"block w-200"}>
            <Carousel className="w-full">
              <CarouselContent>
                {pro.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <DynamicImage
                            height={0}
                            width={0}
                            key={index}
                            src={img}
                            alt="企业级项目实现"
                            className="w-full"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="p-4 m-4">
            <h2 className="text-3xl font-bold p-4">项目亮点</h2>
            <div>
              <ul className="list-disc list-inside gap-4">
                <li>真实企业级开发流程，立拍立入职</li>
                <li>架构师手把手带你落地</li>
                <li>学习群支持</li>
                <li>真实上线运营</li>
              </ul>
            </div>
            <h2 className="text-3xl font-bold p-4">项目简介</h2>
            主要功能
            <ul className="list-disc list-inside gap-4">
              <li>TRD 分析，需要共识 3节</li>
              <li>接口设计 swagger 定义 2节</li>
              <li>数据库设计共识 5节</li>
              <li>代码落地 10</li>
              <li>代码review 10节</li>
              <li>代码对齐讲解 10节</li>
              <li>联调测试 5节</li>
              <li>部署上线 2节</li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <h2>IM 聊天室</h2>
        <div className="flex flex-row justify-center items-center gap-4 p-4 m-4">
          <QunPlazaCom link={false} />
        </div>
      </div>
      <div>
        <h2>web 微信</h2>
        <Link
          className={
            "flex flex-col justify-center items-center gap-4 p-4 m-4 text-3xl"
          }
          title={"进来体验吧!"}
          href={`${NEXT_ASSET_PREFIX}/chat`}
        >
          <IoLogoWechat />
          进来体验吧!
        </Link>
      </div>

      <div>
        <h2>知识星球</h2>
        <div
          className={"flex flex-row justify-center items-center gap-4 p-4 m-4"}
        >
          <a href={"https://wx.zsxq.com/group/48848482481288"}>
            <DynamicImage
              height={0}
              width={0}
              key={"star-ball"}
              alt="知识星球"
              className="w-100"
              src={`${NEXT_ASSET_PREFIX}/star-ball.png`}
            />
          </a>
          <div className="flex flex-row justify-center items-center gap-4 p-4 m-4">
            内容持续更新中....
            <a
              href={
                "https://sparrowzoo.feishu.cn/docx/UrHddloNeojIR7xWZFJc1ViRnbe"
              }
            >
              获取学习大纲
            </a>
          </div>
        </div>
      </div>

      <div>
        <h2>敬请期待</h2>
        <div className="flex flex-row justify-center items-center gap-4 p-4 m-4">
          商城 供应链 搜推 源码 中间件 .....
        </div>
      </div>
      <div className="fixed bottom-20 right-60  ">
        <Talk />
      </div>
    </div>
  );
}
