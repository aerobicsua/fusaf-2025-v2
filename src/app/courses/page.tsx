"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Clock,
  MapPin,
  Users,
  Star,
  Calendar,
  Award,
  GraduationCap,
  PlayCircle,
  CheckCircle
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  type: "basic" | "advanced" | "judge" | "specialist";
  level: "beginner" | "intermediate" | "advanced" | "expert";
  duration: number; // в годинах
  price: number;
  startDate: string;
  endDate: string;
  location: string;
  instructor: string;
  maxParticipants: number;
  enrolled: number;
  prerequisites?: string[];
  certificate: string;
  imageUrl: string;
  features: string[];
  schedule: {
    day: string;
    time: string;
    topics: string[];
  }[];
  status: 'open' | 'full' | 'upcoming' | 'completed';
}

// Демонстраційні курси ФУСАФ
const demoCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Базовий курс тренера зі спортивної аеробіки',
    description: 'Комплексний курс для початківців тренерів, що охоплює основи спортивної аеробіки, методику навчання та організацію тренувального процесу.',
    type: 'basic',
    level: 'beginner',
    duration: 40,
    price: 2500,
    startDate: '2025-02-15',
    endDate: '2025-02-22',
    location: 'Київ, НПУ імені Драгоманова',
    instructor: 'Мороз Олена Василівна (Заслужений тренер України)',
    maxParticipants: 25,
    enrolled: 18,
    certificate: 'Сертифікат тренера зі спортивної аеробіки (початковий рівень)',
    imageUrl: '/images/course-basic.jpg',
    features: [
      'Теоретичні основи спортивної аеробіки',
      'Методика викладання базових елементів',
      'Побудова тренувального процесу',
      'Психологія спорту',
      'Травмобезпека та профілактика'
    ],
    schedule: [
      {
        day: 'День 1-2',
        time: '09:00-17:00',
        topics: ['Історія та розвиток спортивної аеробіки', 'Базова техніка', 'Загальна фізична підготовка']
      },
      {
        day: 'День 3-4',
        time: '09:00-17:00',
        topics: ['Методика навчання', 'Спеціальна фізична підготовка', 'Хореографія']
      },
      {
        day: 'День 5-6',
        time: '09:00-17:00',
        topics: ['Композиція програм', 'Суддівство', 'Психологічна підготовка']
      },
      {
        day: 'День 7-8',
        time: '09:00-17:00',
        topics: ['Практичні заняття', 'Екзаменація', 'Вручення сертифікатів']
      }
    ],
    status: 'open'
  },
  {
    id: 'course-2',
    title: 'Курс підготовки суддів національної категорії',
    description: 'Спеціалізований курс для підготовки суддів зі спортивної аеробіки. Вивчення правил змагань, системи оцінювання та практика суддівства.',
    type: 'judge',
    level: 'intermediate',
    duration: 32,
    price: 3000,
    startDate: '2025-03-01',
    endDate: '2025-03-08',
    location: 'Львів, ЛДУФК',
    instructor: 'Лисенко Віктор Петрович (Суддя FIG)',
    maxParticipants: 20,
    enrolled: 15,
    prerequisites: ['Досвід тренерської роботи від 2 років', 'Базові знання правил спортивної аеробіки'],
    certificate: 'Сертифікат судді національної категорії',
    imageUrl: '/images/course-judge.jpg',
    features: [
      'Актуальні правила FIG',
      'Система оцінювання виконання',
      'Технічне та артистичне суддівство',
      'Практика на реальних змаганнях',
      'Міжнародні стандарти'
    ],
    schedule: [
      {
        day: 'День 1-2',
        time: '09:00-17:00',
        topics: ['Правила змагань FIG 2022-2024', 'Система оцінювання', 'Типи елементів']
      },
      {
        day: 'День 3-4',
        time: '09:00-17:00',
        topics: ['Технічне суддівство', 'Оцінка складності', 'Штрафи та збавки']
      },
      {
        day: 'День 5-6',
        time: '09:00-17:00',
        topics: ['Артистичне суддівство', 'Хореографія та презентація', 'Музичність']
      },
      {
        day: 'День 7-8',
        time: '09:00-17:00',
        topics: ['Практичне суддівство', 'Калібрування оцінок', 'Екзамен та атестація']
      }
    ],
    status: 'open'
  },
  {
    id: 'course-3',
    title: 'Продвинутий курс: Спортивна аеробіка високого рівня',
    description: 'Курс для досвідчених тренерів, що працюють з спортсменами високого рівня. Складні елементи, інноваційні методики та підготовка до міжнародних змагань.',
    type: 'advanced',
    level: 'expert',
    duration: 48,
    price: 4500,
    startDate: '2025-04-10',
    endDate: '2025-04-19',
    location: 'Дніпро, ДДАФК',
    instructor: 'Савченко Тетяна Олександрівна (Майстер спорту міжнародного класу)',
    maxParticipants: 15,
    enrolled: 12,
    prerequisites: [
      'Сертифікат тренера базового рівня',
      'Досвід роботи від 5 років',
      'Підготовка спортсменів рівня МС'
    ],
    certificate: 'Сертифікат тренера високої кваліфікації',
    imageUrl: '/images/course-advanced.jpg',
    features: [
      'Складні акробатичні елементи',
      'Інноваційні тренувальні методики',
      'Спортивна медицина та відновлення',
      'Психологія чемпіонів',
      'Підготовка до світових змагань'
    ],
    schedule: [
      {
        day: 'День 1-3',
        time: '09:00-18:00',
        topics: ['Складні елементи групи сили', 'Біомеханіка руху', 'Методика навчання складності']
      },
      {
        day: 'День 4-6',
        time: '09:00-18:00',
        topics: ['Стрибки та стрибкові комбінації', 'Гнучкість та рівновага', 'Хореографічні зв\'язки']
      },
      {
        day: 'День 7-9',
        time: '09:00-18:00',
        topics: ['Композиція програм ELITE рівня', 'Підготовка до змагань', 'Тактика та стратегія']
      },
      {
        day: 'День 10',
        time: '09:00-15:00',
        topics: ['Практичний екзамен', 'Презентація авторських методик', 'Сертифікація']
      }
    ],
    status: 'open'
  },
  {
    id: 'course-4',
    title: 'AERODANCE: Сучасні напрямки фітнес-аеробіки',
    description: 'Інноваційний курс з вивчення AERODANCE - нового напрямку в спортивній аеробіці. Поєднання класичної техніки з сучасними танцювальними стилями.',
    type: 'specialist',
    level: 'intermediate',
    duration: 24,
    price: 2000,
    startDate: '2025-05-15',
    endDate: '2025-05-18',
    location: 'Одеса, ОНПУ',
    instructor: 'Коваленко Андрій Сергійович (Чемпіон Європи з AERODANCE)',
    maxParticipants: 30,
    enrolled: 22,
    certificate: 'Сертифікат інструктора з AERODANCE',
    imageUrl: '/images/course-aerodance.jpg',
    features: [
      'Основи AERODANCE',
      'Сучасні танцювальні стилі',
      'Музичність та ритм',
      'Групова хореографія',
      'Фітнес-програми для дорослих'
    ],
    schedule: [
      {
        day: 'День 1',
        time: '10:00-18:00',
        topics: ['Історія та розвиток AERODANCE', 'Базові кроки та рухи', 'Музичний супровід']
      },
      {
        day: 'День 2',
        time: '10:00-18:00',
        topics: ['Сучасні танцювальні стилі', 'Хіп-хоп елементи', 'Латино-американські мотиви']
      },
      {
        day: 'День 3',
        time: '10:00-18:00',
        topics: ['Групова хореографія', 'Синхронність виконання', 'Взаємодія в команді']
      },
      {
        day: 'День 4',
        time: '10:00-16:00',
        topics: ['Практичні заняття', 'Створення власних комбінацій', 'Атестація']
      }
    ],
    status: 'open'
  },
  {
    id: 'course-5',
    title: 'Онлайн курс: Основи спортивної аеробіки для тренерів',
    description: 'Дистанційний курс для тих, хто не може відвідувати очні заняття. Теоретичні основи, відеоматеріали та онлайн-консультації з досвідченими інструкторами.',
    type: 'basic',
    level: 'beginner',
    duration: 20,
    price: 1500,
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    location: 'Онлайн платформа ФУСАФ',
    instructor: 'Петренко Оксана Іванівна (КМС, досвід 15 років)',
    maxParticipants: 50,
    enrolled: 35,
    certificate: 'Електронний сертифікат базового рівня',
    imageUrl: '/images/course-online.jpg',
    features: [
      'Гнучкий графік навчання',
      'Відеоуроки високої якості',
      'Онлайн-консультації',
      'Електронні матеріали',
      'Тестування знань'
    ],
    schedule: [
      {
        day: 'Тиждень 1',
        time: 'Вільний графік',
        topics: ['Введення в спортивну аеробіку', 'Базові елементи', 'Техніка безпеки']
      },
      {
        day: 'Тиждень 2',
        time: 'Вільний графік',
        topics: ['Методика навчання', 'Планування тренувань', 'Віковий аспект']
      },
      {
        day: 'Тиждень 3',
        time: 'Вільний графік',
        topics: ['Хореографія та музика', 'Презентація програм', 'Змагальна діяльність']
      },
      {
        day: 'Тиждень 4',
        time: 'За розкладом',
        topics: ['Онлайн-семінар', 'Практичне завдання', 'Фінальне тестування']
      }
    ],
    status: 'open'
  },
  {
    id: 'course-6',
    title: 'Семінар: Інновації в спортивній аеробіці 2025',
    description: 'Одноденний семінар з новітніми тенденціями у світовій спортивній аеробіці. Зміни в правилах, нові елементи, міжнародний досвід.',
    type: 'specialist',
    level: 'intermediate',
    duration: 8,
    price: 800,
    startDate: '2025-06-20',
    endDate: '2025-06-20',
    location: 'Харків, ХДАФК',
    instructor: 'Запрошені міжнародні експерти FIG',
    maxParticipants: 100,
    enrolled: 67,
    certificate: 'Сертифікат учасника семінару',
    imageUrl: '/images/seminar-innovations.jpg',
    features: [
      'Міжнародні експерти',
      'Новітні правила FIG',
      'Інноваційні елементи',
      'Світовий досвід',
      'Нетворкінг'
    ],
    schedule: [
      {
        day: 'День 1',
        time: '09:00-12:00',
        topics: ['Зміни в правилах FIG 2025-2028', 'Нові категорії змагань', 'Система кваліфікації']
      },
      {
        day: 'День 1',
        time: '13:00-17:00',
        topics: ['Інноваційні елементи складності', 'Тенденції розвитку', 'Міжнародний досвід']
      }
    ],
    status: 'upcoming'
  }
];

export default function CoursesPage() {
  const { data: session } = useSession();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredCourses = demoCourses.filter(course => {
    const typeMatch = selectedType === 'all' || course.type === selectedType;
    const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
    return typeMatch && levelMatch;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      open: { label: 'Відкрита реєстрація', color: 'bg-green-500' },
      full: { label: 'Місця закінчилися', color: 'bg-red-500' },
      upcoming: { label: 'Скоро', color: 'bg-blue-500' },
      completed: { label: 'Завершено', color: 'bg-gray-500' }
    };

    const { label, color } = config[status as keyof typeof config] || config.upcoming;
    return <Badge className={`${color} text-white`}>{label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const config = {
      basic: { label: 'Базовий', color: 'bg-blue-100 text-blue-800' },
      advanced: { label: 'Продвинутий', color: 'bg-purple-100 text-purple-800' },
      judge: { label: 'Суддівський', color: 'bg-orange-100 text-orange-800' },
      specialist: { label: 'Спеціальний', color: 'bg-green-100 text-green-800' }
    };

    const { label, color } = config[type as keyof typeof config] || config.basic;
    return <Badge className={color}>{label}</Badge>;
  };

  const getLevelIcon = (level: string) => {
    const icons = {
      beginner: <Star className="h-4 w-4 text-yellow-500" />,
      intermediate: <><Star className="h-4 w-4 text-yellow-500" /><Star className="h-4 w-4 text-yellow-500" /></>,
      advanced: <><Star className="h-4 w-4 text-yellow-500" /><Star className="h-4 w-4 text-yellow-500" /><Star className="h-4 w-4 text-yellow-500" /></>,
      expert: <><Star className="h-4 w-4 text-yellow-500" /><Star className="h-4 w-4 text-yellow-500" /><Star className="h-4 w-4 text-yellow-500" /><Star className="h-4 w-4 text-yellow-500" /></>
    };
    return icons[level as keyof typeof icons] || icons.beginner;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 Курси та навчання ФУСАФ
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Професійні освітні програми для тренерів, суддів та спеціалістів зі спортивної аеробіки та фітнесу
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{demoCourses.length}</div>
              <div className="text-sm text-gray-600">Активних курсів</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {demoCourses.reduce((sum, course) => sum + course.enrolled, 0)}
              </div>
              <div className="text-sm text-gray-600">Студентів навчається</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">450+</div>
              <div className="text-sm text-gray-600">Сертифікатів видано</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">15</div>
              <div className="text-sm text-gray-600">Експертів-викладачів</div>
            </CardContent>
          </Card>
        </div>

        {/* Фільтри */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тип курсу:</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="all">Всі типи</option>
                  <option value="basic">Базові</option>
                  <option value="advanced">Продвинуті</option>
                  <option value="judge">Суддівські</option>
                  <option value="specialist">Спеціальні</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Рівень:</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="all">Всі рівні</option>
                  <option value="beginner">Початковий</option>
                  <option value="intermediate">Середній</option>
                  <option value="advanced">Продвинутий</option>
                  <option value="expert">Експертний</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Список курсів */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeBadge(course.type)}
                    {getStatusBadge(course.status)}
                  </div>
                  <div className="flex items-center">
                    {getLevelIcon(course.level)}
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                <p className="text-gray-600 text-sm">{course.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Основна інформація */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    {course.duration} годин
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    {course.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    {new Date(course.startDate).toLocaleDateString('uk-UA')}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                    {course.enrolled}/{course.maxParticipants}
                  </div>
                </div>

                {/* Викладач */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Викладач:</div>
                  <div className="text-sm text-blue-700">{course.instructor}</div>
                </div>

                {/* Ключові особливості */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Що вивчите:</div>
                  <div className="flex flex-wrap gap-2">
                    {course.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {course.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.features.length - 3} ще
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Вартість та реєстрація */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {course.price} грн
                    </div>
                    <div className="text-xs text-gray-500">
                      Сертифікат включено
                    </div>
                  </div>

                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Детальніше
                    </Button>
                    {course.status === 'open' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        {session ? 'Зареєструватися' : 'Увійти для реєстрації'}
                      </Button>
                    )}
                    {course.status === 'upcoming' && (
                      <Button size="sm" variant="outline">
                        Записатися в лист очікування
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Довідкова інформація */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              Переваги навчання в ФУСАФ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Офіційні сертифікати</h3>
                <p className="text-sm text-gray-600">Всі курси видають офіційні сертифікати ФУСАФ, визнані на міжнародному рівні</p>
              </div>

              <div className="text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Досвідчені викладачі</h3>
                <p className="text-sm text-gray-600">Навчання проводять майстри спорту, заслужені тренери та міжнародні судді</p>
              </div>

              <div className="text-center">
                <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Сучасні методики</h3>
                <p className="text-sm text-gray-600">Використання новітніх методик навчання та міжнародних стандартів FIG</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Контактна інформація */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Потрібна консультація щодо курсів?</h3>
            <p className="text-gray-600 mb-4">
              Наші фахівці допоможуть обрати оптимальну програму навчання відповідно до ваших цілей та досвіду
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                📞 +380 44 123-45-67
              </Button>
              <Button variant="outline">
                ✉️ courses@fusaf.org.ua
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
