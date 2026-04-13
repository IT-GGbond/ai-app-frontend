import { useState } from 'react'
import './App.css'
import Chat from './components/Chat'
import ChatRecord from './components/ChatRecord'
import { llmApi } from './api/llmApi'

function App() {
  const [count, setCount] = useState(0)
  const mdList = [
    '简单来说，**`React.FC` 是 TypeScript 的类型定义，而 `import React` 的省略是 React 17 引入的新特性**。',
    '# Hello, world!\n\nThis is a simple paragraph with some **bold** text.'
  ]
  const [llmRes, setLlmRes] = useState(mdList[0]);
  const [llmReq, setLlmReq] = useState('');
  function next() {
    setCount(count + 1);
    setLlmRes(mdList[count % mdList.length])
  }
  const handler = {
    onSend() {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `http://localhost:8080/llm?content=${llmReq}`)
      xhr.send();

      // 请求完成
      xhr.onload = () => {
        console.log(xhr.status, xhr.response);
        // 拿到的response就是后台res.json()的内容，记得把json字符串转成对象！！
        setLlmRes(JSON.parse(xhr.response).data.content);
      };
      // 无法到达服务器，如cors/网络错误等
      xhr.onerror = () => {
        console.log("请求失败");
      };
    }
  }
  return (
    <>
      yes{count}
      <div className="btn" onClick={() => setCount(count + 1)}>点我加一</div>
      <div className="btn" onClick={next}>下一个</div>
      <ChatRecord content={llmRes}></ChatRecord>
      <Chat onSend={handler.onSend} llmReq={llmReq} setLlmReq={setLlmReq}></Chat>
    </>
  )
}

export default App
