"use client";

import React, {FormEvent, useId, useState} from "react";
import {QuestionEvent} from "@/lib/im/QuestionProtocol";

interface Props {
    question: QuestionEvent;
    disabled: boolean;
    zh: boolean;
    onSubmit: (answers: string[]) => void;
}

export default function QuestionCard({question, disabled, zh, onSubmit}: Props) {
    const group = useId();
    const [answers, setAnswers] = useState(() => question.questions.map(() => ({selected: [] as number[], other: false, text: ""})));
    const values = answers.map((answer, index) => answer.other ? answer.text.trim()
        : question.questions[index].options.filter((_, option) => answer.selected.includes(option)).map(option => option.label).join(", "));
    const complete = values.every(value => value.length > 0);
    function select(index: number, option: number) {
        setAnswers(previous => previous.map((answer, item) => {
            if (index !== item) return answer;
            const selected = question.questions[index].multiSelect
                ? answer.selected.includes(option) ? answer.selected.filter(value => value !== option) : [...answer.selected, option]
                : [option];
            return {...answer, selected, other: false};
        }));
    }
    function submit(event: FormEvent) {
        event.preventDefault();
        if (disabled || !complete) return;
        onSubmit(values);
    }
    return <form className="im-question-card space-y-4" onSubmit={submit}>
        <p className="font-medium">{zh ? "请选择，也可以在下方直接输入" : "Choose below, or type a reply in the chat"}</p>
        {question.questions.map((item, index) => <fieldset key={index} disabled={disabled} className="space-y-2 min-w-0">
            <legend className="mb-2 font-semibold">{item.header} · {item.question}</legend>
            {item.options.map((option, optionIndex) => <label key={optionIndex}
                className="flex items-start gap-2 rounded-md border border-current/20 p-3 cursor-pointer has-[:checked]:bg-primary/10">
                <input type={item.multiSelect ? "checkbox" : "radio"} name={`${group}-${index}`}
                    checked={!answers[index].other && answers[index].selected.includes(optionIndex)}
                    onChange={() => select(index, optionIndex)} className="mt-1 shrink-0"/>
                <span><strong>{option.label}</strong><span className="block text-xs opacity-75">{option.description}</span></span>
            </label>)}
            <label className="flex items-center gap-2 p-2">
                <input type={item.multiSelect ? "checkbox" : "radio"} name={`${group}-${index}`} checked={answers[index].other}
                    onChange={() => setAnswers(previous => previous.map((answer, i) => i === index
                        ? {...answer, selected: [], other: !answer.other} : answer))}/>
                {zh ? "其他（自行填写）" : "Other (write your own)"}
            </label>
            {answers[index].other && <textarea aria-label={`${item.header}: ${zh ? "其他答案" : "Other answer"}`}
                value={answers[index].text} rows={2} maxLength={2000}
                onChange={event => setAnswers(previous => previous.map((answer, i) => i === index ? {...answer, text: event.target.value} : answer))}
                className="w-full resize-y rounded-md border p-2 bg-background text-foreground"/>}
        </fieldset>)}
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50" type="submit" disabled={disabled || !complete}>
            {zh ? "发送答案" : "Send answers"}
        </button>
    </form>;
}
