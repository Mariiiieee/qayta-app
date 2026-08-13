'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { directoryData } from '@/lib/directoryData';

function DirectoryContent() {
  const searchParams = useSearchParams();
  const search = searchParams?.get('search')?.toLowerCase() || '';

  const filteredData = directoryData.filter((item) => {
    return (
      item.name.toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search) ||
      item.region.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Справочник предприятий</h1>
      <div className="grid gap-4">
        {filteredData.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-card">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-muted-foreground">{item.type}</p>
            <p className="text-sm mt-2">{item.region}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="p-6">Загрузка справочника...</div>}>
      <DirectoryContent />
    </Suspense>
  );
}
