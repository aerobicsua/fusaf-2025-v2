"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw, Mail } from "lucide-react";

const errorTypes = {
  Configuration: {
    title: "Помилка конфігурації",
    description: "Сталася помилка в налаштуваннях системи авторизації.",
    suggestion: "Спробуйте пізніше або зверніться до адміністратора."
  },
  AccessDenied: {
    title: "Доступ заборонено",
    description: "У вас немає прав для доступу до цього ресурсу.",
    suggestion: "Переконайтеся, що ви використовуєте правильний обліковий запис."
  },
  Verification: {
    title: "Помилка верифікації",
    description: "Не вдалося підтвердити ваш обліковий запис.",
    suggestion: "Перевірте посилання та спробуйте ще раз."
  },
  OAuthSignin: {
    title: "Помилка OAuth входу",
    description: "Сталася помилка під час авторизації через зовнішній сервіс.",
    suggestion: "Спробуйте увійти ще раз або використайте інший спосіб."
  },
  OAuthCallback: {
    title: "Помилка OAuth callback",
    description: "Помилка при поверненні від провайдера авторизації.",
    suggestion: "Спробуйте почати процес авторизації спочатку."
  },
  OAuthCreateAccount: {
    title: "Помилка створення облікового запису",
    description: "Не вдалося створити обліковий запис через OAuth.",
    suggestion: "Спробуйте ще раз або зверніться до підтримки."
  },
  EmailCreateAccount: {
    title: "Помилка створення email облікового запису",
    description: "Не вдалося створити обліковий запис з email.",
    suggestion: "Перевірте правильність email адреси."
  },
  Callback: {
    title: "Помилка callback",
    description: "Сталася помилка при обробці результату авторизації.",
    suggestion: "Спробуйте увійти ще раз."
  },
  OAuthAccountNotLinked: {
    title: "Обліковий запис не пов'язано",
    description: "Цей email вже використовується з іншим провайдером авторизації.",
    suggestion: "Спробуйте увійти через той же провайдер, який використовували раніше."
  },
  EmailSignin: {
    title: "Помилка входу через email",
    description: "Не вдалося відправити email для входу.",
    suggestion: "Перевірте email адресу та спробуйте ще раз."
  },
  CredentialsSignin: {
    title: "Невірні дані для входу",
    description: "Неправильні облікові дані.",
    suggestion: "Перевірте правильність введених даних."
  },
  SessionRequired: {
    title: "Необхідна авторизація",
    description: "Для доступу до цієї сторінки потрібно увійти в систему.",
    suggestion: "Будь ласка, авторизуйтесь."
  },
  default: {
    title: "Невідома помилка",
    description: "Сталася невідома помилка при авторизації.",
    suggestion: "Спробуйте ще раз або зверніться до підтримки."
  }
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error') || 'default';

  const errorInfo = errorTypes[error as keyof typeof errorTypes] || errorTypes.default;

  const handleRetry = () => {
    router.push('/auth/signin');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {errorInfo.title}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {errorInfo.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Опис проблеми */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>Рекомендація:</strong> {errorInfo.suggestion}
                </p>
              </div>

              {/* Код помилки */}
              {error !== 'default' && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-mono">
                    Код помилки: {error}
                  </p>
                </div>
              )}

              {/* Дії */}
              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="w-full h-12 text-base font-medium"
                >
                  <RefreshCw className="h-5 w-5 mr-3" />
                  Спробувати ще раз
                </Button>

                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                >
                  <Home className="h-5 w-5 mr-3" />
                  На головну сторінку
                </Button>
              </div>

              {/* Контактна інформація */}
              <div className="border-t pt-6">
                <div className="text-center space-y-3">
                  <h4 className="font-medium text-gray-900">Потрібна допомога?</h4>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <a
                      href="mailto:info@fusaf.org.ua"
                      className="text-blue-600 hover:underline"
                    >
                      info@fusaf.org.ua
                    </a>
                  </div>
                  <p className="text-xs text-gray-500">
                    Опишіть проблему та включіть код помилки для швидшого вирішення
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Додаткова інформація */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Можливі причини:</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Тимчасові проблеми з мережею</li>
              <li>• Технічні роботи на сервері</li>
              <li>• Блокування cookies або JavaScript</li>
              <li>• Використання застарілої версії браузера</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
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
      <AuthErrorContent />
    </Suspense>
  );
}
