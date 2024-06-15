"use client";
import React from "react";
import StatusBar from "@/app/lesson/event/NetWork";

function Player({
  onPlayer,
  message,
  text,
}: {
  onPlayer: any;
  message: string;
  text: string;
}) {
  return (
        <input
          className={"button"}
          value={text}
          type={"button"}
          onClick={(e) => {
            onPlayer(message);
          }}
        />
  );
}

function PlayerStop({
  onPlayer,
  message,
  text,
}: {
  onPlayer: any;
  message: string;
  text: string;
}) {
  return (
    <input
      className={"button"}
      value={text}
      type={"button"}
      onClick={(e) => {
        onPlayer(message);
        e.stopPropagation();
      }}
    />
  );
}

export default function Index() {
  function onPlayer(msg: string) {
    alert("player====>" + msg);
  }

  return (
      <>
          <StatusBar/>
          <div
      onClick={(e) => {
        onPlayer("div");
      }}
    >
      <Player
        onPlayer={onPlayer}
        message={"button"}
        text={"点我,我会事件冒泡"}
      />

      <br />
      <PlayerStop
        onPlayer={onPlayer}
        message={"button"}
        text={"点我,我阻止冒泡"}
      />

      <form
        onSubmit={(e) => {
          //阻止默认事件
          e.preventDefault();
        }}
      >
        <input
          className={"button"}
          type={"submit"}
          value={"提交表单，我阻止了默认事件，否则会刷新页面"}
        />
      </form>
    </div>
          </>
  );
}
