"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Building, UserCheck, Shield, Users, CheckCircle } from "lucide-react";

const ROLE_CONFIG = {
  athlete: {
    name: 'Спортсмен',
    icon: Trophy,
    description: 'Участь у змаганнях, перегляд результатів',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    requiresApproval: false
  },
  club_owner: {
    name: 'Власник клубу',
    icon: Building,
    description: 'Управління клубом, реєстрація спортсменів',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    requiresApproval: true
  },
  coach_judge: {
    name: 'Тренер/Суддя',
    icon: UserCheck,
    description: 'Тренування спортсменів, суддівство змагань',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    requiresApproval: true
  }
};

function RoleSelectionContent() {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('athlete');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Отримуємо роль з URL параметрів
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl && ROLE_CONFIG[roleFromUrl as keyof typeof ROLE_CONFIG]) {
      setSelectedRole(roleFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleConfirmRole = async () => {
    if (!session?.user?.email) return;

    setIsLoading(true);
    try {
      const roleConfig = ROLE_CONFIG[selectedRole as keyof typeof ROLE_CONFIG];

      if (roleConfig.requiresApproval) {
        // Для ролей, які потребують схвалення, створюємо запит
        const response = await fetch('/api/role-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestedRole: selectedRole,
            userEmail: session.user.email,
            userName: session.user.name,
            reason: `Запит на отримання ролі "${roleConfig.name}"`
          }),
        });

        if (response.ok) {
          // Користувач залишається спортсменом до схвалення
          console.log('Запит на роль створено успішно');
          router.push('/athlete-panel?roleRequested=true');
        } else {
          const errorData = await response.json();
          console.error('Помилка при створенні запиту на роль:', errorData.error);
          alert('Помилка: ' + errorData.error);
        }
      } else {
        // Для спортсмена - надаємо роль одразу
        console.log('Роль спортсмена надана одразу');
        router.push('/athlete-panel');
      }
    } catch (error) {
      console.error('Помилка при збереженні ролі:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    return null;
  }

  const roleConfig = ROLE_CONFIG[selectedRole as keyof typeof ROLE_CONFIG];
  const Icon = roleConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Підтвердження ролі
              </CardTitle>
              <CardDescription className="text-gray-600">
                Вітаємо у ФУСАФ, {session.user.name}! Підтвердіть вашу роль в системі.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Обрана роль */}
              <div className={`p-4 rounded-lg border-2 border-blue-500 ${roleConfig.bgColor}`}>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500 text-white rounded-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{roleConfig.name}</h3>
                      {roleConfig.requiresApproval && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                          Потребує схвалення
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{roleConfig.description}</p>

                    {roleConfig.requiresApproval ? (
                      <div className="bg-white rounded-lg p-3 border border-yellow-200">
                        <div className="flex items-start space-x-2">
                          <Shield className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-yellow-800">Що відбудеться далі:</p>
                            <ul className="mt-1 space-y-1 text-yellow-700">
                              <li>• Буде створено запит до адміністратора</li>
                              <li>• Тимчасово ви матимете права спортсмена</li>
                              <li>• Після схвалення отримаєте повні права ролі</li>
                              <li>• Ви отримаєте сповіщення про результат</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <p className="text-sm font-medium text-green-800">
                            Роль буде надана одразу після підтвердження
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Можливості ролі */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Ваші можливості:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    Реєстрація на змагання
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    Управління особистим профілем
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                    Перегляд результатів змагань
                  </li>

                  {selectedRole === 'club_owner' && (
                    <>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                        Управління клубом (після схвалення)
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                        Реєстрація спортсменів клубу (після схвалення)
                      </li>
                    </>
                  )}

                  {selectedRole === 'coach_judge' && (
                    <>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                        Доступ до функцій тренера (після схвалення)
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                        Участь у суддівстві (після схвалення)
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Кнопки дій */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleConfirmRole}
                  disabled={isLoading}
                  className="flex-1 h-12 text-base font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {roleConfig.requiresApproval ? 'Створення запиту...' : 'Збереження...'}
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {roleConfig.requiresApproval ? 'Подати запит' : 'Підтвердити роль'}
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => router.push('/auth/signin')}
                  variant="outline"
                  disabled={isLoading}
                  className="px-6 h-12"
                >
                  Назад
                </Button>
              </div>

              {/* Додаткова інформація */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Маєте питання? Напишіть нам на{" "}
                  <a href="mailto:info@fusaf.org.ua" className="text-blue-600 hover:underline">
                    info@fusaf.org.ua
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function RoleSelection() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Завантаження...</p>
          </div>
        </div>
      </div>
    }>
      <RoleSelectionContent />
    </Suspense>
  );
}
