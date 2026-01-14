// components/ChatingComponent.jsx
'use client';

import styles from '@/../css/Chating.module.css';
import Chating from './Chating';

export default function ChatingForm() {
  const {
    messages,
    content,
    setContent,
    user,
    receiverName,
    receiverOnline,
    loading,
    error,
    isConnected,
    messagesEndRef,
    postMessage,
    handleKeyPress,
  } = Chating();

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatContainer}>
        <div className={styles.chatCard}>
          
          {/* 헤더 */}
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              {receiverName}
              {!isConnected && (
                <span style={{ color: 'red', fontSize: '12px', marginLeft: '8px' }}>
                  (연결 끊김)
                </span>
              )}
            </div>
            <div className={receiverOnline ? styles.chatStatusOnline : styles.chatStatusOffline}>
              {receiverOnline ? "온라인" : "오프라인"}
            </div>
          </div>

          {/* 메시지 목록 */}
          <div className={styles.messagesContainer}>
            {loading ? (
              <div className={styles.loading}>로딩 중...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : messages.length > 0 ? (
              messages.map((msg, index) => {
                const isMine = msg.sender?._id === user?.userObjectId;

                return (
                  <div
                    key={msg._id || index}
                    className={`${styles.messageWrapper} ${isMine ? styles.myMessage : styles.otherMessage}`}
                  >
                    {!isMine && (
                      <img
                        src={msg.sender?.profileImage?.url || "/default-profile.png"}
                        alt={msg.sender?.name}
                        className={styles.messageProfileImg}
                      />
                    )}

                    <div className={styles.messageContentWrapper}>
                      {!isMine && (
                        <div className={styles.messageSenderName}>
                          {msg.sender?.name ?? "알 수 없음"}
                        </div>
                      )}

                      <div className={`${styles.messageBubble} ${isMine ? styles.myBubble : styles.otherBubble}`}>
                        {msg.content}
                      </div>

                      <div className={styles.messageTimestamp}>
                        {new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.noMessages}>메시지가 없습니다.</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <div className={styles.messageInputContainer}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className={styles.messageInput}
                maxLength={30}
                disabled={!isConnected}
              />

              <button
                onClick={postMessage}
                className={`${styles.sendBtn} ${content.trim() && isConnected ? styles.active : ""}`}
                disabled={!content.trim() || !isConnected}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
                </svg>
              </button>
            </div>

            <div className={styles.charCountMessage}>{content.length} / 30</div>
          </div>
        </div>
      </div>
    </div>
  );
}