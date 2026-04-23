import ChatRecord from './components/ChatRecord'
import { Route, Routes } from 'react-router-dom'
import Layout from './layout'
import Demo from './components/Demo'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="" element={<ChatRecord />} />
        <Route path="session/:sessionId" element={<ChatRecord />} />
        <Route path="demo" element={<Demo></Demo>}></Route>
      </Route>
      <Route path="/aa/demo" element={<Demo></Demo>}></Route>
    </Routes>
  )
}

export default App
