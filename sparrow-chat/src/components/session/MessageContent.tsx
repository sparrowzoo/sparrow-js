"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Message from "@/common/lib/protocol/messaging/Message";
import {MessageType} from "@/common/lib/protocol/messaging/Chat";
import {parseQuestion} from "@/lib/im/QuestionProtocol";
import QuestionCard from "./QuestionCard";

interface Props {
    message: Message;
    canAnswer: (questionId: string) => boolean;
    onAnswer: (questionId: string, answers: string[]) => void;
    zh: boolean;
}

function TextContent({message}: Props) {
    return <div className="whitespace-pre-wrap break-words">{message.content}</div>;
}
function MarkdownContent({message}: Props) {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>;
}
function HtmlContent({message}: Props) {
    return <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{message.content}</ReactMarkdown>;
}
function QuestionContent(props: Props) {
    try {
        const question = parseQuestion(props.message.content);
        return <QuestionCard key={question.questionId} question={question} zh={props.zh}
            disabled={!props.canAnswer(question.questionId)}
            onSubmit={answers => props.onAnswer(question.questionId, answers)}/>;
    } catch {
        return <p role="alert">{props.zh ? "问题格式有误，请重新提问。" : "Invalid question. Please ask again."}</p>;
    }
}
function AnswerContent(props: Props) {
    // 本地发送显示答案文字；历史接口可能保留完整协议载荷。
    let content = props.message.content;
    try {
        const answer = JSON.parse(content);
        if (typeof answer?.questionId === "string" && typeof answer?.content === "string") content = answer.content;
    } catch { /* 普通答案文字无需解析。 */ }
    return <div className="whitespace-pre-wrap break-words">{content}</div>;
}
const renderers: Record<number, React.ComponentType<Props>> = {
    [MessageType.TEXT]: TextContent,
    [MessageType.HTML]: HtmlContent,
    [MessageType.MARKDOWN]: MarkdownContent,
    [MessageType.AI]: MarkdownContent,
    [MessageType.QUESTION]: QuestionContent,
    [MessageType.ANSWER]: AnswerContent,
};
export default function MessageContent(props: Props) {
    const Renderer = renderers[props.message.messageType] ?? TextContent;
    return <Renderer {...props}/>;
}
