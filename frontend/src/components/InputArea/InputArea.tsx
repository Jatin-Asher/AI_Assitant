"use client";

import React, { useState } from 'react';
import styles from './InputArea.module.css';
import { Button } from '../Button/Button';

export function InputArea() {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div className={`${styles.inputContainer} ${isFocused ? styles.focused : ''}`}>
      <textarea
        className={styles.textarea}
        placeholder="Type a message or question..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={1}
      />
      <div className={styles.actionRow}>
        <Button variant="primary">Send</Button>
      </div>
    </div>
  );
}
