import styles from './index.module.css'
interface SideBarProps {
    chatList: Array,
}
function SideBar(props: SideBarProps) {
    return(
        <div className={styles.wrap}>
            <h3 className={styles.title}>会话记录</h3>
            <div className={styles.createNew}>新建会话</div>
            <div className={styles.chatList}>
                <div className={styles.chatItem}></div>
            </div>
        </div>
    )
}

export default SideBar;