import { useNavigate } from 'react-router-dom';
import styles from './index.module.css'

interface ChatItem {
    sessionId: string | number;
    title: string;
}

interface SideBarProps {
    chatList: ChatItem[];
    curSessionId?: string;
}

function SideBar({ chatList, curSessionId }: SideBarProps) {
    const navigate = useNavigate();
    const handleSelectSession = (sessionId: string | number) => {
        navigate(`/session/${sessionId}`)
    }

    return (
        <div className={styles.wrap}>
            <h3 className={styles.title}>会话记录</h3>
            <div className={styles.createNew} onClick={() => navigate('/')}>新建会话</div>
            <div className={styles.chatList}>
                {chatList && chatList.length > 0 ? (
                    chatList.map(item => (
                        <div
                            className={`${styles.chatItem} ${curSessionId === item.sessionId && styles.active}`}
                            key={item.sessionId}
                            onClick={() => handleSelectSession(item.sessionId)}
                        >
                            {item.title || '新对话'}
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>暂无会话</div>
                )}
            </div>
        </div>
    )
}

export default SideBar;