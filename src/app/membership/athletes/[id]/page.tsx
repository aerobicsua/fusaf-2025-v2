"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  User,
  MapPin,
  Calendar,
  Trophy,
  Award,
  Medal,
  Star,
  ArrowLeft,
  Mail,
  Users,
  Building,
  GraduationCap,
  BarChart3,
  Camera,
  TrendingUp,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { PhotoGallery } from '@/components/athlete/PhotoGallery';
import { CompetitionResults } from '@/components/athlete/CompetitionResults';
import { AthleteChart } from '@/components/analytics/AthleteChart';
import type { Athlete, CompetitionResult } from '@/lib/athletes-storage';

export default function AthleteProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const athleteId = params.id as string;

  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/athletes/${athleteId}`);

        if (response.ok) {
          const data = await response.json();
          setAthlete(data.athlete);
        } else if (response.status === 404) {
          setError('Спортсмена не знайдено');
        } else {
          setError('Помилка завантаження профілю');
        }
      } catch (error) {
        setError('Помилка з\'єднання');
        console.error('Помилка завантаження спортсмена:', error);
      } finally {
        setLoading(false);
      }
    };

    if (athleteId) {
      fetchAthlete();
    }
  }, [athleteId, refreshKey]);

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getAge = (yearOfBirth?: number) => {
    if (!yearOfBirth) return 'Невідомо';
    const currentYear = new Date().getFullYear();
    return `${currentYear - yearOfBirth} років`;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { label: 'Активний', className: 'bg-green-500 text-white' },
      inactive: { label: 'Неактивний', className: 'bg-gray-500 text-white' },
      suspended: { label: 'Призупинено', className: 'bg-red-500 text-white' },
      retired: { label: 'Завершив кар\'єру', className: 'bg-blue-500 text-white' }
    };
    const config = configs[status as keyof typeof configs] || configs.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getGenderLabel = (gender: string) => {
    return gender === 'male' ? 'Чоловіча' : 'Жіноча';
  };

  const getLicenseLevelBadge = (level?: string) => {
    if (!level) return null;

    const configs = {
      beginner: { label: 'Початківець', className: 'bg-gray-500' },
      intermediate: { label: 'Середній', className: 'bg-blue-500' },
      advanced: { label: 'Просунутий', className: 'bg-purple-500' },
      professional: { label: 'Професіонал', className: 'bg-orange-500' },
      master: { label: 'Майстер', className: 'bg-red-500' }
    };

    const config = configs[level as keyof typeof configs];
    if (!config) return null;

    return <Badge className={`${config.className} text-white`}>{config.label}</Badge>;
  };

  // Перевірка прав на редагування
  const canEdit = !!(session && (
    session.user?.roles?.includes('admin') ||
    session.user?.email === athlete?.email ||
    session.user?.roles?.includes('coach_judge')
  ));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Завантаження профілю...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !athlete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Профіль не знайдено</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/membership/athletes">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Повернутися до списку
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const profileImage = athlete.media?.find(item => item.isProfileImage);
  const stats = athlete.stats;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero секція профілю в стилі FIG */}
      <div className="relative">
        <div
          className="h-96 bg-gradient-to-r from-orange-500 to-pink-600 flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(220, 104, 79, 0.8), rgba(173, 75, 62, 0.8)), url('https://ext.same-assets.com/2725761375/835613720.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center text-white">
              {/* Фото спортсмена */}
              <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center mr-8 shadow-lg overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage.url}
                    alt={`${athlete.firstName} ${athlete.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-orange-600 text-4xl font-bold">
                    {athlete.firstName.charAt(0)}{athlete.lastName.charAt(0)}
                  </span>
                )}
              </div>

              {/* Інформація */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">
                  {athlete.lastName.toUpperCase()} {athlete.firstName}
                </h1>
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-xl">{athlete.country}</span>
                  {athlete.placeOfBirth && (
                    <span className="text-lg ml-2 opacity-75">• {athlete.placeOfBirth}</span>
                  )}
                </div>
                <div className="flex items-center space-x-4 flex-wrap">
                  {getStatusBadge(athlete.status)}
                  {getLicenseLevelBadge(athlete.licenseLevel)}
                  {athlete.license && (
                    <Badge variant="outline" className="bg-white text-orange-600 border-white">
                      {athlete.license}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Швидка статистика */}
              {stats && (
                <div className="hidden lg:grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{stats.totalCompetitions}</div>
                    <div className="text-sm opacity-75">Змагань</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.wins}</div>
                    <div className="text-sm opacity-75">Перемог</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.podiums}</div>
                    <div className="text-sm opacity-75">Подіумів</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {stats.bestScore > 0 ? stats.bestScore.toFixed(1) : '-'}
                    </div>
                    <div className="text-sm opacity-75">Кращий бал</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Навігація профілю */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <Link href="/membership/athletes">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад до списку
                </Button>
              </Link>

              <Tabs defaultValue="identity" className="w-auto">
                <TabsList>
                  <TabsTrigger value="identity" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Особисті дані
                  </TabsTrigger>
                  <TabsTrigger value="results" className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Результати
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    Медіа
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Аналітика
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Статистика
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {canEdit && (
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Зв'язатися
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="identity" className="w-full">
          {/* Особисті дані */}
          <TabsContent value="identity">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Основна інформація */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Основна інформація
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">ЗВАННЯ</label>
                      <p className="text-lg">{athlete.title || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">СТАТЬ</label>
                      <p className="text-lg">{getGenderLabel(athlete.gender)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">ПРІЗВИЩЕ</label>
                    <p className="text-lg font-semibold">{athlete.lastName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">ІМ'Я</label>
                    <p className="text-lg">{athlete.firstName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">КРАЇНА</label>
                    <p className="text-lg flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {athlete.country}
                    </p>
                  </div>

                  {athlete.placeOfBirth && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">МІСЦЕ НАРОДЖЕННЯ</label>
                      <p className="text-lg">{athlete.placeOfBirth}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">РІК НАРОДЖЕННЯ</label>
                    <p className="text-lg flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {athlete.yearOfBirth ? `${athlete.yearOfBirth} (${getAge(athlete.yearOfBirth)})` : '-'}
                    </p>
                  </div>

                  {(athlete.height || athlete.weight) && (
                    <div className="grid grid-cols-2 gap-4">
                      {athlete.height && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">ЗРІСТ</label>
                          <p className="text-lg">{athlete.height} см</p>
                        </div>
                      )}
                      {athlete.weight && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">ВАГА</label>
                          <p className="text-lg">{athlete.weight} кг</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Спортивна інформація */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Спортивна інформація
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ДИСЦИПЛІНИ</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {athlete.disciplines.map((discipline, index) => (
                        <Badge key={index} className="bg-orange-500 text-white">
                          {discipline}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {athlete.club && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">КЛУБ</label>
                      <p className="text-lg flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-400" />
                        {athlete.club}
                      </p>
                    </div>
                  )}

                  {athlete.coach && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">ТРЕНЕР</label>
                      <p className="text-lg flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                        {athlete.coach}
                      </p>
                    </div>
                  )}

                  {athlete.trainingSite && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">МІСЦЕ ТРЕНУВАНЬ</label>
                      <p className="text-lg">{athlete.trainingSite}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">РІВЕНЬ ЛІЦЕНЗІЇ</label>
                    <div className="mt-2">
                      {getLicenseLevelBadge(athlete.licenseLevel) || (
                        <span className="text-lg text-gray-500">Не вказано</span>
                      )}
                    </div>
                  </div>

                  {athlete.license && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">ЛІЦЕНЗІЯ</label>
                      <p className="text-lg">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {athlete.license}
                        </code>
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">СТАТУС</label>
                    <div className="mt-2">
                      {getStatusBadge(athlete.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Біографія та досягнення */}
            {(athlete.biography || (athlete.achievements && athlete.achievements.length > 0) || athlete.interests) && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {athlete.biography && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Біографія</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{athlete.biography}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-6">
                  {athlete.achievements && athlete.achievements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Star className="h-5 w-5 mr-2" />
                          Досягнення
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {athlete.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Award className="h-5 w-5 mr-2 mt-1 text-orange-500 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-medium">{achievement.title}</h4>
                                <p className="text-sm text-gray-600">{achievement.description}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {achievement.type}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {achievement.level}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {new Date(achievement.date).toLocaleDateString('uk-UA')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {athlete.interests && athlete.interests.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Heart className="h-5 w-5 mr-2" />
                          Інтереси
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {athlete.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary">{interest}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {athlete.languages && athlete.languages.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Мови</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {athlete.languages.map((language, index) => (
                            <Badge key={index} variant="outline">{language}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Персональні рекорди */}
            {athlete.personalBests && Object.keys(athlete.personalBests).length > 0 && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Персональні рекорди
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {athlete.personalBests.totalScore && (
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">
                            {athlete.personalBests.totalScore.score.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600">Загальний бал</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {athlete.personalBests.totalScore.competition}
                          </div>
                        </div>
                      )}
                      {athlete.personalBests.technicScore && (
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {athlete.personalBests.technicScore.score.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600">Технічна оцінка</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {athlete.personalBests.technicScore.competition}
                          </div>
                        </div>
                      )}
                      {athlete.personalBests.artisticScore && (
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {athlete.personalBests.artisticScore.score.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600">Артистична оцінка</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {athlete.personalBests.artisticScore.competition}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Результати змагань */}
          <TabsContent value="results">
            <CompetitionResults
              athlete={athlete}
              canEdit={canEdit}
              onResultUpdate={handleUpdate}
            />
          </TabsContent>

          {/* Медіа галерея */}
          <TabsContent value="media">
            <PhotoGallery
              athlete={athlete}
              canEdit={canEdit}
              onPhotoUpdate={handleUpdate}
            />
          </TabsContent>

          {/* Аналітика */}
          <TabsContent value="analytics">
            <AthleteChart athlete={athlete} showDetailedStats={true} />
          </TabsContent>

          {/* Статистика */}
          <TabsContent value="stats">
            <div className="space-y-6">
              {stats ? (
                <>
                  {/* Загальна статистика */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Загальна статистика
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{stats.totalCompetitions}</div>
                          <div className="text-sm text-gray-600">Змагань</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-yellow-600">{stats.wins}</div>
                          <div className="text-sm text-gray-600">Перемог</div>
                          <div className="text-xs text-gray-500">
                            {stats.totalCompetitions > 0 && `${Math.round((stats.wins / stats.totalCompetitions) * 100)}%`}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600">{stats.podiums}</div>
                          <div className="text-sm text-gray-600">Подіумів</div>
                          <div className="text-xs text-gray-500">
                            {stats.totalCompetitions > 0 && `${Math.round((stats.podiums / stats.totalCompetitions) * 100)}%`}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {stats.bestScore > 0 ? stats.bestScore.toFixed(1) : '-'}
                          </div>
                          <div className="text-sm text-gray-600">Кращий бал</div>
                          <div className="text-xs text-gray-500">
                            Середній: {stats.averageScore > 0 ? stats.averageScore.toFixed(1) : '-'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Медалі */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Медалі</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <Trophy className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                          <div className="text-2xl font-bold text-yellow-600">{stats.medalsByType.gold}</div>
                          <div className="text-sm text-gray-600">Золото</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Medal className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <div className="text-2xl font-bold text-gray-600">{stats.medalsByType.silver}</div>
                          <div className="text-sm text-gray-600">Срібло</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <Award className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                          <div className="text-2xl font-bold text-orange-600">{stats.medalsByType.bronze}</div>
                          <div className="text-sm text-gray-600">Бронза</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Статистика по дисциплінах */}
                  {Object.keys(stats.disciplineStats).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Статистика по дисциплінах</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(stats.disciplineStats).map(([discipline, disciplineStats]) => (
                            <div key={discipline} className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">{discipline}</h4>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Змагань:</span>
                                  <span className="ml-2 font-medium">{disciplineStats.competitions}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Кращий результат:</span>
                                  <span className="ml-2 font-medium">
                                    {disciplineStats.bestRank === Number.POSITIVE_INFINITY ? '-' : `${disciplineStats.bestRank} місце`}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Середній бал:</span>
                                  <span className="ml-2 font-medium">
                                    {disciplineStats.averageScore > 0 ? disciplineStats.averageScore.toFixed(1) : '-'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Змагання по рокам */}
                  {Object.keys(stats.competitionsByYear).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Активність по рокам</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(stats.competitionsByYear)
                            .sort(([a], [b]) => Number.parseInt(b) - Number.parseInt(a))
                            .map(([year, count]) => (
                              <div key={year} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="font-medium">{year}</span>
                                <span className="text-gray-600">{count} змагань</span>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Немає статистики
                    </h3>
                    <p className="text-gray-600">
                      Статистика з'явиться після додавання результатів змагань
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
