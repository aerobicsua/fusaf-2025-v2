"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';
import { ExportData } from '@/components/export/ExportData';
import {
  Users,
  Trophy,
  Search,
  Filter,
  UserCheck,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import Link from 'next/link';
import type { Athlete } from '@/lib/athletes-storage';

interface AthletesData {
  athletes: Athlete[];
  total: number;
  stats: any;
}

export default function AthletesPage() {
  const [athletesData, setAthletesData] = useState<AthletesData>({
    athletes: [],
    total: 0,
    stats: null
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    discipline: '',
    country: '',
    license: '',
    surname: '',
    status: ''
  });

  // Завантаження спортсменів
  const fetchAthletes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value);
        }
      });

      const response = await fetch(`/api/athletes?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAthletesData(data);
      }
    } catch (error) {
      console.error('Помилка завантаження спортсменів:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchAthletes();
  };

  const handleClearFilters = () => {
    setFilters({
      discipline: '',
      country: '',
      license: '',
      surname: '',
      status: ''
    });
    setTimeout(fetchAthletes, 100);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { label: 'Активний', className: 'bg-green-500 text-white' },
      inactive: { label: 'Неактивний', className: 'bg-gray-500 text-white' },
      suspended: { label: 'Призупинено', className: 'bg-red-500 text-white' }
    };
    const config = configs[status as keyof typeof configs] || configs.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getAge = (yearOfBirth?: number) => {
    if (!yearOfBirth) return '-';
    const currentYear = new Date().getFullYear();
    return `${currentYear - yearOfBirth} р.`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero секція в стилі FIG */}
      <div className="relative">
        <div
          className="h-96 bg-gradient-to-r from-orange-500 to-pink-600 flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(220, 104, 79, 0.8), rgba(173, 75, 62, 0.8)), url('https://ext.same-assets.com/2725761375/531879450.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">СПОРТСМЕНИ</h1>
            <p className="text-xl">Зареєстровані члени ФУСАФ</p>
          </div>
        </div>

        {/* Вкладки */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="licences" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger value="licences" className="text-white bg-orange-500 data-[state=active]:bg-orange-600">
                  Спортсмени
                </TabsTrigger>
                <TabsTrigger value="biographies" className="text-gray-600 hover:text-orange-600">
                  Біографії
                </TabsTrigger>
                <TabsTrigger value="champions" className="text-gray-600 hover:text-orange-600">
                  Чемпіони
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Розширений пошук */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <AdvancedSearch
              athletes={athletesData.athletes}
              placeholder="Пошук спортсменів за ім'ям, прізвищем, клубом, дисципліною..."
              showQuickActions={true}
            />
          </CardContent>
        </Card>

        {/* Фільтри в стилі FIG (додатково) */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <Label htmlFor="discipline">Дисципліна</Label>
                <Select value={filters.discipline} onValueChange={(value) => handleFilterChange('discipline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="- Оберіть дисципліну -" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі дисципліни</SelectItem>
                    <SelectItem value="Спортивна аеробіка">Спортивна аеробіка</SelectItem>
                    <SelectItem value="Фітнес аеробіка">Фітнес аеробіка</SelectItem>
                    <SelectItem value="Степ аеробіка">Степ аеробіка</SelectItem>
                    <SelectItem value="Хіп-хоп аеробіка">Хіп-хоп аеробіка</SelectItem>
                    <SelectItem value="Танцювальна аеробіка">Танцювальна аеробіка</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="country">Країна</Label>
                <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="- Оберіть країну -" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі країни</SelectItem>
                    <SelectItem value="Україна">Україна</SelectItem>
                    <SelectItem value="Польща">Польща</SelectItem>
                    <SelectItem value="Румунія">Румунія</SelectItem>
                    <SelectItem value="Чехія">Чехія</SelectItem>
                    <SelectItem value="Словаччина">Словаччина</SelectItem>
                    <SelectItem value="Угорщина">Угорщина</SelectItem>
                    <SelectItem value="Болгарія">Болгарія</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="license">Номер ліцензії</Label>
                <Input
                  id="license"
                  value={filters.license}
                  onChange={(e) => handleFilterChange('license', e.target.value)}
                  placeholder="Номер ліцензії"
                />
              </div>

              <div>
                <Label htmlFor="surname">Прізвище</Label>
                <Input
                  id="surname"
                  value={filters.surname}
                  onChange={(e) => handleFilterChange('surname', e.target.value)}
                  placeholder="Прізвище / Ім'я"
                />
              </div>

              <div>
                <Label htmlFor="status">Статус</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="- Статус -" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі статуси</SelectItem>
                    <SelectItem value="active">Активний</SelectItem>
                    <SelectItem value="inactive">Неактивний</SelectItem>
                    <SelectItem value="suspended">Призупинено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              >
                <Search className="h-4 w-4 mr-2" />
                ФІЛЬТР
              </Button>
              <Button
                onClick={handleClearFilters}
                variant="outline"
              >
                Очистити
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Результати */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Завантаження спортсменів...</p>
          </div>
        ) : athletesData.total === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Спортсменів не знайдено
              </h3>
              <p className="text-gray-600 mb-4">
                Оберіть принаймні один фільтр або змініть критерії пошуку
              </p>
              <Button onClick={handleClearFilters} variant="outline">
                Показати всіх спортсменів
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-orange-500" />
                  Знайдено спортсменів: {athletesData.total}
                </span>
                <div className="flex items-center space-x-4">
                  {athletesData.stats && (
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-600">
                        <UserCheck className="h-4 w-4 inline mr-1" />
                        Активних: {athletesData.stats.active}
                      </span>
                    </div>
                  )}
                  <ExportData
                    athletes={athletesData.athletes}
                    title="Список спортсменів ФУСАФ"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Спортсмен</TableHead>
                      <TableHead>Ліцензія</TableHead>
                      <TableHead>Країна</TableHead>
                      <TableHead>Дисципліни</TableHead>
                      <TableHead>Вік</TableHead>
                      <TableHead>Клуб</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Дії</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {athletesData.athletes.map((athlete) => (
                      <TableRow key={athlete.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-semibold">
                                {athlete.firstName.charAt(0)}{athlete.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{athlete.firstName} {athlete.lastName}</p>
                              <p className="text-sm text-gray-500">{athlete.title}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {athlete.license || '-'}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            {athlete.country}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {athlete.disciplines.slice(0, 2).map((discipline, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {discipline}
                              </Badge>
                            ))}
                            {athlete.disciplines.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{athlete.disciplines.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {getAge(athlete.yearOfBirth)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {athlete.club || '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(athlete.status)}
                        </TableCell>
                        <TableCell>
                          <Link href={`/membership/athletes/${athlete.id}`}>
                            <Button size="sm" variant="outline">
                              <Award className="h-4 w-4 mr-1" />
                              Профіль
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Статистика внизу */}
        {athletesData.stats && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{athletesData.stats.total}</div>
                <div className="text-sm text-gray-600">Всього спортсменів</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{athletesData.stats.active}</div>
                <div className="text-sm text-gray-600">Активних</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {athletesData.stats.byDiscipline?.['Спортивна аеробіка'] || 0}
                </div>
                <div className="text-sm text-gray-600">Спортивна аеробіка</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {athletesData.stats.byCountry?.['Україна'] || 0}
                </div>
                <div className="text-sm text-gray-600">З України</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
