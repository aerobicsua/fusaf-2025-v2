import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Інтерфейс для реєстрації клубу
interface ClubRegistration {
  id: string;
  userId: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';

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
  director: {
    firstName: string;
    lastName: string;
    position: string;
    phone: string;
    email: string;
  };

  // Спортивна діяльність
  sportTypes: string;
  establishedYear: string;
  membersCount: string;
  ageGroups: string;
  facilities: string;
  achievements: string;

  // Тренерський склад
  coaching: {
    coachesCount: string;
    qualifiedCoachesCount: string;
    headCoachName: string;
    headCoachQualification: string;
  };

  // Планування та цілі
  goals: string;
  plannedActivities: string;
  cooperationInterests: string;

  // Згоди
  consents: {
    dataProcessing: boolean;
    rulesAcceptance: boolean;
    ethicsCodeAcceptance: boolean;
    mediaConsent: boolean;
  };

  createdAt: string;
  updatedAt: string;
}

// Мок сховище для реєстрацій клубів
let clubRegistrations: ClubRegistration[] = [];

export async function POST(request: Request) {
  try {
    // Перевіряємо авторизацію
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Необхідна авторизація' },
        { status: 401 }
      );
    }

    const registrationData = await request.json();

    // Валідація основних полів
    const requiredFields = [
      'organizationType', 'clubName', 'legalName', 'email', 'phone',
      'city', 'address', 'directorFirstName', 'directorLastName',
      'directorPosition', 'directorPhone', 'directorEmail',
      'sportTypes', 'establishedYear', 'membersCount'
    ];

    for (const field of requiredFields) {
      if (!registrationData[field]?.trim?.() && typeof registrationData[field] !== 'string') {
        return NextResponse.json(
          { error: `Поле "${field}" обов'язкове` },
          { status: 400 }
        );
      }
    }

    // Валідація згод
    if (!registrationData.dataProcessingConsent) {
      return NextResponse.json(
        { error: 'Згода на обробку персональних даних обов\'язкова' },
        { status: 400 }
      );
    }

    if (!registrationData.rulesAcceptance) {
      return NextResponse.json(
        { error: 'Прийняття правил федерації обов\'язкове' },
        { status: 400 }
      );
    }

    if (!registrationData.ethicsCodeAcceptance) {
      return NextResponse.json(
        { error: 'Прийняття етичного кодексу обов\'язкове' },
        { status: 400 }
      );
    }

    // Перевірка валідності email
    if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
      return NextResponse.json(
        { error: 'Введіть коректний email організації' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(registrationData.directorEmail)) {
      return NextResponse.json(
        { error: 'Введіть коректний email керівника' },
        { status: 400 }
      );
    }

    // Перевірка унікальності назви клубу
    const existingClub = clubRegistrations.find(
      reg => reg.clubName.toLowerCase() === registrationData.clubName.toLowerCase()
    );

    if (existingClub) {
      return NextResponse.json(
        { error: 'Клуб з такою назвою вже зареєстрований' },
        { status: 409 }
      );
    }

    // Перевірка унікальності email
    const existingEmail = clubRegistrations.find(
      reg => reg.email.toLowerCase() === registrationData.email.toLowerCase()
    );

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Клуб з такою електронною поштою вже зареєстрований' },
        { status: 409 }
      );
    }

    // Створюємо реєстрацію клубу
    const clubRegistration: ClubRegistration = {
      id: `club_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: session.user.id,
      registrationDate: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected

      // Інформація про організацію
      organizationType: registrationData.organizationType,
      clubName: registrationData.clubName.trim(),
      legalName: registrationData.legalName.trim(),
      registrationNumber: registrationData.registrationNumber?.trim() || '',
      taxNumber: registrationData.taxNumber?.trim() || '',
      foundingDate: registrationData.foundingDate || '',

      // Контактна інформація організації
      email: registrationData.email.toLowerCase().trim(),
      phone: registrationData.phone.trim(),
      website: registrationData.website?.trim() || '',
      address: registrationData.address.trim(),
      city: registrationData.city.trim(),
      region: registrationData.region || '',

      // Інформація про керівника
      director: {
        firstName: registrationData.directorFirstName.trim(),
        lastName: registrationData.directorLastName.trim(),
        position: registrationData.directorPosition.trim(),
        phone: registrationData.directorPhone.trim(),
        email: registrationData.directorEmail.toLowerCase().trim()
      },

      // Спортивна діяльність
      sportTypes: registrationData.sportTypes,
      establishedYear: registrationData.establishedYear,
      membersCount: registrationData.membersCount,
      ageGroups: registrationData.ageGroups?.trim() || '',
      facilities: registrationData.facilities?.trim() || '',
      achievements: registrationData.achievements?.trim() || '',

      // Тренерський склад
      coaching: {
        coachesCount: registrationData.coachesCount || '',
        qualifiedCoachesCount: registrationData.qualifiedCoachesCount || '',
        headCoachName: registrationData.headCoachName?.trim() || '',
        headCoachQualification: registrationData.headCoachQualification?.trim() || ''
      },

      // Планування та цілі
      goals: registrationData.goals?.trim() || '',
      plannedActivities: registrationData.plannedActivities?.trim() || '',
      cooperationInterests: registrationData.cooperationInterests?.trim() || '',

      // Згоди
      consents: {
        dataProcessing: registrationData.dataProcessingConsent,
        rulesAcceptance: registrationData.rulesAcceptance,
        ethicsCodeAcceptance: registrationData.ethicsCodeAcceptance,
        mediaConsent: registrationData.mediaConsent || false
      },

      // Системні поля
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Зберігаємо реєстрацію
    clubRegistrations.push(clubRegistration);

    console.log('✅ Нова реєстрація клубу:', {
      id: clubRegistration.id,
      clubName: clubRegistration.clubName,
      organizationType: clubRegistration.organizationType,
      email: clubRegistration.email,
      director: `${clubRegistration.director.firstName} ${clubRegistration.director.lastName}`
    });

    // TODO: Відправити email підтвердження
    // TODO: Сповістити адміністраторів
    // TODO: Створити завдання для перевірки документів

    return NextResponse.json({
      success: true,
      message: 'Заявку на реєстрацію клубу успішно подано',
      registration: {
        id: clubRegistration.id,
        registrationNumber: `FUSAF-CLUB-${clubRegistration.id.substr(-8).toUpperCase()}`,
        status: clubRegistration.status,
        registrationDate: clubRegistration.registrationDate
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Помилка реєстрації клубу:', error);

    return NextResponse.json(
      { error: 'Помилка сервера при реєстрації' },
      { status: 500 }
    );
  }
}

// GET для перевірки статусу реєстрації
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Необхідна авторизація' },
        { status: 401 }
      );
    }

    // Знаходимо реєстрації користувача
    const userRegistrations = clubRegistrations.filter(
      reg => reg.userId === session.user.id
    );

    return NextResponse.json({
      success: true,
      registrations: userRegistrations.map(reg => ({
        id: reg.id,
        registrationNumber: `FUSAF-CLUB-${reg.id.substr(-8).toUpperCase()}`,
        status: reg.status,
        registrationDate: reg.registrationDate,
        clubName: reg.clubName,
        organizationType: reg.organizationType
      }))
    });

  } catch (error) {
    console.error('❌ Помилка отримання реєстрацій:', error);
    return NextResponse.json(
      { error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
