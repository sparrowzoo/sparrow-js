'use client'
import React from 'react'
import Markdown from 'react-markdown'
// @ts-ignore
import md from './README.md';
// @ts-ignore
import hello from './readme.txt';

const markdown = '# Hi, *Pluto*!'
export default function page() {
    return <>
        {hello}
        <Markdown>{md}</Markdown>
    </>
}