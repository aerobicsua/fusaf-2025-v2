"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Building,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Trophy,
  Users
} from 'lucide-react';

interface MembershipOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  path: string;
  color: string;
  highlighted?: boolean;
}

const membershipOptions: MembershipOption[] = [
  {
    id: 'athlete',
    title: 'Реєстрація Спортсмена',
    description: 'Індивідуальна реєстрація для спортсменів зі спортивної аеробіки',
    icon: <Trophy className="h-8 w-8" />,
    benefits: [
      'Участь у змаганнях',
      'Доступ до тренувальних програм',
      'Офіційні рейтинги та рекорди',
      'Медичне страхування',
      'Спортивний паспорт ФУСАФ'
    ],
    path: '/membership/athlete',
    color: 'blue',
    highlighted: true
  },
  {
    id: 'club',
    title: 'Реєстрація Клубу/Підрозділу',
    description: 'Реєстрація спортивних клубів та організацій',
    icon: <Building className="h-8 w-8" />,
    benefits: [
      'Офіційний статус в ФУСАФ',
      'Право організації змагань',
      'Доступ до методичних матеріалів',
      'Підтримка в розвитку клубу',
      'Корпоративні тарифи'
    ],
    path: '/membership/club',
    color: 'green'
  },
  {
    id: 'coach-judge',
    title: 'Реєстрація Тренера/Судді',
    description: 'Атестація тренерів та суддів зі спортивної аеробіки',
    icon: <Award className="h-8 w-8" />,
    benefits: [
      'Офіційна акредитація',
      'Участь у семінарах та курсах',
      'Суддівство змагань',
      'Професійний розвиток',
      'Міжнародне визнання'
    ],
    path: '/membership/coach-judge',
    color: 'purple'
  }
];

export default function MembershipPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getCardClasses = (option: MembershipOption) => {
    const baseClasses = "relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border-2";

    if (selectedOption === option.id) {
      return `${baseClasses} border-pink-500 shadow-lg transform scale-105`;
    }

    if (option.highlighted) {
      return `${baseClasses} border-blue-200 hover:border-blue-400`;
    }

    return `${baseClasses} border-gray-200 hover:border-gray-300`;
  };

  const getIconClasses = (option: MembershipOption) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100'
    };

    return `p-3 rounded-full ${colorMap[option.color as keyof typeof colorMap]}`;
  };

  const handleOptionSelect = (option: MembershipOption) => {
    setSelectedOption(option.id);
    // Додаємо невелику затримку для візуального ефекту
    setTimeout(() => {
      router.push(option.path);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Заголовок сторінки */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Членство в ФУСАФ
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Оберіть тип членства, який найкраще відповідає вашим потребам.
              Приєднуйтесь до спільноти спортивної аеробіки в Україні!
            </p>
          </div>

          {/* Карточки опцій членства */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {membershipOptions.map((option) => (
              <Card
                key={option.id}
                className={getCardClasses(option)}
                onClick={() => handleOptionSelect(option)}
              >
                {option.highlighted && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Популярне
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 ${getIconClasses(option)}`}>
                    {option.icon}
                  </div>
                  <CardTitle className="text-xl font-bold mb-2">
                    {option.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {option.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-6">
                    {option.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full group"
                    variant={option.highlighted ? "default" : "outline"}
                  >
                    Розпочати реєстрацію
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Додаткова інформація */}
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Чому варто приєднатися?
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Офіційне визнання в спортивній спільноті</li>
                  <li>• Доступ до ексклюзивних програм та змагань</li>
                  <li>• Професійний розвиток та навчання</li>
                  <li>• Мережа контактів у сфері спорту</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Що входить в членство?
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Офіційні документи та сертифікати</li>
                  <li>• Страхування під час тренувань</li>
                  <li>• Доступ до онлайн-платформи</li>
                  <li>• Технічна підтримка 24/7</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Якщо користувач не авторизований */}
          {!session && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Потрібна авторизація
                </h3>
                <p className="text-blue-700 mb-4">
                  Для реєстрації на членство необхідно спочатку увійти в систему або створити акаунт.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => router.push('/auth/signin')}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Вхід
                  </Button>
                  <Button
                    onClick={() => router.push('/auth/signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Реєстрація
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
