"use client";

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  Users,
  Award,
  ArrowRight,
  Star,
  MapPin,
  ChevronRight,
  Target,
  Shield,
  Globe
} from 'lucide-react';

// Демонстраційні дані для головної
const upcomingCompetitions = [
  {
    id: 'comp-1',
    title: 'Кубок України зі спортивної аеробіки 2025',
    date: '2025-04-15',
    location: 'Палац спорту "Україна", Київ',
    status: 'Реєстрація відкрита',
    participants: 87
  },
  {
    id: 'comp-2',
    title: 'Чемпіонат Львівської області',
    date: '2025-03-20',
    location: 'Арена Львів',
    status: 'Реєстрація відкрита',
    participants: 64
  }
];



const stats = [
  { label: 'Активних змагань', value: '4', icon: Trophy },
  { label: 'Зареєстрованих спортсменів', value: '2,847', icon: Users },
  { label: 'Клубів в Україні', value: '156', icon: Award },
  { label: 'Міст учасників', value: '89', icon: MapPin }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero секція */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Федерація України зі Спортивної Аеробіки і Фітнесу
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Розвиваємо спортивну аеробіку в Україні • Організовуємо змагання • Готуємо чемпіонів
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/competitions">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4">
                  <Trophy className="mr-2 h-5 w-5" />
                  Календар змагань
                </Button>
              </Link>
              <Link href="/membership">
                <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 py-4 transition-all duration-200">
                  <Users className="mr-2 h-5 w-5" />
                  Стати членом
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Найближчі змагання */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🏆 Найближчі змагання</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Приєднуйтесь до офіційних змагань з спортивної аеробіки та фітнесу в Україні
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {upcomingCompetitions.map((competition) => (
              <Card key={competition.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{competition.title}</CardTitle>
                    <Badge className="bg-green-500 text-white">
                      {competition.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(competition.date).toLocaleDateString('uk-UA')}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {competition.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {competition.participants} учасників зареєстровано
                    </div>
                  </div>
                  <Link href="/competitions">
                    <Button className="w-full mt-4">
                      Деталі та реєстрація
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/competitions">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Всі змагання
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>



      {/* Чому ФУСАФ */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🇺🇦 Чому ФУСАФ?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Ми є офіційною федерацією України зі спортивної аеробіки та фітнесу,
              яка працює на розвиток цього виду спорту по всій країні
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Професійний розвиток</h3>
                <p className="text-gray-600">
                  Організовуємо змагання міжнародного рівня та готуємо спортсменів до участі у світових турнірах
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Сертифікація</h3>
                <p className="text-gray-600">
                  Проводимо навчання та сертифікацію тренерів, суддів та інструкторів з фітнесу по всій Україні
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Міжнародна інтеграція</h3>
                <p className="text-gray-600">
                  Співпрацюємо з FIG та іншими міжнародними федераціями для розвитку спорту в Україні
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA секція */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Готові приєднатися до ФУСАФ?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Станьте частиною найбільшої спільноти спортивної аеробіки в Україні
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4">
                <Star className="mr-2 h-5 w-5" />
                Стати членом
              </Button>
            </Link>
            <Link href="/competitions">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 py-4 transition-all duration-200">
                <Trophy className="mr-2 h-5 w-5" />
                Переглянути змагання
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ФУСАФ</h3>
              <p className="text-gray-400">
                Федерація України зі Спортивної Аеробіки і Фітнесу
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Змагання</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/competitions" className="hover:text-white">Календар змагань</Link></li>
                <li><Link href="/membership" className="hover:text-white">Членство</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Інформація</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/instructions" className="hover:text-white">Інструкції</Link></li>
                <li>
                  <span className="text-gray-500">info@fusaf.org.ua</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ФУСАФ. Всі права захищені.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
