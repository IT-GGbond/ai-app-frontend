import './index.css'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight'
interface ChatRecordProps {
    content: string;
}

function ChatRecord({ content }: ChatRecordProps) {
    return (
        <div className="record-wrap">
            聊天记录
            {/* 使用components自定义样式 */}
            <ReactMarkdown components={{ a: ({...props}) => <a className='new-a' {...props} /> }} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
        </div>
    )
}

export default ChatRecord