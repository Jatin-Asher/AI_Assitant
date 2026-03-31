import React from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  topics: Array<{ id: string; title: string; active?: boolean }>;
}

export function Sidebar({ topics }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className="title-lg">Socratic AI Tutor</h2>
      </div>
      
      <nav className={styles.nav}>
        <h3 className={styles.navTitle}>Recent Discussions</h3>
        <ul className={styles.navList}>
          {topics.map(topic => (
            <li key={topic.id} className={`${styles.navItem} ${topic.active ? styles.active : ''}`}>
              {topic.title}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
