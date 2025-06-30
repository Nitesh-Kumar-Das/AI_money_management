'use client';

import { useEffect, useState } from 'react';

export default function WelcomeLoader() {
  const message = 'WELCOME, USER';
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const addNextCharacter = () => {
      if (currentIndex < message.length) {
        setDisplayedText(message.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(addNextCharacter, 100);
      }
    };

    timeoutId = setTimeout(addNextCharacter, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message]);

  return (
    <div className="h-screen flex items-center justify-center bg-white text-blue-700 font-mono text-3xl md:text-5xl tracking-wider">
      <span>{displayedText}</span>
      <span className="animate-pulse ml-1">|</span>
    </div>
  );
}
