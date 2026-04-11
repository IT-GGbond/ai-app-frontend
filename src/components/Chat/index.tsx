import { Input, Button } from 'antd';
import './index.css'

const { TextArea } = Input;
function Chat() {
    return (
        <div className='chat-wrap'>
            <div className="avatar">
                <img src="" alt="头像" />
            </div>
            <div className="user-input">
                <TextArea rows={4} placeholder='快来和我聊天' />
            </div>
            <div className="btn">
                <Button type='primary'>Send</Button>
            </div>
        </div>
    )
}
export default Chat;