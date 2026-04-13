import { useState } from 'react'
import './App.css'
import Chat from './components/Chat'
import ChatRecord from './components/ChatRecord'

function App() {
  const [count, setCount] = useState(0)
  const mdList = [
    '简单来说，**`React.FC` 是 TypeScript 的类型定义，而 `import React` 的省略是 React 17 引入的新特性**。',
    '# Hello, world!\n\nThis is a simple paragraph with some **bold** text.'
  ]
  const [llmRes, setLlmRes] = useState(mdList[0]);
  function next() {
    setCount(count + 1);
    setLlmRes(mdList[count % mdList.length])
  }
  return (
    <>
      yes{count}
      <div className="btn" onClick={() => setCount(count + 1)}>点我加一</div>
      <div className="btn" onClick={next}>下一个</div>
      <ChatRecord content={llmRes}></ChatRecord>
      <Chat></Chat>
    </>
  )
}

export default App
