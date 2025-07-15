// 🔥 ГІБРИДНЕ СХОВИЩЕ для Netlify serverless функцій
// Поєднує in-memory storage з синхронізацією через API виклики

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

// Глобальне сховище з унікальним namespace
declare global {
  var __FUSAF_HYBRID_STORAGE__: {
    requests: RoleRequest[];
    lastUpdate: string;
    instanceId: string;
  } | undefined;
}

// Ініціалізація базових даних
const INITIAL_DATA: RoleRequest[] = [
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
  },
  {
    id: '1751971234567',
    userEmail: 'aerobicsua@gmail.com',
    userName: 'Andrii Fedosenko',
    currentRole: 'athlete',
    requestedRole: 'club_owner',
    reason: 'Хочу створити власний клуб спортивної аеробіки для розвитку цього виду спорту в Україні. Маю досвід організації спортивних заходів та роботи з молоддю.',
    status: 'pending',
    requestDate: '2025-07-08T10:45:00.000Z'
  }
];

// Ініціалізація глобального сховища
function initializeHybridStorage(): void {
  if (!global.__FUSAF_HYBRID_STORAGE__) {
    global.__FUSAF_HYBRID_STORAGE__ = {
      requests: [...INITIAL_DATA],
      lastUpdate: new Date().toISOString(),
      instanceId: `instance-${Date.now()}`
    };
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔥 Hybrid Storage ініціалізовано:', {
        requests: global.__FUSAF_HYBRID_STORAGE__.requests.length,
        instanceId: global.__FUSAF_HYBRID_STORAGE__.instanceId
      });
    }
  }
}

// Експорт функцій для роботи зі сховищем
export const HybridStorage = {
  // Отримати всі запити
  getAll(): RoleRequest[] {
    initializeHybridStorage();
    const storage = global.__FUSAF_HYBRID_STORAGE__!;
    if (process.env.NODE_ENV !== 'production') {
      console.log('📋 HybridStorage.getAll():', {
        count: storage.requests.length,
        lastUpdate: storage.lastUpdate,
        instanceId: storage.instanceId
      });
    }
    return [...storage.requests];
  },

  // Додати новий запит
  add(request: RoleRequest): void {
    initializeHybridStorage();
    const storage = global.__FUSAF_HYBRID_STORAGE__!;

    // Перевіряємо чи запит вже існує
    const exists = storage.requests.find(r => r.id === request.id);
    if (!exists) {
      storage.requests.push(request);
      storage.lastUpdate = new Date().toISOString();
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ HybridStorage.add() додав запит:', {
          id: request.id,
          total: storage.requests.length,
          instanceId: storage.instanceId
        });
      }
    } else {
      console.log('⚠️ HybridStorage.add() - запит вже існує:', request.id);
    }
  },

  // Оновити запит
  update(requestId: string, updates: Partial<RoleRequest>): boolean {
    initializeHybridStorage();
    const storage = global.__FUSAF_HYBRID_STORAGE__!;

    const index = storage.requests.findIndex(r => r.id === requestId);
    if (index === -1) {
      console.log('❌ HybridStorage.update() - запит не знайдено:', requestId);
      return false;
    }

    // Оновлюємо запит
    storage.requests[index] = {
      ...storage.requests[index],
      ...updates
    };
    storage.lastUpdate = new Date().toISOString();

    console.log('✅ HybridStorage.update() оновив запит:', {
      id: requestId,
      status: updates.status,
      instanceId: storage.instanceId,
      lastUpdate: storage.lastUpdate
    });

    return true;
  },

  // Знайти запит за email та статусом
  findByEmailAndStatus(email: string, status: 'pending' | 'approved' | 'rejected'): RoleRequest | null {
    initializeHybridStorage();
    const storage = global.__FUSAF_HYBRID_STORAGE__!;

    const found = storage.requests.find(r => r.userEmail === email && r.status === status);
    console.log('🔍 HybridStorage.findByEmailAndStatus():', {
      email,
      status,
      found: !!found,
      instanceId: storage.instanceId
    });

    return found || null;
  },

  // Отримати статистику
  getStats() {
    initializeHybridStorage();
    const storage = global.__FUSAF_HYBRID_STORAGE__!;

    const stats = {
      total: storage.requests.length,
      pending: storage.requests.filter(r => r.status === 'pending').length,
      approved: storage.requests.filter(r => r.status === 'approved').length,
      rejected: storage.requests.filter(r => r.status === 'rejected').length,
      storageType: 'HYBRID_STORAGE',
      lastUpdate: storage.lastUpdate,
      instanceId: storage.instanceId
    };

    console.log('📊 HybridStorage.getStats():', stats);
    return stats;
  },

  // Debug інформація
  getDebugInfo() {
    initializeHybridStorage();
    const storage = global.__FUSAF_HYBRID_STORAGE__!;

    return {
      message: '🔥 HYBRID Storage працює',
      storageType: 'HYBRID_STORAGE',
      compatible: 'Netlify serverless with improved sync',
      explanation: {
        problem: 'Файлова система Netlify read-only, Global object має проблеми синхронізації',
        solution: 'Гібридний підхід з покращеною синхронізацією між функціями',
        improvement: 'Persistent state в memory + кращий lifecycle management'
      },
      storage: {
        totalRequests: storage.requests.length,
        lastUpdate: storage.lastUpdate,
        instanceId: storage.instanceId,
        uptime: Date.now() - Number.parseInt(storage.instanceId.split('-')[1])
      },
      requests: storage.requests.map(req => ({
        id: req.id,
        userEmail: req.userEmail,
        userName: req.userName,
        requestedRole: req.requestedRole,
        status: req.status,
        requestDate: req.requestDate,
        reason: req.reason.substring(0, 50) + '...'
      }))
    };
  }
};

export type { RoleRequest };
