"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  User,
  Eye,
  MessageCircle,
  Tag,
  TrendingUp,
  Trophy,
  Star,
  Clock,
  Search,
  Filter
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "competition" | "training" | "federation" | "athlete" | "event";
  author: string;
  publishDate: string;
  imageUrl: string;
  views: number;
  comments: number;
  tags: string[];
  featured: boolean;
}

// Демонстраційні новини ФУСАФ
const demoNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Українські спортсмени здобули золото на Чемпіонаті Європи зі спортивної аеробіки',
    summary: 'Національна збірна України показала бездоганне виконання та здобула перше місце в груповій програмі на Чемпіонаті Європи у Польщі.',
    content: 'Вітаємо нашу національну збірну з блискучою перемогою на Чемпіонаті Європи зі спортивної аеробіки! У складній боротьбі з найсильнішими командами континенту, наші спортсмени продемонстрували найвищий рівень майстерності та злагодженості...',
    category: 'competition',
    author: 'ФУСАФ прес-служба',
    publishDate: '2024-12-28',
    imageUrl: '/images/news-europe-championship.jpg',
    views: 2847,
    comments: 34,
    tags: ['Чемпіонат Європи', 'Збірна України', 'Золота медаль', 'Групова програма'],
    featured: true
  },
  {
    id: 'news-2',
    title: 'Нові правила FIG 2025-2028: ключові зміни для українських спортсменів',
    summary: 'Міжнародна федерація гімнастики оприлюднила оновлені правила змагань зі спортивної аеробіки на новий цикл.',
    content: 'Федерація гімнастики України детально проаналізувала нові правила FIG та підготувала рекомендації для тренерів і спортсменів. Основні зміни стосуються системи оцінювання складності та артистичних компонентів...',
    category: 'federation',
    author: 'Технічний комітет ФУСАФ',
    publishDate: '2024-12-25',
    imageUrl: '/images/news-new-rules.jpg',
    views: 1923,
    comments: 18,
    tags: ['FIG', 'Правила змагань', 'Оцінювання', 'Технічний комітет'],
    featured: true
  },
  {
    id: 'news-3',
    title: 'Відкриття нового тренувального центру ФУСАФ у Львові',
    summary: 'У Львові урочисто відкрито сучасний тренувальний центр зі спортивної аеробіки з найсучаснішим обладнанням.',
    content: 'Новий тренувальний центр площею 800 кв.м. обладнано професійними килимами для аеробіки, дзеркалами, звуковою системою та зонами для фізичної підготовки. Центр стане базою для підготовки спортсменів західного регіону...',
    category: 'event',
    author: 'Марина Савченко',
    publishDate: '2024-12-22',
    imageUrl: '/images/news-training-center.jpg',
    views: 1564,
    comments: 22,
    tags: ['Тренувальний центр', 'Львів', 'Інфраструктура', 'Розвиток'],
    featured: false
  },
  {
    id: 'news-4',
    title: 'Семінар для тренерів: "Психологічна підготовка юних спортсменів"',
    summary: 'ФУСАФ організовує спеціальний семінар для тренерів з актуальних питань психологічної підготовки дітей та підлітків.',
    content: 'Семінар проведе відомий спортивний психолог Олена Петрова, яка має 15-річний досвід роботи зі збірними командами України. Учасники дізнаються про сучасні методики мотивації, подолання стресу перед змаганнями...',
    category: 'training',
    author: 'Освітній відділ ФУСАФ',
    publishDate: '2024-12-20',
    imageUrl: '/images/news-psychology-seminar.jpg',
    views: 987,
    comments: 15,
    tags: ['Семінар', 'Психологія спорту', 'Юні спортсмени', 'Освіта'],
    featured: false
  },
  {
    id: 'news-5',
    title: 'Петренко Оксана здобула звання "Заслужений майстер спорту"',
    summary: 'Чемпіонка світу та Європи зі спортивної аеробіки отримала найвище спортивне звання України.',
    content: 'Указом Президента України Оксані Петренко присвоєно звання "Заслужений майстер спорту" за видатні спортивні досягнення та популяризацію спортивної аеробіки в Україні. Протягом спортивної кар\'єри вона здобула 15 медалей на міжнародних змаганнях...',
    category: 'athlete',
    author: 'Спортивний кореспондент',
    publishDate: '2024-12-18',
    imageUrl: '/images/news-athlete-award.jpg',
    views: 2156,
    comments: 41,
    tags: ['Заслужений майстер спорту', 'Оксана Петренко', 'Нагорода', 'Досягнення'],
    featured: true
  },
  {
    id: 'news-6',
    title: 'Кубок України 2025: розпочато реєстрацію учасників',
    summary: 'Стартувала реєстрація на найпрестижніші змагання року - Кубок України зі спортивної аеробіки.',
    content: 'Кубок України відбудеться 15-17 квітня 2025 року в Палаці спорту "Україна" у Києві. Очікується участь понад 300 спортсменів з усіх регіонів країни. Змагання проводитимуться за новими правилами FIG у всіх вікових категоріях...',
    category: 'competition',
    author: 'Організаційний комітет',
    publishDate: '2024-12-15',
    imageUrl: '/images/news-ukraine-cup.jpg',
    views: 3241,
    comments: 28,
    tags: ['Кубок України', 'Реєстрація', 'Київ', 'Змагання 2025'],
    featured: false
  },
  {
    id: 'news-7',
    title: 'Міжнародний турнір "Golden Aerobic Cup" у Києві',
    summary: 'Україна прийматиме престижний міжнародний турнір за участю команд з 15 країн світу.',
    content: 'У березні 2025 року Київ стане господарем міжнародного турніру "Golden Aerobic Cup". Змагання відбудуться в НСК "Олімпійський" за підтримки Міністерства молоді та спорту. Очікується участь провідних спортсменів з Європи, Азії та Америки...',
    category: 'event',
    author: 'Міжнародний відділ ФУСАФ',
    publishDate: '2024-12-12',
    imageUrl: '/images/news-golden-cup.jpg',
    views: 1876,
    comments: 19,
    tags: ['Міжнародний турнір', 'Golden Aerobic Cup', 'Київ', 'НСК Олімпійський'],
    featured: false
  },
  {
    id: 'news-8',
    title: 'Новий склад національної збірної України на 2025 рік',
    summary: 'Тренерський штаб оголосив оновлений склад збірної команди на новий спортивний сезон.',
    content: 'До складу національної збірної увійшли 24 спортсмени з різних регіонів України. Головний тренер Віктор Лисенко відзначив високий рівень конкуренції та зростання майстерності молодих спортсменів. Збірна розпочне підготовку до Чемпіонату світу...',
    category: 'athlete',
    author: 'Головний тренер збірної',
    publishDate: '2024-12-10',
    imageUrl: '/images/news-national-team.jpg',
    views: 2789,
    comments: 52,
    tags: ['Збірна України', 'Склад команди', 'Сезон 2025', 'Підготовка'],
    featured: true
  },
  {
    id: 'news-9',
    title: 'Інноваційна програма розвитку дитячої спортивної аеробіки',
    summary: 'ФУСАФ запускає нову програму для залучення дітей до занять спортивною аеробікою у школах.',
    content: 'Програма "Аеробіка в школі" передбачає впровадження спеціальних уроків фізкультури з елементами спортивної аеробіки в загальноосвітніх школах. Проект стартує в 50 школах п\'яти областей України...',
    category: 'federation',
    author: 'Відділ розвитку ФУСАФ',
    publishDate: '2024-12-08',
    imageUrl: '/images/news-school-program.jpg',
    views: 1432,
    comments: 26,
    tags: ['Дитяча аеробіка', 'Школи', 'Розвиток', 'Освітня програма'],
    featured: false
  },
  {
    id: 'news-10',
    title: 'Онлайн-майстер-клас від чемпіонки світу',
    summary: 'Анна Коваленко проведе безкоштовний онлайн-майстер-клас для молодих спортсменів та тренерів.',
    content: 'Дворазова чемпіонка світу Анна Коваленко поділиться секретами майстерності в онлайн-форматі. Майстер-клас відбудеться 20 січня 2025 року о 18:00. Реєстрація на офіційному сайті ФУСАФ...',
    category: 'training',
    author: 'Медіа-команда ФУСАФ',
    publishDate: '2024-12-05',
    imageUrl: '/images/news-master-class.jpg',
    views: 3654,
    comments: 87,
    tags: ['Майстер-клас', 'Онлайн', 'Анна Коваленко', 'Навчання'],
    featured: false
  }
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'comments'>('date');

  const filteredNews = demoNews
    .filter(article => {
      const categoryMatch = selectedCategory === 'all' || article.category === selectedCategory;
      const searchMatch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.views - a.views;
        case 'comments':
          return b.comments - a.comments;
        case 'date':
        default:
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      }
    });

  const featuredNews = demoNews.filter(article => article.featured);

  const getCategoryBadge = (category: string) => {
    const config = {
      competition: { label: 'Змагання', color: 'bg-red-100 text-red-800' },
      training: { label: 'Навчання', color: 'bg-blue-100 text-blue-800' },
      federation: { label: 'Федерація', color: 'bg-green-100 text-green-800' },
      athlete: { label: 'Спортсмени', color: 'bg-purple-100 text-purple-800' },
      event: { label: 'Події', color: 'bg-orange-100 text-orange-800' }
    };

    const { label, color } = config[category as keyof typeof config] || config.federation;
    return <Badge className={color}>{label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📰 Новини ФУСАФ
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Останні новини, події та досягнення у світі спортивної аеробіки та фітнесу України
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{demoNews.length}</div>
              <div className="text-sm text-gray-600">Всього новин</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {demoNews.reduce((sum, news) => sum + news.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Всього переглядів</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {demoNews.reduce((sum, news) => sum + news.comments, 0)}
              </div>
              <div className="text-sm text-gray-600">Коментарів</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{featuredNews.length}</div>
              <div className="text-sm text-gray-600">Важливих новин</div>
            </CardContent>
          </Card>
        </div>

        {/* Рекомендовані новини */}
        {featuredNews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              Головні новини
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredNews.slice(0, 4).map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                      <Trophy className="h-16 w-16 text-white" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        {getCategoryBadge(article.category)}
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(article.publishDate)}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {article.views}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {article.comments}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Читати далі
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Фільтри та пошук */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Пошук новин..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Категорія:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="all">Всі категорії</option>
                  <option value="competition">Змагання</option>
                  <option value="training">Навчання</option>
                  <option value="federation">Федерація</option>
                  <option value="athlete">Спортсмени</option>
                  <option value="event">Події</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Сортування:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'comments')}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="date">За датою</option>
                  <option value="views">За переглядами</option>
                  <option value="comments">За коментарями</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Список всіх новин */}
        <div className="space-y-6">
          {filteredNews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Новин не знайдено</h3>
                <p className="text-gray-600">
                  Спробуйте змінити критерії пошуку або фільтри
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNews.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Зображення */}
                    <div className="w-48 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-12 w-12 text-white" />
                    </div>

                    {/* Контент */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getCategoryBadge(article.category)}
                          {article.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Рекомендовано
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(article.publishDate)}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {article.summary}
                      </p>

                      {/* Теги */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Метаінформація */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {article.views.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {article.comments}
                          </div>
                        </div>

                        <Button variant="outline" size="sm">
                          Читати повністю
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Підписка на новини */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Не пропускайте важливі новини!</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Підпишіться на розсилку ФУСАФ та першими дізнавайтесь про змагання,
              досягнення спортсменів та важливі події у світі спортивної аеробіки
            </p>
            <div className="flex max-w-md mx-auto gap-4">
              <Input placeholder="Ваш email" className="flex-1" />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Підписатися
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Ми поважаємо вашу конфіденційність. Розсилка 1-2 рази на тиждень.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
