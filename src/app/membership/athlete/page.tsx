"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Calendar,
  Users,
  Award,
  CheckCircle,
  UserPlus,
  Target,
  Star,
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Shield,
  Heart
} from "lucide-react";

interface RegistrationData {
  // Особисті дані
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;

  // Контактна інформація
  email: string;
  phone: string;
  address: string;
  city: string;

  // Спортивна інформація
  experience: string;
  category: string;
  previousClub: string;
  achievements: string;

  // Медична інформація
  hasMedicalClearance: boolean;
  medicalConditions: string;

  // Контакт екстреної допомоги
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;

  // Згоди
  dataProcessingConsent: boolean;
  rulesAcceptance: boolean;
  photoConsent: boolean;
}

export default function AthleteRegistrationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    experience: '',
    category: '',
    previousClub: '',
    achievements: '',
    hasMedicalClearance: false,
    medicalConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    dataProcessingConsent: false,
    rulesAcceptance: false,
    photoConsent: false
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Оновлюємо email в формі коли сесія завантажується та відновлюємо збережені дані
  useEffect(() => {
    // Відновлюємо збережені дані форми з localStorage
    const savedFormData = localStorage.getItem('athleteFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(prev => ({
          ...prev,
          ...parsedData,
          email: session?.user?.email || parsedData.email // Переписуємо email з сесії
        }));
        localStorage.removeItem('athleteFormData'); // Очищаємо збережені дані
      } catch (error) {
        console.error('Помилка відновлення даних форми:', error);
      }
    } else if (session?.user?.email) {
      setFormData(prev => ({
        ...prev,
        email: session.user.email || ''
      }));
    }
  }, [session]);

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    // Основні поля
    if (!formData.firstName.trim()) newErrors.push('Ім\'я обов\'язкове');
    if (!formData.lastName.trim()) newErrors.push('Прізвище обов\'язкове');
    if (!formData.dateOfBirth) newErrors.push('Дата народження обов\'язкова');
    if (!formData.gender) newErrors.push('Стать обов\'язкова');
    if (!formData.email.trim()) newErrors.push('Email обов\'язковий');
    if (!formData.phone.trim()) newErrors.push('Телефон обов\'язковий');
    if (!formData.city.trim()) newErrors.push('Місто обов\'язкове');
    if (!formData.experience) newErrors.push('Досвід у спорті обов\'язковий');
    if (!formData.category) newErrors.push('Категорія обов\'язкова');

    // Перевірка email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push('Введіть коректний email');
    }

    // Перевірка телефону
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.push('Введіть коректний номер телефону');
    }

    // Контакт екстреної допомоги
    if (!formData.emergencyContactName.trim()) newErrors.push('Ім\'я контакту екстреної допомоги обов\'язкове');
    if (!formData.emergencyContactPhone.trim()) newErrors.push('Телефон контакту екстреної допомоги обов\'язковий');
    if (!formData.emergencyContactRelation.trim()) newErrors.push('Ступінь спорідненості обов\'язковий');

    // Згоди
    if (!formData.dataProcessingConsent) newErrors.push('Згода на обробку персональних даних обов\'язкова');
    if (!formData.rulesAcceptance) newErrors.push('Прийняття правил федерації обов\'язкове');

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Перевіряємо авторизацію при відправці форми
    if (!session) {
      // Зберігаємо дані форми в localStorage перед перенаправленням
      localStorage.setItem('athleteFormData', JSON.stringify(formData));
      router.push('/auth/signin?redirect=' + encodeURIComponent('/membership/athlete'));
      return;
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      // Отправляємо дані реєстрації
      const response = await fetch('/api/athlete-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Перенаправляємо на сторінку успіху або профіль
        setTimeout(() => {
          router.push('/athlete-panel?registered=true');
        }, 2000);
      } else {
        if (result.error === 'Користувач з такою поштою вже зареєстрований як спортсмен') {
          setErrors(['Ви вже зареєстровані як спортсмен з цією електронною поштою']);
        } else {
          setErrors([result.error || 'Помилка при реєстрації']);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(['Помилка з\'єднання. Спробуйте пізніше.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Очищаємо помилки при зміні даних
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const benefits = [
    {
      icon: Trophy,
      title: "Участь у змаганнях",
      description: "Доступ до всіх офіційних змагань з спортивної аеробіки та фітнесу в Україні"
    },
    {
      icon: Calendar,
      title: "Календар подій",
      description: "Актуальна інформація про майбутні змагання, семінари та тренувальні збори"
    },
    {
      icon: Award,
      title: "Сертифікація",
      description: "Офіційні документи про участь та досягнення у змаганнях"
    },
    {
      icon: Users,
      title: "Спільнота",
      description: "Зв'язок з іншими спортсменами, тренерами та клубами"
    }
  ];

  const requirements = [
    "Вік від 6 років (з дозволу батьків для неповнолітніх)",
    "Медична довідка про відсутність протипоказань",
    "Страховий поліс спортсмена",
    "Згода на обробку персональних даних",
    "Оплата членського внеску (за потреби)"
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-6 bg-green-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Реєстрацію завершено!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Ваша заявка на членство як спортсмен успішно подана.
              Незабаром ви отримаєте підтвердження на електронну пошту.
            </p>
            <Button onClick={() => router.push('/athlete-panel')} size="lg">
              Перейти до особистого кабінету
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
        {/* Хлібні крихти */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Головна</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/membership" className="text-gray-700 hover:text-blue-600">Членство</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Реєстрація спортсмена</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 mx-auto mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Реєстрація спортсмена
            </h1>
            <p className="text-lg text-gray-600">
              Заповніть форму для отримання офіційного статусу спортсмена ФУСАФ
            </p>
          </div>

          {/* Помилки */}
          {errors.length > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="font-medium text-red-800 mb-2">Помилки у формі:</div>
                <ul className="list-disc list-inside space-y-1 text-red-700">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

              {/* Особисті дані */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Особисті дані
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Ім'я *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Введіть ваше ім'я"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Прізвище *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Введіть ваше прізвище"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Дата народження *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Стать *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть стать" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Чоловіча</SelectItem>
                          <SelectItem value="female">Жіноча</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Контактна інформація */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-green-600" />
                    Контактна інформація
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+380 XX XXX XX XX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Місто *</Label>
                      <Input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Київ"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Адреса</Label>
                      <Input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Вулиця, будинок, квартира"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Спортивна інформація */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-purple-600" />
                    Спортивна інформація
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">Досвід у спорті *</Label>
                      <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть досвід" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Початківець (менше 1 року)</SelectItem>
                          <SelectItem value="amateur">Аматор (1-3 роки)</SelectItem>
                          <SelectItem value="intermediate">Середній рівень (3-5 років)</SelectItem>
                          <SelectItem value="advanced">Просунутий (5+ років)</SelectItem>
                          <SelectItem value="professional">Професіонал</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Категорія *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть категорію" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="children">Діти (6-11 років)</SelectItem>
                          <SelectItem value="junior">Юніори (12-17 років)</SelectItem>
                          <SelectItem value="senior">Дорослі (18+ років)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="previousClub">Попередній клуб (якщо був)</Label>
                    <Input
                      id="previousClub"
                      type="text"
                      value={formData.previousClub}
                      onChange={(e) => handleInputChange('previousClub', e.target.value)}
                      placeholder="Назва попереднього спортивного клубу"
                    />
                  </div>

                  <div>
                    <Label htmlFor="achievements">Досягнення та нагороди</Label>
                    <Textarea
                      id="achievements"
                      value={formData.achievements}
                      onChange={(e) => handleInputChange('achievements', e.target.value)}
                      placeholder="Опишіть ваші спортивні досягнення, участь у змаганнях, отримані нагороди..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Контакт екстреної допомоги */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-600" />
                    Контакт екстреної допомоги
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="emergencyContactName">Повне ім'я *</Label>
                      <Input
                        id="emergencyContactName"
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                        placeholder="Ім'я та прізвище"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactPhone">Телефон *</Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                        placeholder="+380 XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactRelation">Ступінь спорідненості *</Label>
                      <Select value={formData.emergencyContactRelation} onValueChange={(value) => handleInputChange('emergencyContactRelation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Батько/Мати</SelectItem>
                          <SelectItem value="spouse">Чоловік/Дружина</SelectItem>
                          <SelectItem value="sibling">Брат/Сестра</SelectItem>
                          <SelectItem value="relative">Інший родич</SelectItem>
                          <SelectItem value="friend">Друг/Подруга</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Медична інформація */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-orange-600" />
                    Медична інформація
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasMedicalClearance"
                      checked={formData.hasMedicalClearance}
                      onCheckedChange={(checked) => handleInputChange('hasMedicalClearance', checked as boolean)}
                    />
                    <Label htmlFor="hasMedicalClearance">
                      Маю медичну довідку про відсутність протипоказань до занять спортом
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="medicalConditions">Медичні особливості (за потреби)</Label>
                    <Textarea
                      id="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                      placeholder="Вкажіть будь-які медичні особливості, алергії або обмеження, про які повинні знати організатори..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Згоди */}
              <Card>
                <CardHeader>
                  <CardTitle>Згоди та підтвердження</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="dataProcessingConsent"
                        checked={formData.dataProcessingConsent}
                        onCheckedChange={(checked) => handleInputChange('dataProcessingConsent', checked as boolean)}
                      />
                      <Label htmlFor="dataProcessingConsent" className="text-sm leading-relaxed">
                        Я надаю згоду на обробку моїх персональних даних відповідно до
                        <Link href="/privacy" className="text-blue-600 hover:underline ml-1">Політики конфіденційності</Link> *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="rulesAcceptance"
                        checked={formData.rulesAcceptance}
                        onCheckedChange={(checked) => handleInputChange('rulesAcceptance', checked as boolean)}
                      />
                      <Label htmlFor="rulesAcceptance" className="text-sm leading-relaxed">
                        Я приймаю
                        <Link href="/rules" className="text-blue-600 hover:underline mx-1">Правила та положення ФУСАФ</Link>
                        та зобов'язуюсь їх дотримуватися *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="photoConsent"
                        checked={formData.photoConsent}
                        onCheckedChange={(checked) => handleInputChange('photoConsent', checked as boolean)}
                      />
                      <Label htmlFor="photoConsent" className="text-sm leading-relaxed">
                        Я надаю згоду на фото- та відеозйомку під час змагань та використання матеріалів
                        у промоційних цілях федерації
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Кнопка подачі */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? (
                    <>Реєструємо...</>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Подати заявку на членство
                    </>
                  )}
                </Button>
              </div>
            </form>

          {/* Переваги та вимоги */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-600" />
                  Переваги членства
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{benefit.title}</div>
                          <div className="text-xs text-gray-600">{benefit.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Вимоги для членства
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
