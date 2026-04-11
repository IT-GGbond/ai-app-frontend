import { useState } from 'react'
import './App.css'
import Chat from './components/Chat'
import ChatRecord from './components/ChatRecord'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      yes{count}
      <div className="btn" onClick={() => setCount(count + 1)}>点我加一</div>
      <ChatRecord></ChatRecord>
      <Chat></Chat>
    </>
  )
}

export default App
