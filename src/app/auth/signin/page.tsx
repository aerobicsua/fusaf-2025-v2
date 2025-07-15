"use client";

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // Перевіряємо сесію та перенаправляємо
        const session = await getSession();
        console.log('✅ Успішний вхід:', session?.user?.email);

        // Перенаправляємо в залежності від ролі
        if (session?.user?.roles?.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Помилка входу:', error);
      setError('Помилка входу в систему');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'andfedos@gmail.com', password: 'password123', role: 'Адміністратор' },
    { email: 'coach@fusaf.org.ua', password: 'password123', role: 'Тренер/Суддя' },
    { email: 'athlete@fusaf.org.ua', password: 'password123', role: 'Спортсмен' }
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Логотип та заголовок */}
        <div className="text-center">
          <div className="mb-4">
            <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">Ф</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ФУСАФ</h1>
            <p className="text-gray-600">Федерація України зі Спортивної Аеробіки і Фітнесу</p>
          </div>
        </div>

        {/* Форма входу */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LogIn className="h-5 w-5 mr-2" />
              Вхід в систему
            </CardTitle>
            <CardDescription>
              Введіть вашу електронну пошту та пароль для входу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Електронна пошта</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ваш пароль"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Вхід...
                  </div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Увійти
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Немає облікового запису?{' '}
                <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 font-medium">
                  Зареєструватися
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Демо облікові записи */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Демо облікові записи</CardTitle>
            <CardDescription className="text-xs">
              Для тестування системи можете використовувати ці облікові записи
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div>
                    <div className="font-medium">{cred.role}</div>
                    <div className="text-gray-600">{cred.email}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fillDemoCredentials(cred.email, cred.password)}
                    className="text-xs"
                  >
                    Використати
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Посилання на головну */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            ← Повернутися на головну
          </Link>
        </div>
      </div>
    </div>
  );
}
