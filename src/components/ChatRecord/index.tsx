import './index.css'
import ReactMarkdown from 'react-markdown';
interface ChatRecordProps {
    content: string;
}

function ChatRecord({ content }: ChatRecordProps) {
    return (
        <div className="record-wrap">
            聊天记录
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    )
}

export default ChatRecord