import React from 'react';
import styles from './ChatBubble.module.css';

interface ChatBubbleProps {
  role: 'tutor' | 'student';
  content: React.ReactNode;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  return (
    <div className={`${styles.bubbleWrapper} ${role === 'student' ? styles.studentWrapper : ''}`}>
      <div className={`${styles.bubble} ${styles[role]}`}>
        {content}
      </div>
    </div>
  );
}
