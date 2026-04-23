import { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { sessionApi } from '../api/sessionApi';
import Chat from '../components/Chat';
import SideBar from '../components/SideBar';
import styles from './index.module.css'

interface ChatRecord {
    content: string;
    role: 'user' | 'assistant';
}

interface SessionItem {
    sessionId: string | number;
    title: string;
}

function Layout() {
    const { sessionId } = useParams();
    const userId = '001'; // 固定用户 ID，实际应该从登录信息获取

    // 全局状态
    const [sessionList, setSessionList] = useState<SessionItem[]>([]);
    const [chatRecords, setChatRecords] = useState<ChatRecord[]>([]);
    const [llmReq, setLlmReq] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 111初始化：获取会话列表, 传递给Sidebar组件
    useEffect(() => {
        console.log('初始化：获取会话列表');
        sessionApi.getList(userId).then(res => {
            if (res.data && res.data.length > 0) {
                setSessionList(res.data);
            }
        });
    }, []);

    // 111当路由 ID 变化时，获取对应会话的聊天记录，传递给ChatRecord组件
    useEffect(() => {
        if (sessionId) {
            console.log('获取会话详情:', sessionId);
            getSessionDetail(sessionId);
        } else {
            // 新对话
            console.log('新对话，清空聊天记录');
            setChatRecords([]);
        }
    }, [sessionId]);

    // 获取会话详情
    const getSessionDetail = async (sessionId: string) => {
        setIsLoading(true);
        // TODO: 接口异常如何处理，什么情况会走到 catch
        try {
            const res = await sessionApi.getDetail(userId, sessionId);
            console.log('会话详情:', res.data);
            setChatRecords(res.data || []);
        } catch (err) {
            console.error('获取会话详情失败:', err);
            setChatRecords([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 发送消息
    const handleSend = async () => {
        if (!llmReq.trim()) {
            console.warn('消息为空');
            return;
        }

        console.log('发送消息:', llmReq);
        setIsLoading(true);

        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `http://localhost:8080/llm?content=${encodeURIComponent(llmReq)}`);
            xhr.send();

            xhr.onload = async () => {
                try {
                    const response = JSON.parse(xhr.response);
                    console.log('LLM 响应:', response);

                    // 获取返回的完整聊天记录
                    const newChatRecords = response.data || [];
                    setChatRecords(newChatRecords);

                    // 清空输入框
                    setLlmReq('');

                    // 如果是新对话（没有 sessionId），需要重新获取会话列表
                    if (!sessionId) {
                        console.log('新对话首次发送，重新获取会话列表');
                        await new Promise(resolve => setTimeout(resolve, 500)); // 等待后端保存

                        const listRes = await sessionApi.getList(userId);
                        console.log('更新后的会话列表:', listRes.data);
                        if (listRes.data && listRes.data.length > 0) {
                            setSessionList(listRes.data);
                            // 导航到新创建的会话（最后一个）
                            const newSessionId = listRes.data[listRes.data.length - 1].sessionId;
                            window.location.href = `/session/${newSessionId}`;
                        }
                    }
                } catch (err) {
                    console.error('解析响应失败:', err);
                }
            };

            xhr.onerror = () => {
                console.error('请求失败');
            };
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.sidebar}>
                <SideBar
                    chatList={sessionList}
                    curSessionId={sessionId}
                />
            </div>
            <div className={styles.rightbar}>
                <div className={styles.chatDetails}>
                    {/* 使用路由的组件，用 Outlet占位符，相当于vue中的router-view */}
                    <Outlet context={{
                        chatRecords,
                        isLoading,
                        currentSessionId: sessionId
                    }} />
                </div>
                <div className={styles.rightBottom}>
                    <Chat
                        onSend={handleSend}
                        llmReq={llmReq}
                        setLlmReq={setLlmReq}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    )
}

export default Layout;