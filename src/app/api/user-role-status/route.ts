import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { HybridStorage } from '@/lib/hybrid-storage';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необхідна авторизація' },
        { status: 401 }
      );
    }

    console.log('🔍 Перевірка статусу для:', session.user.email);

    let allRequests: any[] = [];
    try {
      allRequests = HybridStorage.getAll('role-requests');
      console.log('📋 Завантажено запитів:', allRequests.length);
      console.log('📝 Всі запити:', allRequests.map(r => ({ email: r.userEmail, role: r.requestedRole, status: r.status })));
    } catch (error) {
      console.error('❌ Помилка завантаження даних:', error);
    }

    // Шукаємо активний запит користувача
    const userRequest = allRequests.find(
      req => req.userEmail === session.user.email && req.status === 'pending'
    );

    console.log('🎯 Знайдений запит для користувача:', userRequest || 'Немає');

    return NextResponse.json({
      user: {
        email: session.user.email,
        roles: session.user.roles || [],
        primaryRole: session.user.roles?.[0] || 'athlete'
      },
      hasActiveRequest: !!userRequest,
      roleRequest: userRequest || null,
      allRequestsCount: allRequests.length,
      debug: {
        totalRequests: allRequests.length,
        userEmail: session.user.email
      }
    });

  } catch (error) {
    console.error('💥 Помилка API user-role-status:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
