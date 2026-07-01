// src/app/layout.tsx
import '@/styles/globals.css';
import NavbarWrapper from '@/components/NavbarWrapper';

export const metadata = {
  title: 'AI Expense Tracker',
  description: 'Intelligent expense tracking with AI insights and OCR technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
