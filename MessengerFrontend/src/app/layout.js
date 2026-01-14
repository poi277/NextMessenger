'use client';
import { AuthProvider } from "../context/AuthContext"; // ✅ AuthContext import 경로 확인
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
          {children}
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
