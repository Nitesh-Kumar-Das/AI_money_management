'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PersonalizedWelcomeLoaderProps {
  userName: string;
  redirectTo?: string;
  redirectDelay?: number;
}

export default function PersonalizedWelcomeLoader({ 
  userName, 
  redirectTo = '/dashboard',
  redirectDelay = 3000 
}: PersonalizedWelcomeLoaderProps) {
  const message = `WELCOME, ${userName.toUpperCase()}`;
  const [displayedText, setDisplayedText] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const addNextCharacter = () => {
      if (currentIndex < message.length) {
        setDisplayedText(message.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(addNextCharacter, 100);
      } else {
        setAnimationComplete(true);
      }
    };

    timeoutId = setTimeout(addNextCharacter, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message]);

  useEffect(() => {
    if (animationComplete) {
      const redirectTimer = setTimeout(() => {
        router.push(redirectTo);
      }, redirectDelay);

      return () => clearTimeout(redirectTimer);
    }
  }, [animationComplete, redirectTo, redirectDelay, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-white text-blue-700 font-mono text-3xl md:text-5xl tracking-wider">
      <span>{displayedText}</span>
      <span className="animate-pulse ml-1">|</span>
    </div>
  );
}
