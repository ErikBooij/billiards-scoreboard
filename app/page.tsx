'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../components/App'), { ssr: false });

export default (): React.ReactNode => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <App />
    </main>
  );
};
