'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalizedWelcomeLoader from '../../components/PersonalizedWelcomeLoader';

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get the user name from URL params or localStorage
    const nameFromUrl = searchParams.get('name');
    const nameFromStorage = localStorage.getItem('userName');
    
    if (nameFromUrl) {
      setUserName(nameFromUrl);
      // Store in localStorage for future use
      localStorage.setItem('userName', nameFromUrl);
    } else if (nameFromStorage) {
      setUserName(nameFromStorage);
    } else {
      // If no name found, redirect to auth
      router.push('/auth');
      return;
    }
  }, [searchParams, router]);

  if (!userName) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return <PersonalizedWelcomeLoader userName={userName} />;
}
