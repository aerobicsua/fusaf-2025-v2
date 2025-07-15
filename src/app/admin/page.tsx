"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Trophy,
  DollarSign,
  Shield,
  Settings,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Building,
  FileText
} from 'lucide-react';
import { AdminDocsTab } from '@/components/admin/AdminDocsTab';

// Інтерфейс для запиту ролі
interface RoleRequest {
  id: string;
  userEmail: string;
  userName: string;
  currentRole: string;
  requestedRole: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

// Компонент для управління запитами ролей
function RoleRequestsManager() {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/role-requests');
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests || []);
        }
      } catch (error) {
        console.error('Помилка завантаження запитів:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/role-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          status: action,
          comment: action === 'approved' ? 'Схвалено адміністратором' : 'Відхилено адміністратором'
        }),
      });

      if (response.ok) {
        // Оновлюємо список запитів
        const updatedRequests = requests.map((req) =>
          req.id === requestId ? { ...req, status: action } : req
        );
        setRequests(updatedRequests);
      }
    } catch (error) {
      console.error('Помилка при обробці запиту:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          Очікує
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Схвалено
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          Відхилено
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'club_owner':
        return <Building className="h-4 w-4" />;
      case 'coach_judge':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'club_owner':
        return 'Власник клубу';
      case 'coach_judge':
        return 'Тренер/Суддя';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Завантаження запитів...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <UserCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Немає запитів на ролі
        </h3>
        <p className="text-gray-600">
          Коли користувачі подадуть запити на ролі, вони з'являться тут
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Активні запити ({requests.length})</h3>
        <Button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }}
          variant="outline"
          size="sm"
        >
          Оновити
        </Button>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(request.requestedRole)}
                    <span className="font-medium">{request.userName}</span>
                    <span className="text-gray-500">→</span>
                    <span className="font-medium text-blue-600">
                      {getRoleName(request.requestedRole)}
                    </span>
                    {getStatusBadge(request.status)}
                  </div>

                  <p className="text-sm text-gray-600">
                    Email: {request.userEmail}
                  </p>

                  <p className="text-sm">
                    <span className="font-medium">Причина:</span> {request.reason}
                  </p>

                  <p className="text-xs text-gray-500">
                    Подано: {new Date(request.requestDate).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleRequestAction(request.id, 'approved')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Схвалити
                    </Button>
                    <Button
                      onClick={() => handleRequestAction(request.id, 'rejected')}
                      size="sm"
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Відхилити
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');

  // Перевірка доступу
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Завантаження...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Доступ заборонено</h1>
            <p className="text-gray-600 mb-4">Увійдіть для доступу до адміністративної панелі</p>
            <Button onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            }}>
              Повернутися на головну
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Перевірка ролі адміністратора
  const isAdmin = session?.user?.roles?.includes('admin');

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto text-orange-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Недостатньо прав</h1>
            <p className="text-gray-600 mb-4">
              Доступ до адміністративної панелі мають тільки адміністратори
            </p>
            <Button onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            }}>
              Повернутися на головну
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🛡️ Адміністративна панель ФУСАФ
            </h1>
            <p className="text-gray-600">
              Управління системою, користувачами та фінансами федерації
            </p>
          </div>

          {/* Швидка статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Користувачі</p>
                    <p className="text-2xl font-bold text-gray-900">2,847</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Змагання</p>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Запити ролей</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Доходи</p>
                    <p className="text-2xl font-bold text-gray-900">125,000₴</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Вкладки */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Огляд</span>
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4" />
                <span>Запити ролей</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Користувачі</span>
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Документація</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Системний огляд</CardTitle>
                  <CardDescription>
                    Загальна інформація про стан системи ФУСАФ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-800">✅ Система стабільна</h3>
                      <p className="text-green-700">Всі основні компоненти працюють правильно</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Останні активності</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Новий користувач зареєстрований</li>
                          <li>• Запит на роль власника клубу</li>
                          <li>• Оновлення змагання</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Швидкі дії</h4>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full" onClick={() => setActiveTab('roles')}>
                            Переглянути запити ролей
                          </Button>
                          <Button size="sm" variant="outline" className="w-full" onClick={() => setActiveTab('users')}>
                            Управління користувачами
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Запити на ролі</CardTitle>
                  <CardDescription>
                    Управління запитами користувачів на отримання додаткових ролей
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RoleRequestsManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управління користувачами</CardTitle>
                  <CardDescription>
                    Перегляд та управління зареєстрованими користувачами системи
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Управління користувачами
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Список користувачів та функції управління будуть додані найближчим часом
                    </p>
                    <Button variant="outline">
                      Завантажити список
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="docs" className="space-y-6">
              <AdminDocsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
