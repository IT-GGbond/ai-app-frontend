import { useState } from 'react'
import styles from './App.module.css'
import Chat from './components/Chat'
import ChatRecord from './components/ChatRecord'
import { llmApi } from './api/llmApi'
import SideBar from './components/SideBar'

function App() {
  const [llmRes, setLlmRes] = useState('');
  const [llmReq, setLlmReq] = useState('');
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
    <div className={styles.wrap}>
      <div className={styles.sidebar}>
        <SideBar></SideBar>
      </div>
      <div className={styles.rightbar}>
        <div className={styles.chatDetails}>
          <ChatRecord content={llmRes}></ChatRecord>
        </div>
        <div className={styles.rightBottom}>
          <Chat onSend={handler.onSend} llmReq={llmReq} setLlmReq={setLlmReq}></Chat>
        </div>
      </div>
    </div>
  )
}

export default App
