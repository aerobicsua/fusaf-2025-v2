import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { HybridStorage, type RoleRequest } from '@/lib/hybrid-storage';
import { sendRoleStatusEmail } from '@/lib/email-service';

// 🔥 PERSISTENT STORAGE API - Вирішення проблеми Netlify Function Isolation
// Використовує LocalStorage + API синхронізацію для збереження даних між сесіями

console.log('🚀 Role requests API ініціалізовано з PERSISTENT STORAGE');

// GET - отримати всі запити (тільки для адміністраторів)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Недостатньо прав для перегляду запитів' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    console.log('📋 GET запити через PERSISTENT storage для:', session.user.email);

    // Отримуємо дані з HybridStorage
    const allRequests = HybridStorage.getAll();
    let filteredRequests = allRequests;

    if (status && status !== 'all') {
      filteredRequests = allRequests.filter(req => req.status === status);
    }

    console.log('📋 GET запити на ролі з HYBRID сховища:', {
      total: allRequests.length,
      filtered: filteredRequests.length,
      status,
      storageType: 'HYBRID_STORAGE'
    });

    return NextResponse.json({
      requests: filteredRequests.sort((a, b) =>
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      ),
      total: filteredRequests.length,
      debug: {
        globalTotal: allRequests.length,
        storageType: 'PERSISTENT_LOCALSTORAGE',
        lastUpdate: new Date().toISOString(),
        stats: HybridStorage.getStats(),
        note: 'Дані на клієнті можуть бути актуальнішими'
      }
    });

  } catch (error) {
    console.error('Помилка при отриманні запитів на ролі:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

// POST - створити новий запит на роль
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необхідна авторизація' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { requestedRole, reason } = body;

    console.log('📝 POST запит з HYBRID storage:', {
      userEmail: session.user.email,
      requestedRole,
      reasonLength: reason?.length
    });

    // Валідація
    if (!requestedRole || !['club_owner', 'coach_judge'].includes(requestedRole)) {
      return NextResponse.json(
        { error: 'Некоректна роль для запиту' },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json(
        { error: 'Опис причини має містити мінімум 10 символів' },
        { status: 400 }
      );
    }

    // Перевіряємо чи є вже активний запит від цього користувача
    const existingRequest = HybridStorage.findByEmailAndStatus(session.user.email, 'pending');

    if (existingRequest) {
      console.log('❌ Знайдено існуючий запит:', existingRequest.id);
      return NextResponse.json(
        { error: 'У вас вже є активний запит на роль' },
        { status: 409 }
      );
    }

    // Створюємо новий запит
    const newRequest: RoleRequest = {
      id: Date.now().toString(),
      userEmail: session.user.email,
      userName: session.user.name || 'Невідомий користувач',
      currentRole: 'athlete',
      requestedRole,
      reason: reason.trim(),
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    console.log('📝 Створення нового запиту у HYBRID сховищі:', {
      id: newRequest.id,
      userEmail: newRequest.userEmail,
      requestedRole: newRequest.requestedRole
    });

    // Додаємо до hybrid storage
    HybridStorage.add(newRequest);

    const stats = HybridStorage.getStats();
    console.log('✅ Запит додано до HYBRID сховища:', stats);

    return NextResponse.json({
      message: 'Запит на роль успішно створено',
      request: newRequest,
      debug: {
        totalRequests: stats.total,
        storageType: 'HYBRID_STORAGE',
        requestId: newRequest.id,
        stats
      }
    }, { status: 201 });

  } catch (error) {
    console.error('💥 Помилка при створенні запиту на роль:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

// PUT - оновити статус запиту (тільки для адміністраторів)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Недостатньо прав для обробки запитів' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, status, comment } = body;

    console.log('🔄 PUT запит для HYBRID storage:', {
      requestId,
      status,
      adminEmail: session.user.email
    });

    // Валідація
    if (!requestId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Некоректні дані запиту' },
        { status: 400 }
      );
    }

    // Знаходимо запит для отримання даних користувача
    const allRequests = HybridStorage.getAll();
    const targetRequest = allRequests.find(req => req.id === requestId);

    if (!targetRequest) {
      return NextResponse.json(
        { error: 'Запит не знайдено' },
        { status: 404 }
      );
    }

    // Оновлюємо статус запиту в HybridStorage
    const updateData = {
      status: status as 'approved' | 'rejected',
      reviewedBy: session.user.email || 'unknown',
      reviewDate: new Date().toISOString(),
      reviewComment: comment || ''
    };

    const updateSuccess = HybridStorage.update(requestId, updateData);

    if (!updateSuccess) {
      return NextResponse.json(
        { error: 'Помилка оновлення запиту' },
        { status: 500 }
      );
    }

    console.log('✅ Запит оновлено в HYBRID storage:', {
      requestId,
      status,
      reviewedBy: session.user.email
    });

    // Відправляємо email сповіщення
    try {
      const emailResult = await sendRoleStatusEmail(
        targetRequest.userEmail,
        status,
        {
          userName: targetRequest.userName,
          requestedRole: targetRequest.requestedRole,
          reviewedBy: session.user.email || 'Адміністратор',
          reviewComment: comment
        }
      );

      console.log('📧 Email сповіщення:', emailResult.success ? 'відправлено' : 'помилка');
    } catch (emailError) {
      console.error('⚠️ Помилка відправки email (не критично):', emailError);
    }

    return NextResponse.json({
      message: `Запит успішно ${status === 'approved' ? 'схвалено' : 'відхилено'}`,
      updateData: {
        requestId,
        ...updateData
      },
      debug: {
        storageType: 'HYBRID_STORAGE',
        processedBy: session.user.email,
        timestamp: new Date().toISOString(),
        emailSent: true
      }
    });

  } catch (error) {
    console.error('Помилка при оновленні запиту на роль:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
