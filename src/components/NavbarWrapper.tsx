'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  const hideOnRoutes = ['/', '/auth', '/login', '/signup'];

  if (hideOnRoutes.includes(pathname)) return null;

  return <Navbar />;
}
