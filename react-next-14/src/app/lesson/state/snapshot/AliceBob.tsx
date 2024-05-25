import {useState} from 'react';

export default function AliceBob() {
    const [to, setTo] = useState('Alice');
    const [message, setMessage] = useState('Hello');

    function handleSubmit(e: any) {
        e.preventDefault();
        setTimeout(() => {
            //alert("You said " + {message} + " to " + {to}); 为什么显示对象?
            alert(`You said ${message} to ${to}`);

        }, 3000);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                To:{' '}
                <select
                    value={to}
                    onChange={e => setTo(e.target.value)}>
                    <option value="Alice">Alice</option>
                    <option value="Bob">Bob</option>
                </select>
            </label>
            <textarea
                placeholder="Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
        </form>
    );
}