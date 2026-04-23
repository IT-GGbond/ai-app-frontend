import { Input, Button } from 'antd';
import './index.css'

const { TextArea } = Input;

interface ChatProps {
    onSend: () => void;
    llmReq: string;
    setLlmReq: (req: string) => void;
    isLoading?: boolean;
}

function Chat({ onSend, llmReq, setLlmReq, isLoading = false }: ChatProps) {
    const handlePressEnter = (e: any) => {
        if ( e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className='chat-wrap'>
            <div className="user-input">
                <TextArea
                    rows={4}
                    allowClear
                    placeholder='快来和我聊天 (Ctrl+Enter 发送)'
                    value={llmReq}
                    onChange={(e) => setLlmReq(e.target.value)}
                    onKeyDown={handlePressEnter}
                    disabled={isLoading}
                />
            </div>
            <div className="btn">
                <Button
                    type='primary'
                    onClick={onSend}
                    loading={isLoading}
                    disabled={isLoading || !llmReq.trim()}
                >
                    {isLoading ? '发送中...' : '发送'}
                </Button>
            </div>
        </div>
    )
}

export default Chat;