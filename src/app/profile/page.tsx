"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Mail,
  Shield,
  Trophy,
  Users,
  Building,
  CheckCircle,
  Info,
  Save
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  roles: string[];
  primaryRole: string;
  bio?: string;
  phone?: string;
  club?: string;
  city?: string;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        roles: session.user.roles || ['athlete'],
        primaryRole: session.user.roles?.[0] || 'athlete',
        bio: '',
        phone: '',
        club: '',
        city: ''
      });
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Завантаження профілю...</p>
            </div>
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
            <p className="text-gray-600 mb-4">Увійдіть для перегляду профілю</p>
            <Button onClick={() => window.location.href = '/'}>
              Повернутися на головну
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "athlete": return "Спортсмен";
      case "club_owner": return "Власник клубу";
      case "coach_judge": return "Тренер/Суддя";
      case "admin": return "Адміністратор";
      default: return role;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "athlete":
        return "Участь у змаганнях, перегляд результатів";
      case "club_owner":
        return "Управління клубом, подача попередніх реєстрацій";
      case "coach_judge":
        return "Тренерська діяльність, суддівство, реєстрація учасників";
      case "admin":
        return "Повний доступ до системи, управління всіма функціями";
      default:
        return "";
    }
  };

  const canSelectRole = (role: string) => {
    if (!profile) return false;

    // Адмін не може змінювати свої ролі
    if (profile.roles.includes("admin")) return false;

    // Спортсмени можуть тільки переглядати
    if (profile.primaryRole === "athlete" && !profile.roles.includes("club_owner") && !profile.roles.includes("coach_judge")) {
      return false;
    }

    // Власники клубів та тренери можуть вибирати додаткові ролі
    return true;
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    if (!profile || !canSelectRole(role)) return;

    setProfile(prev => {
      if (!prev) return prev;

      let newRoles = [...prev.roles];

      if (checked) {
        if (!newRoles.includes(role)) {
          newRoles.push(role);
        }
      } else {
        // Не дозволяємо видаляти основну роль
        if (role !== prev.primaryRole) {
          newRoles = newRoles.filter(r => r !== role);
        }
      }

      return { ...prev, roles: newRoles };
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      // Тут би була логіка збереження в БД
      // await updateUserProfile(profile);

      // Оновлюємо сесію
      await update({
        roles: profile.roles,
        primaryRole: profile.primaryRole
      });

      setMessage('✅ Профіль успішно оновлено!');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      setMessage('❌ Помилка при збереженні профілю');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  const availableRoles = [
    { id: 'athlete', icon: Trophy },
    { id: 'club_owner', icon: Building },
    { id: 'coach_judge', icon: Users },
    { id: 'admin', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              👤 Профіль користувача
            </h1>
            <p className="text-gray-600">
              Управління особистою інформацією та ролями в системі ФУСАФ
            </p>
          </div>

          {message && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Основна інформація */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Основна інформація
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Повне ім'я</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => prev ? {...prev, name: e.target.value} : prev)}
                    placeholder="Прізвище Ім'я По батькові"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email не можна змінити
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : prev)}
                    placeholder="+380XXXXXXXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="city">Місто</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile(prev => prev ? {...prev, city: e.target.value} : prev)}
                    placeholder="Київ, Львів, Одеса..."
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Про себе</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => prev ? {...prev, bio: e.target.value} : prev)}
                    placeholder="Розкажіть про свій досвід..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ролі в системі */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Ролі в системі ФУСАФ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Поточні ролі */}
                <div>
                  <Label className="text-sm font-medium">Поточні ролі:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.roles.map(role => (
                      <Badge key={role} variant={role === profile.primaryRole ? "default" : "secondary"}>
                        {getRoleLabel(role)}
                        {role === profile.primaryRole && " (основна)"}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Інформація про можливості */}
                {profile.roles.includes("admin") && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Адміністратор:</strong> Ви маєте повний доступ до всіх функцій системи.
                    </AlertDescription>
                  </Alert>
                )}

                {profile.primaryRole === "athlete" && !profile.roles.includes("club_owner") && !profile.roles.includes("coach_judge") && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Спортсмен:</strong> Ви можете переглядати змагання та інформацію.
                      Реєстрацію на змагання подають тренери або представники клубів.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Доступні ролі для вибору */}
                {canSelectRole("any") && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Додаткові ролі:</Label>
                    <p className="text-xs text-gray-500">
                      Тренери та власники клубів можуть мати декілька ролей одночасно
                    </p>

                    {availableRoles.map(({ id, icon: Icon }) => (
                      <div key={id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={`role-${id}`}
                          checked={profile.roles.includes(id)}
                          onCheckedChange={(checked) => handleRoleChange(id, checked as boolean)}
                          disabled={!canSelectRole(id) || id === profile.primaryRole}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <Label htmlFor={`role-${id}`} className="font-medium">
                              {getRoleLabel(id)}
                            </Label>
                            {id === profile.primaryRole && (
                              <Badge variant="outline" className="text-xs">
                                Основна
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {getRoleDescription(id)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Кнопка збереження */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Збереження...' : 'Зберегти зміни'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
