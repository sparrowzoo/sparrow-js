'use client'
import { useState } from 'react';

export default function App() {
    const [showB, setShowB] = useState(true);
    return (
        <div>
            <h1>重新显示时，重新渲染，状态初始化为0</h1>
            <Counter />
            {showB && <Counter />}
            <label>
                <input
                    type="checkbox"
                    checked={showB}
                    onChange={e => {
                        setShowB(e.target.checked)
                    }}
                />
                渲染第二个计数器
            </label>
        </div>
    );
}

function Counter() {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);

    let className = 'counter';
    if (hover) {
        className += ' hover';
    }

    return (
        <div
            className={className}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
        >
            <h1>{score}</h1>
            <button onClick={() => setScore(score + 1)}>
                加一
            </button>
        </div>
    );
}
