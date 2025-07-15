"use client";


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Users,
  Calendar,
  BarChart3,
  Trophy,
  UserPlus,
  CheckCircle,
  Star,
  Target,
  Award,
  FileText,
  Shield,
  Globe,
  ArrowRight,
  Mail,
  Phone
} from "lucide-react";

export default function ClubRegistrationPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleRegistration = () => {
    // Перевіряємо авторизацію при натисканні кнопки реєстрації
    if (!session) {
      router.push('/auth/signin?redirect=' + encodeURIComponent('/membership/club/registration'));
      return;
    }
    router.push('/membership/club/registration');
  };

  const benefits = [
    {
      icon: Building,
      title: "Офіційний статус в ФУСАФ",
      description: "Зареєструйте клуб або підрозділ та отримайте офіційне визнання федерації"
    },
    {
      icon: Calendar,
      title: "Право організації змагань",
      description: "Проводьте офіційні змагання та турніри під егідою ФУСАФ"
    },
    {
      icon: Users,
      title: "Управління спортсменами",
      description: "Сучасні інструменти для роботи з командою та відстеження прогресу"
    },
    {
      icon: BarChart3,
      title: "Аналітика та звіти",
      description: "Детальна статистика результатів та розвитку вашого клубу"
    },
    {
      icon: Award,
      title: "Атестація тренерів",
      description: "Підготовка та сертифікація тренерського складу"
    },
    {
      icon: Trophy,
      title: "Участь у рейтингах",
      description: "Офіційні рейтинги клубів та досягнення на національному рівні"
    },
    {
      icon: FileText,
      title: "Методичні матеріали",
      description: "Доступ до ексклюзивних навчальних програм та методик"
    },
    {
      icon: Shield,
      title: "Страхування",
      description: "Корпоративне медичне та спортивне страхування"
    }
  ];

  const membershipTypes = [
    {
      id: "sport-club",
      title: "Спортивний клуб",
      description: "Для повноцінних спортивних клубів зі спортивної аеробіки",
      price: "від 5,000₴/рік",
      features: [
        "До 50 спортсменів",
        "Організація змагань",
        "Комерційна діяльність",
        "Брендинг та реклама",
        "Пріоритетна підтримка"
      ],
      recommended: true
    },
    {
      id: "department",
      title: "Підрозділ/Секція",
      description: "Для секцій при школах, університетах та організаціях",
      price: "від 2,500₴/рік",
      features: [
        "До 25 спортсменів",
        "Участь у змаганнях",
        "Освітні програми",
        "Методична підтримка",
        "Базове страхування"
      ],
      recommended: false
    },
    {
      id: "academy",
      title: "Академія/Школа",
      description: "Для навчальних закладів та академій спортивної аеробіки",
      price: "від 8,000₴/рік",
      features: [
        "Необмежена кількість учнів",
        "Сертифікація програм",
        "Міжнародне визнання",
        "Ліцензування",
        "VIP підтримка"
      ],
      recommended: false
    }
  ];

  const registrationSteps = [
    {
      step: "1",
      title: "Подача заявки",
      description: "Заповніть онлайн-форму з інформацією про клуб"
    },
    {
      step: "2",
      title: "Перевірка документів",
      description: "Наша команда перевірить надані документи (3-5 днів)"
    },
    {
      step: "3",
      title: "Оплата членських внесків",
      description: "Сплатіть річний членський внесок зручним способом"
    },
    {
      step: "4",
      title: "Отримання сертифіката",
      description: "Отримайте офіційний сертифікат та доступ до системи"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Hero секція */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-full">
                <Building className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Реєстрація Клубу/Підрозділу
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Зареєструйте свій спортивний клуб або підрозділ в ФУСАФ та отримайте доступ
              до всіх переваг офіційного членства в федерації
            </p>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="text-2xl font-bold text-green-600">89</div>
                <div className="text-sm text-gray-600">Зареєстрованих клубів</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="text-2xl font-bold text-blue-600">2,847</div>
                <div className="text-sm text-gray-600">Спортсменів у клубах</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-gray-600">Змагань організовано</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-sm text-gray-600">Міст України</div>
              </div>
            </div>
          </div>

          {/* Типи членства */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Оберіть тип організації</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {membershipTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`relative ${type.recommended ? 'ring-2 ring-green-500 shadow-lg' : ''}`}
                >
                  {type.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-600 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Рекомендуємо
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold">{type.title}</CardTitle>
                    <CardDescription className="mb-4">{type.description}</CardDescription>
                    <div className="text-2xl font-bold text-green-600">{type.price}</div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleRegistration}
                      className="w-full"
                      variant={type.recommended ? "default" : "outline"}
                    >
                      Обрати план
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Переваги */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Переваги членства</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Процес реєстрації */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Як зареєструватися</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {registrationSteps.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {index < registrationSteps.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-gray-400 mx-auto mt-4 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA секція */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Готові зареєструвати клуб?</h2>
            <p className="text-lg mb-6 opacity-90">
              Приєднуйтесь до федерації та розвивайте спортивну аеробіку разом з нами
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Button
                onClick={handleRegistration}
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <Building className="h-5 w-5 mr-2" />
                {session ? "Розпочати реєстрацію" : "Увійти і зареєструватися"}
              </Button>

              <Link href="/contacts">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Зв'язатися з нами
                </Button>
              </Link>
            </div>

            {!session && (
              <p className="text-sm opacity-75">
                У вас немає акаунту? Його буде створено автоматично при вході.
              </p>
            )}
          </div>

          {/* Додаткова інформація */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Потрібна допомога?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Наша команда готова допомогти вам з реєстрацією та відповісти на всі питання.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/contacts">Написати нам</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  Міжнародне визнання
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Клуби ФУСАФ визнаються міжнародними федераціями спортивної аеробіки.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/international">Дізнатися більше</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
