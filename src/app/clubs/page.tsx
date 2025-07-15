"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Trophy,
  Star,
  Calendar,
  Filter,
  Search,
  Building,
  Award,
  Target,
  CheckCircle2
} from 'lucide-react';

interface Club {
  id: string;
  name: string;
  description: string;
  city: string;
  region: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  athletes: number;
  trainers: number;
  achievements: string[];
  established: number;
  categories: string[];
  rating: number;
  verified: boolean;
  specializations: string[];
  facilities: string[];
  contact_person: {
    name: string;
    position: string;
    phone: string;
  };
}

// Демонстраційні клуби ФУСАФ
const demoClubs: Club[] = [
  {
    id: 'club-1',
    name: 'СК "Грація"',
    description: 'Провідний спортивний клуб України зі спортивної аеробіки. Готуємо чемпіонів міжнародного рівня та популяризуємо спортивну аеробіку серед дітей та молоді.',
    city: 'Київ',
    region: 'Київська область',
    address: 'вул. Спортивна, 15, Київ, 01001',
    phone: '+380 44 123-45-67',
    email: 'info@gracia.kiev.ua',
    website: 'www.gracia.kiev.ua',
    athletes: 85,
    trainers: 8,
    achievements: [
      'Чемпіон України 2024 (групова програма)',
      '3 місце Чемпіонат Європи 2023',
      'Переможець Кубка України 2023-2024',
      '15 спортсменів рівня МС та КМС'
    ],
    established: 2008,
    categories: ['YOUTH', 'JUNIORS', 'SENIORS'],
    rating: 4.9,
    verified: true,
    specializations: ['Групові програми', 'Індивідуальні виступи', 'AERODANCE', 'Підготовка до змагань'],
    facilities: ['2 тренувальні зали', 'Хореографічний зал', 'Тренажерний зал', 'Роздягальні', 'Паркінг'],
    contact_person: {
      name: 'Мельник Сергій Олександрович',
      position: 'Директор клубу',
      phone: '+380 67 123-45-67'
    }
  },
  {
    id: 'club-2',
    name: 'Аеробіка Львів',
    description: 'Сучасний центр спортивної аеробіки та фітнесу у Львові. Розвиваємо талановитих спортсменів та надаємо професійні послуги з фітнес-аеробіки.',
    city: 'Львів',
    region: 'Львівська область',
    address: 'вул. Під Дубом, 7а, Львів, 79000',
    phone: '+380 32 245-67-89',
    email: 'info@aerobika-lviv.ua',
    website: 'www.aerobika-lviv.com.ua',
    athletes: 67,
    trainers: 6,
    achievements: [
      'Віце-чемпіон України 2024 (міксед-пара)',
      'Переможець обласних змагань 2023-2024',
      'Кращий молодіжний клуб Західної України',
      '8 призерів національних змагань'
    ],
    established: 2012,
    categories: ['YOUTH', 'JUNIORS', 'SENIORS', 'ND'],
    rating: 4.7,
    verified: true,
    specializations: ['Пари та тріо', 'Молодіжна аеробіка', 'Фітнес-групи', 'Хореографія'],
    facilities: ['Головний зал 200м²', 'Дитячий зал', 'Хореографічний клас', 'Зал фізпідготовки'],
    contact_person: {
      name: 'Савченко Тетяна Миколаївна',
      position: 'Головний тренер',
      phone: '+380 67 234-56-78'
    }
  },
  {
    id: 'club-3',
    name: 'Фітнес-Динаміка',
    description: 'Спортивний клуб з багаторічною історією, що спеціалізується на підготовці спортсменів високого рівня та розвитку масової фізичної культури.',
    city: 'Дніпро',
    region: 'Дніпропетровська область',
    address: 'пр. Гагаріна, 99, Дніпро, 49000',
    phone: '+380 56 789-12-34',
    email: 'dinamika@dp.ua',
    website: 'www.fitness-dinamika.dp.ua',
    athletes: 92,
    trainers: 10,
    achievements: [
      'Бронзовий призер Чемпіонату Європи 2022',
      'Чемпіон України серед юніорів 2024',
      'Найкращий клуб Східного регіону 2023',
      '12 майстрів спорту'
    ],
    established: 2005,
    categories: ['YOUTH', 'JUNIORS', 'SENIORS'],
    rating: 4.8,
    verified: true,
    specializations: ['Високий спорт', 'Юнацька збірна', 'Індивідуальні програми', 'Спортивна акробатика'],
    facilities: ['3 спеціалізовані зали', 'Акробатичний зал', 'Тренажерна зала', 'Медпункт', 'Кафе'],
    contact_person: {
      name: 'Петренко Олександр Васильович',
      position: 'Президент клубу',
      phone: '+380 67 345-67-89'
    }
  },
  {
    id: 'club-4',
    name: 'Ритм',
    description: 'Молодий та перспективний клуб, що активно розвиває дитячо-юнацьку спортивну аеробіку та залучає нових вихованців до здорового способу життя.',
    city: 'Харків',
    region: 'Харківська область',
    address: 'вул. Пушкінська, 42, Харків, 61000',
    phone: '+380 57 456-78-90',
    email: 'ritm.kharkiv@gmail.com',
    athletes: 54,
    trainers: 5,
    achievements: [
      'Призери молодіжних змагань 2024',
      'Кращий дебютант року 2023',
      '5 кандидатів у майстри спорту',
      'Активний розвиток дитячих груп'
    ],
    established: 2018,
    categories: ['ND', 'YOUTH', 'JUNIORS'],
    rating: 4.5,
    verified: true,
    specializations: ['Дитяча аеробіка', 'Групові програми', 'Базова підготовка', 'Оздоровчі програми'],
    facilities: ['Основний зал', 'Дитяча ігрова зона', 'Роздягальні', 'Чекова кімната'],
    contact_person: {
      name: 'Коваленко Марина Сергіївна',
      position: 'Старший тренер',
      phone: '+380 66 456-78-90'
    }
  },
  {
    id: 'club-5',
    name: 'Олімп',
    description: 'Спортивний клуб з міцними традиціями та сучасним підходом до тренувального процесу. Виховуємо не лише спортсменів, а й справжніх особистостей.',
    city: 'Одеса',
    region: 'Одеська область',
    address: 'вул. Дерибасівська, 27, Одеса, 65000',
    phone: '+380 48 567-89-01',
    email: 'olimp.odessa@sport.ua',
    website: 'www.olimp-aerobic.od.ua',
    athletes: 73,
    trainers: 7,
    achievements: [
      'Срібний призер Кубка України 2024',
      'Чемпіон Південного регіону 2023-2024',
      'Найкращий клуб з естетичної підготовки',
      '9 спортсменів збірної України'
    ],
    established: 2010,
    categories: ['YOUTH', 'JUNIORS', 'SENIORS'],
    rating: 4.6,
    verified: true,
    specializations: ['Естетична підготовка', 'Міксед-пари', 'Хореографія', 'Сценічна майстерність'],
    facilities: ['Зал з професійним покриттям', 'Хореографічна студія', 'Костюмерна', 'Зал ОФП'],
    contact_person: {
      name: 'Іваненко Олена Петрівна',
      position: 'Керівник клубу',
      phone: '+380 67 567-89-01'
    }
  },
  {
    id: 'club-6',
    name: 'Енергія',
    description: 'Спортивно-оздоровчий комплекс, що поєднує підготовку професійних спортсменів з програмами фітнес-аеробіки для всіх вікових груп.',
    city: 'Запоріжжя',
    region: 'Запорізька область',
    address: 'пр. Соборний, 156, Запоріжжя, 69000',
    phone: '+380 61 678-90-12',
    email: 'energia.zp@ukr.net',
    athletes: 61,
    trainers: 6,
    achievements: [
      'Призери національних змагань 2024',
      'Розвиток масової аеробіки в регіоні',
      'Організатори регіональних змагань',
      '6 кандидатів у майстри спорту'
    ],
    established: 2015,
    categories: ['ND', 'YOUTH', 'JUNIORS', 'SENIORS'],
    rating: 4.4,
    verified: true,
    specializations: ['Масова аеробіка', 'Фітнес-програми', 'Дорослі групи', 'Реабілітація'],
    facilities: ['2 тренувальні зали', 'Фітнес-зона', 'Сауна', 'Масажний кабінет', 'Буфет'],
    contact_person: {
      name: 'Морозов Дмитро Іванович',
      position: 'Директор СОК',
      phone: '+380 66 678-90-12'
    }
  },
  {
    id: 'club-7',
    name: 'Стиль',
    description: 'Елітний клуб спортивної аеробіки з індивідуальним підходом до кожного спортсмена та використанням інноваційних методик тренування.',
    city: 'Полтава',
    region: 'Полтавська область',
    address: 'вул. Європейська, 8, Полтава, 36000',
    phone: '+380 53 789-01-23',
    email: 'style.poltava@gmail.com',
    athletes: 38,
    trainers: 4,
    achievements: [
      'Індивідуальний підхід до кожного спортсмена',
      'Використання сучасних методик',
      'Призери регіональних змагань',
      'Високий рівень технічної підготовки'
    ],
    established: 2020,
    categories: ['YOUTH', 'JUNIORS'],
    rating: 4.3,
    verified: false,
    specializations: ['Індивідуальна робота', 'Технічна підготовка', 'Хореографія', 'Конкурсні програми'],
    facilities: ['Зал з дзеркалами', 'Хореографічний клас', 'Роздягальні'],
    contact_person: {
      name: 'Стеценко Аліна Володимирівна',
      position: 'Головний тренер',
      phone: '+380 95 789-01-23'
    }
  },
  {
    id: 'club-8',
    name: 'Фенікс',
    description: 'Новий клуб з амбітними цілями та молодою командою тренерів. Спеціалізуємося на роботі з дітьми та підлітками, створюючи міцну базу для майбутніх чемпіонів.',
    city: 'Вінниця',
    region: 'Вінницька область',
    address: 'вул. Театральна, 25, Вінниця, 21000',
    phone: '+380 43 890-12-34',
    email: 'feniks.vn@sport.gov.ua',
    athletes: 45,
    trainers: 4,
    achievements: [
      'Молодий клуб з великим потенціалом',
      'Активна робота з дітьми',
      'Перші призери обласних змагань',
      'Інноваційні підходи до навчання'
    ],
    established: 2022,
    categories: ['ND', 'YOUTH'],
    rating: 4.1,
    verified: false,
    specializations: ['Дитяча аеробіка', 'Початкова підготовка', 'Ігрові методики', 'Розвиваючі програми'],
    facilities: ['Дитячий зал', 'Ігрова зона', 'Роздягальні', 'Зона для батьків'],
    contact_person: {
      name: 'Гончарук Віталій Олегович',
      position: 'Засновник клубу',
      phone: '+380 97 890-12-34'
    }
  }
];

const regions = [
  'Всі регіони',
  'Київська область',
  'Львівська область',
  'Дніпропетровська область',
  'Харківська область',
  'Одеська область',
  'Запорізька область',
  'Полтавська область',
  'Вінницька область'
];

export default function ClubsPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('Всі регіони');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'athletes' | 'established'>('rating');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredClubs = demoClubs
    .filter(club => {
      const regionMatch = selectedRegion === 'Всі регіони' || club.region === selectedRegion;
      const categoryMatch = selectedCategory === 'all' || club.categories.includes(selectedCategory);
      const searchMatch = searchQuery === '' ||
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase());
      const verifiedMatch = !verifiedOnly || club.verified;
      return regionMatch && categoryMatch && searchMatch && verifiedMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'athletes':
          return b.athletes - a.athletes;
        case 'established':
          return b.established - a.established;
        case 'rating':
        default:
          return b.rating - a.rating;
      }
    });

  const totalAthletes = demoClubs.reduce((sum, club) => sum + club.athletes, 0);
  const totalTrainers = demoClubs.reduce((sum, club) => sum + club.trainers, 0);
  const verifiedClubs = demoClubs.filter(club => club.verified).length;

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏢 Клуби та організації ФУСАФ
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мережа спортивних клубів та організацій зі спортивної аеробіки по всій Україні
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{demoClubs.length}</div>
              <div className="text-sm text-gray-600">Активних клубів</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{totalAthletes}</div>
              <div className="text-sm text-gray-600">Спортсменів</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{totalTrainers}</div>
              <div className="text-sm text-gray-600">Тренерів</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{verifiedClubs}</div>
              <div className="text-sm text-gray-600">Верифікованих</div>
            </CardContent>
          </Card>
        </div>

        {/* Фільтри та пошук */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Пошук:</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Назва клубу, місто..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Регіон:</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Категорія:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="all">Всі категорії</option>
                  <option value="ND">ND (6-11 років)</option>
                  <option value="YOUTH">YOUTH (12-14 років)</option>
                  <option value="JUNIORS">JUNIORS (15-17 років)</option>
                  <option value="SENIORS">SENIORS (18+ років)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Сортування:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="rating">За рейтингом</option>
                  <option value="name">За назвою</option>
                  <option value="athletes">За кількістю спортсменів</option>
                  <option value="established">За роком заснування</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Тільки верифіковані клуби</span>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Список клубів */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClubs.length === 0 ? (
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Клубів не знайдено</h3>
                  <p className="text-gray-600">
                    Спробуйте змінити критерії пошуку або фільтри
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredClubs.map((club) => (
              <Card key={club.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-xl">{club.name}</CardTitle>
                        {club.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Верифіковано
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {club.city}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          з {club.established} року
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mb-3">
                        {getRatingStars(club.rating)}
                        <span className="text-sm text-gray-600 ml-2">{club.rating}</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {club.description}
                  </p>

                  {/* Статистика клубу */}
                  <div className="grid grid-cols-2 gap-4 py-3 bg-gray-50 rounded-lg px-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{club.athletes}</div>
                      <div className="text-xs text-gray-600">Спортсменів</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{club.trainers}</div>
                      <div className="text-xs text-gray-600">Тренерів</div>
                    </div>
                  </div>

                  {/* Категорії */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Вікові категорії:</div>
                    <div className="flex flex-wrap gap-2">
                      {club.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Спеціалізації */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Спеціалізації:</div>
                    <div className="flex flex-wrap gap-2">
                      {club.specializations.slice(0, 3).map((spec, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {club.specializations.length > 3 && (
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          +{club.specializations.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Досягнення */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Ключові досягнення:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {club.achievements.slice(0, 2).map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <Trophy className="h-3 w-3 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                      {club.achievements.length > 2 && (
                        <li className="text-xs text-gray-500 italic">
                          і ще {club.achievements.length - 2} досягнень...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Контактна інформація */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">{club.address}</span>
                      </div>
                      {club.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-600">{club.phone}</span>
                        </div>
                      )}
                      {club.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-600">{club.email}</span>
                        </div>
                      )}
                      {club.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-600">{club.website}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Контактна особа */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Контактна особа:</div>
                    <div className="text-sm text-blue-700">{club.contact_person.name}</div>
                    <div className="text-xs text-blue-600">{club.contact_person.position}</div>
                    <div className="text-xs text-blue-600">{club.contact_person.phone}</div>
                  </div>

                  {/* Дії */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Детальніше
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Зв'язатися
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Реєстрація нового клубу */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <Building className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Зареєструйте свій клуб в ФУСАФ</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Долучайтеся до офіційної мережі клубів спортивної аеробіки України.
              Отримайте доступ до змагань, освітніх програм та підтримки федерації.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                📋 Вимоги до реєстрації
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                ✍️ Подати заявку
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Реєстрація клубу проходить протягом 7-14 робочих днів після подання всіх документів
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
