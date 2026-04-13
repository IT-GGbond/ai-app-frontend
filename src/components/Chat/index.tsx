import { Input, Button } from 'antd';
import './index.css'

const { TextArea } = Input;
interface ChatProps {
    onSend: () => void,
    llmReq: string,
    setLlmReq: (req: string) => void,
}
function Chat(props: ChatProps) {
    return (
        <div className='chat-wrap'>
            <div className="avatar">
                <img src="" alt="头像" />
            </div>
            <div className="user-input">
                <TextArea rows={4} placeholder='快来和我聊天' value={props.llmReq} onChange={(e) => props.setLlmReq(e.target.value)} />
            </div>
            <div className="btn">
                <Button type='primary' onClick={props.onSend}>Send</Button>
            </div>
        </div>
    )
}
export default Chat;