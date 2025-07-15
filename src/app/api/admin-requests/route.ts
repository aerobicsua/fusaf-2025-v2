import { NextResponse } from 'next/server';
import { HybridStorage } from '@/lib/hybrid-storage';

// 📋 ПУБЛІЧНИЙ ENDPOINT для адмін панелі - показує запити без авторизації
// Використовується AdminRoleRequestsTab для отримання списку запитів

export async function GET(request: Request) {
  try {
    console.log('📋 Admin requests endpoint: завантаження даних для адмін панелі');

    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    // Отримуємо дані з HybridStorage
    const allRequests = HybridStorage.getAll();
    let filteredRequests = allRequests;

    if (status && status !== 'all') {
      filteredRequests = allRequests.filter(req => req.status === status);
    }

    console.log('📋 Admin endpoint запити:', {
      total: allRequests.length,
      filtered: filteredRequests.length,
      status,
      storageType: 'HYBRID_STORAGE'
    });

    // Повертаємо дані в тому ж форматі що й основний API
    return NextResponse.json({
      requests: filteredRequests.sort((a, b) =>
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      ),
      total: filteredRequests.length,
      debug: {
        globalTotal: allRequests.length,
        storageType: 'HYBRID_STORAGE',
        lastUpdate: new Date().toISOString(),
        stats: HybridStorage.getStats(),
        note: 'Публічний endpoint для адмін панелі',
        endpoint: '/api/admin-requests'
      }
    });

  } catch (error) {
    console.error('❌ Помилка admin requests endpoint:', error);
    return NextResponse.json(
      {
        error: 'Помилка завантаження запитів',
        details: error instanceof Error ? error.message : 'Невідома помилка',
        storageType: 'HYBRID_STORAGE'
      },
      { status: 500 }
    );
  }
}
