"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { RoleRequestStatus } from "@/components/RoleRequestStatus";
import { RequestRoleUpgrade } from "@/components/RequestRoleUpgrade";
import {
  Trophy,
  User,
  Calendar,
  Award,
  FileText,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Medal,
  Target,
  Users,
  BookOpen,
  Camera
} from "lucide-react";

// Компонент панелі спортсмена
function AthletePanelContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showRoleRequestAlert, setShowRoleRequestAlert] = useState(false);

  // Перевірка параметру roleRequested
  useEffect(() => {
    // Використовуємо URLSearchParams замість useSearchParams для уникнення Suspense помилки
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('roleRequested') === 'true') {
        setShowRoleRequestAlert(true);
        // Очищаємо URL параметр
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  // Перевірка автентифікації
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Завантаження панелі...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Фейкові дані для демонстрації
  const athleteStats = {
    competitions: 12,
    medals: 8,
    points: 1250,
    rank: 15
  };

  const recentCompetitions = [
    {
      id: 1,
      name: "Кубок України з аеробіки 2024",
      date: "2024-03-15",
      place: "2 місце",
      category: "Жінки 18-25"
    },
    {
      id: 2,
      name: "Відкритий чемпіонат Києва",
      date: "2024-02-20",
      place: "1 місце",
      category: "Жінки 18-25"
    },
    {
      id: 3,
      name: "Зимовий турнір ФУСАФ",
      date: "2024-01-18",
      place: "3 місце",
      category: "Жінки 18-25"
    }
  ];

  const upcomingCompetitions = [
    {
      id: 4,
      name: "Чемпіонат України 2024",
      date: "2024-05-20",
      location: "Харків",
      registrationOpen: true
    },
    {
      id: 5,
      name: "Літній кубок",
      date: "2024-06-15",
      location: "Одеса",
      registrationOpen: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Привітання */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🏆 Панель спортсмена
            </h1>
            <p className="text-gray-600">
              Привіт, {session.user.name}! Керуйте своїми змаганнями та досягненнями
            </p>
          </div>

          {/* Алерт при успішній подачі запиту */}
          {showRoleRequestAlert && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Запит успішно подано!</strong> Ваш запит на роль направлено адміністратору для розгляду.
                Статус запиту можна переглянути нижче.
              </AlertDescription>
            </Alert>
          )}

          {/* Статус запиту на роль - показується завжди якщо є активний запит */}
          <div className="mb-6">
            <RoleRequestStatus />
          </div>

          {/* Швидка статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Trophy className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Змагання</p>
                    <p className="text-2xl font-bold text-gray-900">{athleteStats.competitions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Medal className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Медалі</p>
                    <p className="text-2xl font-bold text-gray-900">{athleteStats.medals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Бали</p>
                    <p className="text-2xl font-bold text-gray-900">{athleteStats.points}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Рейтинг</p>
                    <p className="text-2xl font-bold text-gray-900">#{athleteStats.rank}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Основні вкладки */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Огляд</span>
              </TabsTrigger>
              <TabsTrigger value="competitions" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Змагання</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Профіль</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Документи</span>
              </TabsTrigger>
            </TabsList>

            {/* Вкладка Огляд */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Останні результати */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Останні результати
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentCompetitions.map((comp) => (
                        <div key={comp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{comp.name}</p>
                            <p className="text-sm text-gray-600">{comp.category}</p>
                            <p className="text-xs text-gray-500">{new Date(comp.date).toLocaleDateString('uk-UA')}</p>
                          </div>
                          <Badge
                            className={
                              comp.place.includes('1') ? 'bg-yellow-500' :
                              comp.place.includes('2') ? 'bg-gray-400' :
                              comp.place.includes('3') ? 'bg-orange-500' :
                              'bg-blue-500'
                            }
                          >
                            {comp.place}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Майбутні змагання */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Майбутні змагання
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingCompetitions.map((comp) => (
                        <div key={comp.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{comp.name}</h4>
                            {comp.registrationOpen ? (
                              <Badge className="bg-green-500">Реєстрація відкрита</Badge>
                            ) : (
                              <Badge variant="outline">Очікування</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{comp.location}</p>
                          <p className="text-xs text-gray-500">{new Date(comp.date).toLocaleDateString('uk-UA')}</p>
                          {comp.registrationOpen && (
                            <Button size="sm" className="mt-2">
                              Зареєструватися
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Запит на роль - показується тільки якщо немає активного запиту */}
              <RequestRoleUpgrade />
            </TabsContent>

            {/* Вкладка Змагання */}
            <TabsContent value="competitions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Активні реєстрації</CardTitle>
                    <CardDescription>Змагання, на які ви зареєстровані</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Немає активних реєстрацій
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Зареєструйтеся на змагання для участі
                      </p>
                      <Button onClick={() => router.push('/competitions')}>
                        Переглянути змагання
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Історія змагань</CardTitle>
                    <CardDescription>Ваші попередні виступи</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentCompetitions.map((comp) => (
                        <div key={comp.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{comp.name}</p>
                            <p className="text-sm text-gray-600">{new Date(comp.date).toLocaleDateString('uk-UA')}</p>
                          </div>
                          <Badge>{comp.place}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Вкладка Профіль */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Особиста інформація</CardTitle>
                  <CardDescription>Ваші дані та налаштування профілю</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Ім'я</label>
                        <p className="mt-1 text-sm text-gray-900">{session.user.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{session.user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Роль</label>
                        <p className="mt-1">
                          <Badge>{session.user.roles?.includes('athlete') ? 'Спортсмен' : 'Користувач'}</Badge>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Дата народження</label>
                        <p className="mt-1 text-sm text-gray-900">Не вказано</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Клуб</label>
                        <p className="mt-1 text-sm text-gray-900">Не вказано</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Тренер</label>
                        <p className="mt-1 text-sm text-gray-900">Не вказано</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Редагувати профіль
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Вкладка Документи */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Документи та сертифікати</CardTitle>
                  <CardDescription>Ваші офіційні документи та досягнення</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Немає завантажених документів
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Завантажте свої сертифікати, дипломи та інші документи
                    </p>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Завантажити документ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Головний компонент з Suspense
export default function AthletePanelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Завантаження панелі спортсмена...</p>
          </div>
        </div>
      </div>
    }>
      <AthletePanelContent />
    </Suspense>
  );
}
