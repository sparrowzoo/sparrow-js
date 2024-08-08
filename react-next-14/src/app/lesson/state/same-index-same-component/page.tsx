'use client'
import { useState } from 'react';

export default function App() {
    const [isFancy, setIsFancy] = useState(false);
    return (
        <div>
            {isFancy ? (
                <Counter isFancy={true} />
            ) : (
                <Counter isFancy={false} />
            )}
            <label>
                <input
                    type="checkbox"
                    checked={isFancy}
                    onChange={e => {
                        setIsFancy(e.target.checked)
                    }}
                />
                使用好看的样式
            </label>
        </div>
    );
}

function Counter({ isFancy }:{ isFancy: boolean }) {
    const [score, setScore] = useState(0);
    return (
        <div>
            <h1>{score} {isFancy ? '😎' : '😔'}</h1>
            <button onClick={() => setScore(score + 1)}>
                加一
            </button>
        </div>
    );
}
