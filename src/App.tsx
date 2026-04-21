import { useState } from 'react'
import styles from './App.module.css'
import Chat from './components/Chat'
import ChatRecord from './components/ChatRecord'
import { llmApi } from './api/llmApi'
import SideBar from './components/SideBar'
import { xhrGet, xhrPost } from './utils/request/xhr'
import { fetchGet, fetchPost } from './utils/fetchRequest'
import { axiosGet, axiosPost } from './utils/axiosRequest'

function App() {
  const [llmRes, setLlmRes] = useState('');
  const [llmReq, setLlmReq] = useState('');
  const handler = {
    async onSend() {
      // 1. 测试xhr
      // xhrGet(`http://localhost:8080/get`)
      // xhrPost('http://localhost:8080/post', {name: '张三'});

      // 2. 测试fetch
      // const rawRes = await fecthGet('http://localhost:8080/get');
      // console.log('rawRes', rawRes);
      // rawRes.json().then(res => console.log('res', res));
      // fetch('http://localhost:8080/get', { method: 'GET' }).then(res => console.log('原生的Response对象', res));
      // .then方法把返回的res.json()再用resolve包裹出去，后面一次.then接收
      // fetch('http://localhost:8080/get', { method: 'GET' }).then(res => res.json()).then(res => console.log('真正data', res));

      // const res = await fetchGet('http://localhost:8080/get')
      // console.log(res);
      // const resp = await fetchPost('http://localhost:8080/post', { name: '张三' })
      // console.log(resp);

      // 3. 测试axios
      // const res = await axiosGet('http://localhost:8080/get')
      // console.log(res);
      // const resp = await axiosPost('http://localhost:8080/post', { name: '张三' })
      // console.log(resp);


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
      console.log('同步代码执行完毕')
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
