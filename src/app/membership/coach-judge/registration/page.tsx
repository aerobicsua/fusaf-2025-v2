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
import {
  GraduationCap,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Trophy,
  CheckCircle,
  UserPlus,
  AlertTriangle,
  Calendar,
  FileText,
  Target
} from "lucide-react";

interface CoachRegistrationData {
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

  // Професійна інформація
  education: string;
  specialization: string;
  experience: string;
  currentPosition: string;
  workPlace: string;
  certifications: string;
  achievements: string;

  // Тренерська/суддівська діяльність
  coachingExperience: string;
  judgingExperience: string;
  preferredRole: string;
  languageSkills: string;

  // Контакт екстреної допомоги
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;

  // Згоди
  dataProcessingConsent: boolean;
  rulesAcceptance: boolean;
  ethicsCodeAcceptance: boolean;
  photoConsent: boolean;
}

export default function CoachJudgeRegistrationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<CoachRegistrationData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    education: '',
    specialization: '',
    experience: '',
    currentPosition: '',
    workPlace: '',
    certifications: '',
    achievements: '',
    coachingExperience: '',
    judgingExperience: '',
    preferredRole: '',
    languageSkills: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    dataProcessingConsent: false,
    rulesAcceptance: false,
    ethicsCodeAcceptance: false,
    photoConsent: false
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Оновлюємо email в формі коли сесія завантажується
  useEffect(() => {
    if (session?.user?.email) {
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
    if (!formData.education) newErrors.push('Освіта обов\'язкова');
    if (!formData.specialization) newErrors.push('Спеціалізація обов\'язкова');
    if (!formData.experience) newErrors.push('Досвід у спорті обов\'язковий');
    if (!formData.preferredRole) newErrors.push('Бажана роль обов\'язкова');

    // Перевірка email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push('Введіть коректний email');
    }

    // Контакт екстреної допомоги
    if (!formData.emergencyContactName.trim()) newErrors.push('Ім\'я контакту екстреної допомоги обов\'язкове');
    if (!formData.emergencyContactPhone.trim()) newErrors.push('Телефон контакту екстреної допомоги обов\'язковий');
    if (!formData.emergencyContactRelation) newErrors.push('Ступінь спорідненості обов\'язковий');

    // Згоди
    if (!formData.dataProcessingConsent) newErrors.push('Згода на обробку персональних даних обов\'язкова');
    if (!formData.rulesAcceptance) newErrors.push('Прийняття правил федерації обов\'язкове');
    if (!formData.ethicsCodeAcceptance) newErrors.push('Прийняття етичного кодексу обов\'язкове');

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Перевіряємо авторизацію при відправці форми
    if (!session) {
      router.push('/auth/signin?redirect=' + encodeURIComponent('/membership/coach-judge/registration'));
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
      const response = await fetch('/api/coach-judge-registration', {
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
        setTimeout(() => {
          router.push('/coach-judge-panel?registered=true');
        }, 2000);
      } else {
        setErrors([result.error || 'Помилка при реєстрації']);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(['Помилка з\'єднання. Спробуйте пізніше.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CoachRegistrationData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

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
              Заявку подано!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Ваша заявка на статус тренера/судді успішно подана.
              Після розгляду адміністратором ви отримаєте повідомлення на електронну пошту.
            </p>
            <Button onClick={() => router.push('/')} size="lg">
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
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/membership/coach-judge" className="text-gray-700 hover:text-blue-600">Тренер/Суддя</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Реєстрація</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Реєстрація тренера/судді
            </h1>
            <p className="text-lg text-gray-600">
              Заповніть форму для отримання статусу тренера або судді ФУСАФ
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
                  <User className="h-5 w-5 mr-2 text-purple-600" />
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
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
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

            {/* Професійна інформація */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                  Професійна інформація
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education">Освіта *</Label>
                    <Select value={formData.education} onValueChange={(value) => handleInputChange('education', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть рівень освіти" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">Бакалавр</SelectItem>
                        <SelectItem value="master">Магістр</SelectItem>
                        <SelectItem value="phd">Кандидат наук</SelectItem>
                        <SelectItem value="doctor">Доктор наук</SelectItem>
                        <SelectItem value="other">Інше</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="specialization">Спеціалізація *</Label>
                    <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть спеціалізацію" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical_education">Фізичне виховання та спорт</SelectItem>
                        <SelectItem value="sports_aerobics">Спортивна аеробіка</SelectItem>
                        <SelectItem value="fitness">Фітнес</SelectItem>
                        <SelectItem value="gymnastics">Гімнастика</SelectItem>
                        <SelectItem value="other">Інше</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Загальний досвід у спорті *</Label>
                    <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть досвід" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-5">2-5 років</SelectItem>
                        <SelectItem value="5-10">5-10 років</SelectItem>
                        <SelectItem value="10-15">10-15 років</SelectItem>
                        <SelectItem value="15+">Більше 15 років</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currentPosition">Поточна посада</Label>
                    <Input
                      id="currentPosition"
                      type="text"
                      value={formData.currentPosition}
                      onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                      placeholder="Тренер, викладач тощо"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="workPlace">Місце роботи</Label>
                  <Input
                    id="workPlace"
                    type="text"
                    value={formData.workPlace}
                    onChange={(e) => handleInputChange('workPlace', e.target.value)}
                    placeholder="Спортивний клуб, школа, університет тощо"
                  />
                </div>

                <div>
                  <Label htmlFor="certifications">Сертифікати та ліцензії</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    placeholder="Перелічіть ваші сертифікати, ліцензії, курси підвищення кваліфікації..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="achievements">Професійні досягнення</Label>
                  <Textarea
                    id="achievements"
                    value={formData.achievements}
                    onChange={(e) => handleInputChange('achievements', e.target.value)}
                    placeholder="Опишіть ваші професійні досягнення, нагороди, визнання..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Тренерська/суддівська діяльність */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-orange-600" />
                  Тренерська та суддівська діяльність
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferredRole">Бажана роль *</Label>
                  <Select value={formData.preferredRole} onValueChange={(value) => handleInputChange('preferredRole', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть бажану роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coach">Тільки тренер</SelectItem>
                      <SelectItem value="judge">Тільки суддя</SelectItem>
                      <SelectItem value="both">Тренер та суддя</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coachingExperience">Досвід тренерської роботи</Label>
                    <Select value={formData.coachingExperience} onValueChange={(value) => handleInputChange('coachingExperience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть досвід" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Немає досвіду</SelectItem>
                        <SelectItem value="1-2">1-2 роки</SelectItem>
                        <SelectItem value="3-5">3-5 років</SelectItem>
                        <SelectItem value="5-10">5-10 років</SelectItem>
                        <SelectItem value="10+">Більше 10 років</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="judgingExperience">Досвід суддівської роботи</Label>
                    <Select value={formData.judgingExperience} onValueChange={(value) => handleInputChange('judgingExperience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть досвід" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Немає досвіду</SelectItem>
                        <SelectItem value="1-2">1-2 роки</SelectItem>
                        <SelectItem value="3-5">3-5 років</SelectItem>
                        <SelectItem value="5-10">5-10 років</SelectItem>
                        <SelectItem value="10+">Більше 10 років</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="languageSkills">Мовні навички</Label>
                  <Input
                    id="languageSkills"
                    type="text"
                    value={formData.languageSkills}
                    onChange={(e) => handleInputChange('languageSkills', e.target.value)}
                    placeholder="Українська (рідна), Англійська (B2), Російська (C1)..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Контакт екстреної допомоги */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-red-600" />
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
                        <SelectItem value="spouse">Чоловік/Дружина</SelectItem>
                        <SelectItem value="parent">Батько/Мати</SelectItem>
                        <SelectItem value="child">Син/Дочка</SelectItem>
                        <SelectItem value="sibling">Брат/Сестра</SelectItem>
                        <SelectItem value="relative">Інший родич</SelectItem>
                        <SelectItem value="friend">Друг/Подруга</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                      id="ethicsCodeAcceptance"
                      checked={formData.ethicsCodeAcceptance}
                      onCheckedChange={(checked) => handleInputChange('ethicsCodeAcceptance', checked as boolean)}
                    />
                    <Label htmlFor="ethicsCodeAcceptance" className="text-sm leading-relaxed">
                      Я приймаю
                      <Link href="/ethics" className="text-blue-600 hover:underline mx-1">Етичний кодекс тренера/судді</Link>
                      та зобов'язуюсь дотримуватися професійних стандартів *
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
                  <>Обробка заявки...</>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Подати заявку на статус тренера/судді
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
