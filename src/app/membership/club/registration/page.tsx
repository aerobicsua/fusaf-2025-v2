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
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Trophy,
  CheckCircle,
  UserPlus,
  AlertTriangle,
  Globe,
  Users,
  Calendar,
  Shield
} from "lucide-react";

interface ClubRegistrationData {
  // Інформація про організацію
  organizationType: string;
  clubName: string;
  legalName: string;
  registrationNumber: string;
  taxNumber: string;
  foundingDate: string;

  // Контактна інформація організації
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  region: string;

  // Інформація про керівника
  directorFirstName: string;
  directorLastName: string;
  directorPosition: string;
  directorPhone: string;
  directorEmail: string;

  // Спортивна діяльність
  sportTypes: string;
  establishedYear: string;
  membersCount: string;
  ageGroups: string;
  facilities: string;
  achievements: string;

  // Тренерський склад
  coachesCount: string;
  qualifiedCoachesCount: string;
  headCoachName: string;
  headCoachQualification: string;

  // Планування та цілі
  goals: string;
  plannedActivities: string;
  cooperationInterests: string;

  // Згоди
  dataProcessingConsent: boolean;
  rulesAcceptance: boolean;
  ethicsCodeAcceptance: boolean;
  mediaConsent: boolean;
}

export default function ClubRegistrationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<ClubRegistrationData>({
    organizationType: '',
    clubName: '',
    legalName: '',
    registrationNumber: '',
    taxNumber: '',
    foundingDate: '',
    email: session?.user?.email || '',
    phone: '',
    website: '',
    address: '',
    city: '',
    region: '',
    directorFirstName: '',
    directorLastName: '',
    directorPosition: '',
    directorPhone: '',
    directorEmail: session?.user?.email || '',
    sportTypes: '',
    establishedYear: '',
    membersCount: '',
    ageGroups: '',
    facilities: '',
    achievements: '',
    coachesCount: '',
    qualifiedCoachesCount: '',
    headCoachName: '',
    headCoachQualification: '',
    goals: '',
    plannedActivities: '',
    cooperationInterests: '',
    dataProcessingConsent: false,
    rulesAcceptance: false,
    ethicsCodeAcceptance: false,
    mediaConsent: false
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Оновлюємо email в формі коли сесія завантажується
  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({
        ...prev,
        email: session.user.email || '',
        directorEmail: session.user.email || ''
      }));
    }
  }, [session]);

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    // Основні поля
    if (!formData.organizationType) newErrors.push('Тип організації обов\'язковий');
    if (!formData.clubName.trim()) newErrors.push('Назва клубу обов\'язкова');
    if (!formData.legalName.trim()) newErrors.push('Юридична назва обов\'язкова');
    if (!formData.email.trim()) newErrors.push('Email обов\'язковий');
    if (!formData.phone.trim()) newErrors.push('Телефон обов\'язковий');
    if (!formData.city.trim()) newErrors.push('Місто обов\'язкове');
    if (!formData.address.trim()) newErrors.push('Адреса обов\'язкова');

    // Інформація про керівника
    if (!formData.directorFirstName.trim()) newErrors.push('Ім\'я керівника обов\'язкове');
    if (!formData.directorLastName.trim()) newErrors.push('Прізвище керівника обов\'язкове');
    if (!formData.directorPosition.trim()) newErrors.push('Посада керівника обов\'язкова');
    if (!formData.directorPhone.trim()) newErrors.push('Телефон керівника обов\'язковий');
    if (!formData.directorEmail.trim()) newErrors.push('Email керівника обов\'язковий');

    // Спортивна діяльність
    if (!formData.sportTypes) newErrors.push('Види спорту обов\'язкові');
    if (!formData.establishedYear) newErrors.push('Рік заснування обов\'язковий');
    if (!formData.membersCount) newErrors.push('Кількість членів обов\'язкова');

    // Перевірка email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push('Введіть коректний email організації');
    }
    if (formData.directorEmail && !/\S+@\S+\.\S+/.test(formData.directorEmail)) {
      newErrors.push('Введіть коректний email керівника');
    }

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
      router.push('/auth/signin?redirect=' + encodeURIComponent('/membership/club/registration'));
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
      const response = await fetch('/api/club-registration', {
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
          router.push('/club-management?registered=true');
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

  const handleInputChange = (field: keyof ClubRegistrationData, value: string | boolean) => {
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
              Ваша заявка на реєстрацію клубу успішно подана.
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
                <Link href="/membership/club" className="text-gray-700 hover:text-blue-600">Клуб</Link>
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
            <div className="p-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-4">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Реєстрація клубу
            </h1>
            <p className="text-lg text-gray-600">
              Заповніть форму для реєстрації вашого клубу в ФУСАФ
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
            {/* Загальна інформація про організацію */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-green-600" />
                  Загальна інформація про організацію
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="organizationType">Тип організації *</Label>
                  <Select value={formData.organizationType} onValueChange={(value) => handleInputChange('organizationType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть тип організації" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sport_club">Спортивний клуб</SelectItem>
                      <SelectItem value="ngo">Громадська організація</SelectItem>
                      <SelectItem value="school_section">Секція при школі</SelectItem>
                      <SelectItem value="university_section">Секція при ВНЗ</SelectItem>
                      <SelectItem value="academy">Спортивна академія</SelectItem>
                      <SelectItem value="other">Інше</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clubName">Назва клубу/організації *</Label>
                    <Input
                      id="clubName"
                      type="text"
                      value={formData.clubName}
                      onChange={(e) => handleInputChange('clubName', e.target.value)}
                      placeholder="СК 'Аеробіка Київ'"
                    />
                  </div>
                  <div>
                    <Label htmlFor="legalName">Повна юридична назва *</Label>
                    <Input
                      id="legalName"
                      type="text"
                      value={formData.legalName}
                      onChange={(e) => handleInputChange('legalName', e.target.value)}
                      placeholder="Спортивний клуб 'Аеробіка Київ'"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="registrationNumber">Реєстраційний номер</Label>
                    <Input
                      id="registrationNumber"
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      placeholder="123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxNumber">Податковий номер</Label>
                    <Input
                      id="taxNumber"
                      type="text"
                      value={formData.taxNumber}
                      onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                      placeholder="12345678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="foundingDate">Дата реєстрації</Label>
                    <Input
                      id="foundingDate"
                      type="date"
                      value={formData.foundingDate}
                      onChange={(e) => handleInputChange('foundingDate', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Контактна інформація організації */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Контактна інформація організації
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="info@club.com"
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
                  <div>
                    <Label htmlFor="website">Веб-сайт</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://club.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Label htmlFor="region">Область</Label>
                    <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть область" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kyiv">Київська</SelectItem>
                        <SelectItem value="kharkiv">Харківська</SelectItem>
                        <SelectItem value="odesa">Одеська</SelectItem>
                        <SelectItem value="dnipro">Дніпропетровська</SelectItem>
                        <SelectItem value="lviv">Львівська</SelectItem>
                        <SelectItem value="other">Інша</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <Label htmlFor="address">Адреса *</Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Вулиця, будинок"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Інформація про керівника */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-600" />
                  Інформація про керівника
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="directorFirstName">Ім'я керівника *</Label>
                    <Input
                      id="directorFirstName"
                      type="text"
                      value={formData.directorFirstName}
                      onChange={(e) => handleInputChange('directorFirstName', e.target.value)}
                      placeholder="Олександр"
                    />
                  </div>
                  <div>
                    <Label htmlFor="directorLastName">Прізвище керівника *</Label>
                    <Input
                      id="directorLastName"
                      type="text"
                      value={formData.directorLastName}
                      onChange={(e) => handleInputChange('directorLastName', e.target.value)}
                      placeholder="Петренко"
                    />
                  </div>
                  <div>
                    <Label htmlFor="directorPosition">Посада *</Label>
                    <Input
                      id="directorPosition"
                      type="text"
                      value={formData.directorPosition}
                      onChange={(e) => handleInputChange('directorPosition', e.target.value)}
                      placeholder="Директор, Президент"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="directorPhone">Телефон керівника *</Label>
                    <Input
                      id="directorPhone"
                      type="tel"
                      value={formData.directorPhone}
                      onChange={(e) => handleInputChange('directorPhone', e.target.value)}
                      placeholder="+380 XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="directorEmail">Email керівника *</Label>
                    <Input
                      id="directorEmail"
                      type="email"
                      value={formData.directorEmail}
                      onChange={(e) => handleInputChange('directorEmail', e.target.value)}
                      placeholder="director@club.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Спортивна діяльність */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-orange-600" />
                  Спортивна діяльність
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sportTypes">Види спорту *</Label>
                    <Select value={formData.sportTypes} onValueChange={(value) => handleInputChange('sportTypes', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть напрямок" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aerobics">Спортивна аеробіка</SelectItem>
                        <SelectItem value="fitness">Фітнес</SelectItem>
                        <SelectItem value="both">Аеробіка та фітнес</SelectItem>
                        <SelectItem value="gymnastics">Художня гімнастика</SelectItem>
                        <SelectItem value="mixed">Змішані напрямки</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="establishedYear">Рік заснування спортивної діяльності *</Label>
                    <Select value={formData.establishedYear} onValueChange={(value) => handleInputChange('establishedYear', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Рік" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="membersCount">Кількість членів клубу *</Label>
                    <Select value={formData.membersCount} onValueChange={(value) => handleInputChange('membersCount', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Кількість" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 осіб</SelectItem>
                        <SelectItem value="11-25">11-25 осіб</SelectItem>
                        <SelectItem value="26-50">26-50 осіб</SelectItem>
                        <SelectItem value="51-100">51-100 осіб</SelectItem>
                        <SelectItem value="100+">Більше 100 осіб</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ageGroups">Вікові групи</Label>
                  <Input
                    id="ageGroups"
                    type="text"
                    value={formData.ageGroups}
                    onChange={(e) => handleInputChange('ageGroups', e.target.value)}
                    placeholder="6-12 років, 13-18 років, дорослі"
                  />
                </div>

                <div>
                  <Label htmlFor="facilities">Опис матеріально-технічної бази</Label>
                  <Textarea
                    id="facilities"
                    value={formData.facilities}
                    onChange={(e) => handleInputChange('facilities', e.target.value)}
                    placeholder="Опишіть ваші спортивні споруди, обладнання, зали..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="achievements">Досягнення клубу</Label>
                  <Textarea
                    id="achievements"
                    value={formData.achievements}
                    onChange={(e) => handleInputChange('achievements', e.target.value)}
                    placeholder="Основні досягнення, нагороди, успіхи спортсменів..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Тренерський склад */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-600" />
                  Тренерський склад
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coachesCount">Загальна кількість тренерів</Label>
                    <Select value={formData.coachesCount} onValueChange={(value) => handleInputChange('coachesCount', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Кількість" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 тренер</SelectItem>
                        <SelectItem value="2-3">2-3 тренери</SelectItem>
                        <SelectItem value="4-5">4-5 тренерів</SelectItem>
                        <SelectItem value="6+">6 і більше</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="qualifiedCoachesCount">З них кваліфікованих</Label>
                    <Select value={formData.qualifiedCoachesCount} onValueChange={(value) => handleInputChange('qualifiedCoachesCount', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Кількість" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Немає</SelectItem>
                        <SelectItem value="1">1 тренер</SelectItem>
                        <SelectItem value="2-3">2-3 тренери</SelectItem>
                        <SelectItem value="4+">4 і більше</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="headCoachName">Головний тренер</Label>
                    <Input
                      id="headCoachName"
                      type="text"
                      value={formData.headCoachName}
                      onChange={(e) => handleInputChange('headCoachName', e.target.value)}
                      placeholder="Ім'я та прізвище"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headCoachQualification">Кваліфікація головного тренера</Label>
                    <Input
                      id="headCoachQualification"
                      type="text"
                      value={formData.headCoachQualification}
                      onChange={(e) => handleInputChange('headCoachQualification', e.target.value)}
                      placeholder="Категорія, сертифікати"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Планування та цілі */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-teal-600" />
                  Планування та цілі
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="goals">Цілі та завдання клубу</Label>
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    placeholder="Опишіть основні цілі та завдання вашого клубу..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="plannedActivities">Планована діяльність</Label>
                  <Textarea
                    id="plannedActivities"
                    value={formData.plannedActivities}
                    onChange={(e) => handleInputChange('plannedActivities', e.target.value)}
                    placeholder="Змагання, семінари, тренувальні збори, які ви плануєте..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="cooperationInterests">Інтереси у співпраці з ФУСАФ</Label>
                  <Textarea
                    id="cooperationInterests"
                    value={formData.cooperationInterests}
                    onChange={(e) => handleInputChange('cooperationInterests', e.target.value)}
                    placeholder="Що ви очікуєте від членства в федерації..."
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
                      Я надаю згоду на обробку персональних даних відповідно до
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
                      <Link href="/ethics" className="text-blue-600 hover:underline mx-1">Етичний кодекс</Link>
                      та зобов'язуюсь дотримуватися професійних стандартів *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="mediaConsent"
                      checked={formData.mediaConsent}
                      onCheckedChange={(checked) => handleInputChange('mediaConsent', checked as boolean)}
                    />
                    <Label htmlFor="mediaConsent" className="text-sm leading-relaxed">
                      Я надаю згоду на використання інформації про клуб у промоційних матеріалах ФУСАФ
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
                    <Building className="h-5 w-5 mr-2" />
                    Подати заявку на реєстрацію клубу
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
