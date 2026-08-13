'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDirectoryEntries, DirectoryEntry } from '@/lib/directoryData';

function DirectoryContent() {
  const searchParams = useSearchParams();
  const search = searchParams?.get('search')?.toLowerCase() || '';

  // Получаем записи для переработчиков (можно поменять на "producer" при необходимости)
  const data: DirectoryEntry[] = getDirectoryEntries('recycler') || [];

  const filteredData = data.filter((item) => {
    return (
      item.name.toLowerCase().includes(search) ||
      item.city.toLowerCase().includes(search) ||
      item.materials.some((m) => m.toLowerCase().includes(search))
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Справочник предприятий</h1>
      <div className="grid gap-4">
        {filteredData.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-card">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  {item.name} {item.verified && '✅'}
                </h2>
                <p className="text-muted-foreground">Город: {item.city}</p>
                <p className="text-sm mt-2 text-blue-500">
                  Материалы: {item.materials.join(', ')}
                </p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{item.distanceKm} км</p>
                <p>{item.quantityT} т</p>
              </div>
            </div>
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
