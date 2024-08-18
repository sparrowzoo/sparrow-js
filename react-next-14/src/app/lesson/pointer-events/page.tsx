'use client'
export default function Page() {
  return (
    <div style={{pointerEvents: 'none', height: 200 ,width: 200}}>
      <button onClick={() => console.log('clicked')}>我被禁了</button><br/>
        <button style={{pointerEvents: 'auto'}} onClick={() => console.log('clicked')}>我可以点击</button>
    </div>
  );
}