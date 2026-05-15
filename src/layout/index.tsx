import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { sessionApi } from '../api/sessionApi';
import Chat from '../components/Chat';
import SideBar from '../components/SideBar';
import styles from './index.module.css'
import { llmApi } from '../api/llmApi';

interface ChatRecord {
    content: string;
    role: 'user' | 'assistant';
    id?: string | number,
}

interface SessionItem {
    sessionId: string | number;
    title: string;
}

function Layout() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const userId = '001'; // 固定用户 ID，实际应该从登录信息获取

    // 全局状态
    const [sessionList, setSessionList] = useState<SessionItem[]>([]);
    const [chatRecords, setChatRecords] = useState<ChatRecord[]>([]);
    const [llmReq, setLlmReq] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // isGenerating 用来标记：是否已发出请求但接口“还未返回第一帧内容”
    const [isGenerating, setIsGenerating] = useState(false);
    // isReceiving 用来标记：接口正在流式响应中，以便禁用发送按钮
    const [isReceiving, setIsReceiving] = useState(false);
    const chatDetailsRef = useRef<HTMLDivElement>(null);
    const isAutoScrollRef = useRef(true);

    // 监听用户的滚动事件，如果用户往上滚，就暂时关掉自动滚动
    useEffect(() => {
        const el = chatDetailsRef.current;
        if (!el) return;
        const handleScroll = () => {
            // 因为有 margin/padding 以及流式渲染时的微小抖动，把距离底部的容差值稍微设大一点（比如 150px）
            if (el.scrollHeight - el.scrollTop - el.clientHeight > 150) {
                isAutoScrollRef.current = false;
            } else {
                isAutoScrollRef.current = true;
            }
        }
        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    // 回到底部的逻辑
    useEffect(() => {
        if (chatDetailsRef.current && isAutoScrollRef.current) {
            // 加一个极小的异步延迟，确保 React 渲染完成并且浏览器画出所有高度计算再去修改 scrollTop
            setTimeout(() => {
                if (chatDetailsRef.current) {
                    chatDetailsRef.current.scrollTop = chatDetailsRef.current.scrollHeight;
                }
            }, 10);
        }
    }, [chatRecords, isGenerating]);


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
        // 没有错误捕获，接口返回500断开之后，这里没有异常捕获去处理页面
        // axiosPost第九行抛出异常，可以在请求封装处捕获异常，使得控制台不抛出错误
        // 也可以在这里用catch捕获异常，同时处理页面ui逻辑
        const res = await llmApi.sendToLlmNew({ content: llmReq, userId, sessionId: sessionId as string })

        if (res.data.messageList) {
            // 收到的记录是聊天列表，sse返回的是一条数据：ai的回复
            setChatRecords(res.data)
        }
        if (!sessionId) {
            // 新对话发送，获取列表
            sessionApi.getList(userId).then(res => {
                if (res.data && res.data.length > 0) {
                    setSessionList(res.data);
                    // 路由设置为新对话, 此时sessionList还没被改变，获取到的仍然是旧的state
                    navigate(`/session/${res.data[res.data.length - 1].sessionId}`)
                }
            })
        }
        // 清空输入框
        setLlmReq('');
        setIsLoading(false);

        // const xhr = new XMLHttpRequest();
        // xhr.open('GET', `http://localhost:8080/llm?content=${encodeURIComponent(llmReq)}`);
        // xhr.send();

        // // 缺点：清空输入框要在响应异步响应之后，应该发送出去就清空
        // xhr.onload = async () => {
        //     try {
        //         const response = JSON.parse(xhr.response);
        //         console.log('LLM 响应:', response);

        //         // 获取返回的完整聊天记录
        //         const newChatRecords = response.data || [];
        //         setChatRecords(newChatRecords);

        //         // 清空输入框
        //         setLlmReq('');

        //         // 如果是新对话（没有 sessionId），需要重新获取会话列表
        //         if (!sessionId) {
        //             console.log('新对话首次发送，重新获取会话列表');
        //             await new Promise(resolve => setTimeout(resolve, 500)); // 等待后端保存

        //             const listRes = await sessionApi.getList(userId);
        //             console.log('更新后的会话列表:', listRes.data);
        //             if (listRes.data && listRes.data.length > 0) {
        //                 setSessionList(listRes.data);
        //                 // 导航到新创建的会话（最后一个）
        //                 const newSessionId = listRes.data[listRes.data.length - 1].sessionId;
        //                 window.location.href = `/session/${newSessionId}`;
        //             }
        //         }
        //     } catch (err) {
        //         console.error('解析响应失败:', err);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };

        // xhr.onerror = () => {
        //     console.error('请求失败');
        //     setIsLoading(false);
        // };
    };

    // 发送消息2.0 -- 调用sse接口（get方法），流式接收
    // TODO：加入发送对话时的loading, 和页面的初始化loading分开
    const handleSentSSE = async () => {
        if (!llmReq.trim()) return;
        const newChatRecords = [...chatRecords];
        newChatRecords.push({
            role: 'user',
            content: llmReq,
        })
        // 更新页面添加用户对话
        setChatRecords(newChatRecords);
        // 发送完立即准备滚动到底部
        isAutoScrollRef.current = true;
        setIsGenerating(true);
        setIsReceiving(true);
        // 清空输入框提前到这里，让体验更连贯
        setLlmReq('');

        // 发送sse
        // 1. eventSource有缺陷, 使用其他库
        // const event = new EventSource(`http://localhost:8080/llmSSE?content=${encodeURIComponent(llmReq)}&userId=${userId}&sessionId=${sessionId}`);
        // event.onmessage = (e) => {
        //     // 如果收到结束标志，必须手动关闭连接
        //     if (e.data === '[DONE]') {
        //         console.log('接收完毕，主动关闭流')
        //         event.close();
        //         return;
        //     }

        //     // 正常接收流式数据
        //     const parsedData = JSON.parse(e.data);
        //     console.log('接收到部分记录: ', parsedData);
        //     // 收到的记录是一次回答
        //     // 缺点：
        //     // 1.每次都push导致多条，应该替换最后一条再push，
        //     // 2. 在回答完成了setState这个快照才一次兑现
        //     // vue不会有这个问题
        //     // TODO: 在这里可以将 parsedData.data 更新到 state 里渲染界面
        //     newChatRecords.push(parsedData);
        //     setChatRecords(newChatRecords);
        // };
        // event.onerror = (err) => {
        //     console.error('SSE 发生错误，自动关闭连接。', err);
        //     event.close(); // 发生错误自动关闭，防止一直重试
        // };
        try {
            // 2. 使用新的库
            await llmApi.sendToLlmSSE({
                content: llmReq,
                userId,
                sessionId,
            }, (ev) => {
                // 收到第一帧数据后，关闭"思考中"占位
                setIsGenerating(false);

                // console.log(ev.data);
                const assistantObj = JSON.parse(ev.data);

                // 情况1：由于指向同一块内存问题，没有复制，用户对话更新，sse回答setState不更新dom，数据也没更新
                // 内存中的数据不实时更新，dom也不实时更新
                // const index = newChatRecords.findIndex(item => item.id === assistantObj.id);
                // // 在聊天列表中，没有同id就push，有就替换
                // if (index !== -1) {
                //     newChatRecords[index] = assistantObj;
                // } else {
                //     newChatRecords.push(assistantObj);
                // }
                // console.log(chatRecords); // 为什么一直为空，没有用户列表，但是此时dom上已经显示了用户列表
                // setChatRecords(newChatRecords); // 地址没变，底层认为数据没变

                // 情况2：用户和sse回答都及时更新
                // const newList = [...newChatRecords];
                // const index = newList.findIndex(item => item.id === assistantObj.id);
                // // 在聊天列表中，没有同id就push，有就替换
                // if (index !== -1) {
                //     newList[index] = assistantObj;
                // } else {
                //     newList.push(assistantObj);
                // }
                // // 如果加上下面这行，并且把外部的 const newChatRecords 改成 let，逻辑就正确了
                // newChatRecords = newList; // 这里不需要 [...newList] 了，直接赋值引用即可
                // setChatRecords(newList);

                // 情况3（同2）：使用函数式更新，prev获取最新状态，并每次返回全新的数组引用触发重新渲染
                // 使用「函数式更新」( setState(prev => ...) ) 的场景
                // 核心特征：你的新状态绝对依赖于旧状态，且中间可能会发生异步 / 多次调用的情况。
                setChatRecords(prev => {
                    const nextRecords = [...prev];
                    const index = nextRecords.findIndex(item => item.id === assistantObj.id);
                    // 在聊天列表中，没有同id就push，有就替换
                    if (index !== -1) {
                        nextRecords[index] = assistantObj;
                    } else {
                        nextRecords.push(assistantObj);
                    }
                    return nextRecords;
                });
            });
        } catch (err) {
            console.error('SSE 请求异常:', err);
        } finally {
            setIsGenerating(false);
            setIsReceiving(false);
        }

        // console.log(chatRecords); // 还是空，第二次调用函数的时候不为空了，加上了用户的和sse回答的

        if (!sessionId) {
            // 新对话发送，获取所有对话列表
            sessionApi.getList(userId).then(res => {
                if (res.data && res.data.length > 0) {
                    setSessionList(res.data);
                    // 路由设置为新对话, 此时sessionList还没被改变，获取到的仍然是旧的state
                    navigate(`/session/${res.data[res.data.length - 1].sessionId}`)
                }
            })
        }
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.sidebar}>
                <SideBar
                    chatList={sessionList}
                    curSessionId={sessionId}
                />
            </div>
            <div className={styles.rightbar}>
                <div className={styles.chatDetails} ref={chatDetailsRef}>
                    {/* 使用路由的组件，用 Outlet占位符，相当于vue中的router-view */}
                    <Outlet context={{
                        chatRecords,
                        isLoading,
                        isGenerating
                    }} />
                </div>
                <div className={styles.rightBottom}>
                    <Chat
                        onSend={handleSentSSE}
                        llmReq={llmReq}
                        setLlmReq={setLlmReq}
                        isLoading={isReceiving || isLoading}
                    />
                </div>
            </div>
        </div>
    )
}

export default Layout;