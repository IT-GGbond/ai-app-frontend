import './index.css'
import { useParams, useOutletContext } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight'
import { Skeleton } from 'antd';

interface ChatRecord {
    content: string;
    role: 'user' | 'assistant';
}

interface OutletContext {
    chatRecords: ChatRecord[];
    isLoading: boolean;
    currentSessionId?: string;
}

function ChatRecord() {
    const { sessionId } = useParams();
    const context = useOutletContext<OutletContext>();

    const { chatRecords = [], isLoading = false } = context || {};

    // id为空是新对话
    const isNewChat = !sessionId;

    if (isLoading) {
        return (
            <div className="record-wrap">
                <Skeleton avatar active />
            </div>
        );
    }

    return (
        <div className="record-wrap">
            <h3 className="record-title">
                {isNewChat ? '新对话' : '聊天记录'}
            </h3>

            <div className="record-details">
                {chatRecords && chatRecords.length > 0 ? (
                    <div className="chat-messages">
                        {chatRecords.map((record, index) => (
                            <div
                                key={index}
                                className={`message ${record.role}`}
                            >
                                <div className="message-role">
                                    {record.role === 'user' ? '👤 You' : '🤖 AI'}
                                </div>
                                <div className="message-content">
                                    {record.role === 'assistant' ? (
                                        <ReactMarkdown
                                            components={{
                                                a: ({ ...props }) => (
                                                    <a className='new-a' target="_blank" {...props} />
                                                )
                                            }}
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeHighlight]}
                                        >
                                            {record.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p>{record.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        {isNewChat ? (
                            <>
                                <p>👋 开始一个新对话</p>
                                <p>在下方输入框中输入你的问题，AI 将为你回答。</p>
                            </>
                        ) : (
                            <p>暂无聊天记录</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatRecord