// 🚀 ЦЕНТРАЛІЗОВАНЕ СХОВИЩЕ ДЛЯ NETLIFY SERVERLESS
// Використовуємо глобальний об'єкт для збереження стану між викликами

interface RoleRequest {
  id: string;
  userEmail: string;
  userName: string;
  currentRole: string;
  requestedRole: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  reviewComment?: string;
}

// Використовуємо глобальний об'єкт для збереження стану
declare global {
  var __FUSAF_ROLE_REQUESTS__: RoleRequest[] | undefined;
}

// Ініціалізуємо базові дані якщо ще не існує
if (!global.__FUSAF_ROLE_REQUESTS__) {
  global.__FUSAF_ROLE_REQUESTS__ = [
    {
      id: '1',
      userEmail: 'john.doe@example.com',
      userName: 'Іван Петренко',
      currentRole: 'athlete',
      requestedRole: 'club_owner',
      reason: 'Хочу відкрити власний клуб спортивної аеробіки в Києві. Маю досвід тренування та бажання розвивати цей спорт серед молоді.',
      status: 'pending',
      requestDate: '2025-01-07T10:30:00.000Z'
    },
    {
      id: '2',
      userEmail: 'coach.maria@example.com',
      userName: 'Марія Коваленко',
      currentRole: 'athlete',
      requestedRole: 'coach_judge',
      reason: 'Маю досвід тренерської роботи 5 років та хочу стати сертифікованим суддею для проведення змагань.',
      status: 'approved',
      requestDate: '2025-01-05T14:20:00.000Z',
      reviewedBy: 'andfedos@gmail.com',
      reviewDate: '2025-01-06T09:15:00.000Z',
      reviewComment: 'Схвалено. Досвід підтверджено документами.'
    },
    {
      id: '3',
      userEmail: 'trainer.alex@example.com',
      userName: 'Олександр Шевченко',
      currentRole: 'athlete',
      requestedRole: 'coach_judge',
      reason: 'Закінчив спортивний університет, маю кваліфікацію тренера з гімнастики. Хочу розширити свої можливості в аеробіці.',
      status: 'rejected',
      requestDate: '2025-01-04T16:45:00.000Z',
      reviewedBy: 'andfedos@gmail.com',
      reviewDate: '2025-01-05T11:30:00.000Z',
      reviewComment: 'Потрібні додаткові документи про кваліфікацію в аеробіці.'
    }
  ];

  console.log('🏗️ FUSAF Global Storage ініціалізовано з', global.__FUSAF_ROLE_REQUESTS__.length, 'запитами');
}

// Функції для роботи зі сховищем
export const RoleRequestsStorage = {
  // Отримати всі запити
  getAll(): RoleRequest[] {
    const requests = global.__FUSAF_ROLE_REQUESTS__ || [];
    console.log('📋 Storage.getAll() повертає', requests.length, 'запитів');
    return [...requests]; // Повертаємо копію
  },

  // Додати новий запит
  add(request: RoleRequest): void {
    if (!global.__FUSAF_ROLE_REQUESTS__) {
      global.__FUSAF_ROLE_REQUESTS__ = [];
    }

    global.__FUSAF_ROLE_REQUESTS__.push(request);
    console.log('✅ Storage.add() додав запит. Загальна кількість:', global.__FUSAF_ROLE_REQUESTS__.length);
  },

  // Оновити запит
  update(requestId: string, updates: Partial<RoleRequest>): boolean {
    if (!global.__FUSAF_ROLE_REQUESTS__) {
      console.log('❌ Storage.update() - сховище не ініціалізоване');
      return false;
    }

    const index = global.__FUSAF_ROLE_REQUESTS__.findIndex(req => req.id === requestId);
    if (index === -1) {
      console.log('❌ Storage.update() - запит не знайдено:', requestId);
      return false;
    }

    global.__FUSAF_ROLE_REQUESTS__[index] = {
      ...global.__FUSAF_ROLE_REQUESTS__[index],
      ...updates
    };

    console.log('✅ Storage.update() оновив запит:', requestId);
    return true;
  },

  // Знайти запит за email та статусом
  findByEmailAndStatus(email: string, status: 'pending' | 'approved' | 'rejected'): RoleRequest | null {
    const requests = global.__FUSAF_ROLE_REQUESTS__ || [];
    const found = requests.find(req => req.userEmail === email && req.status === status);
    console.log('🔍 Storage.findByEmailAndStatus() для', email, status, '- знайдено:', !!found);
    return found || null;
  },

  // Отримати статистику
  getStats() {
    const requests = global.__FUSAF_ROLE_REQUESTS__ || [];
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      storageType: 'GLOBAL_OBJECT'
    };

    console.log('📊 Storage.getStats():', stats);
    return stats;
  }
};

export type { RoleRequest };
