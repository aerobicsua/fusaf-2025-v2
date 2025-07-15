import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Мок сховище для реєстрацій спортсменів
let athleteRegistrations: any[] = [];

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
      'firstName', 'lastName', 'dateOfBirth', 'gender',
      'email', 'phone', 'city', 'experience', 'category',
      'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation'
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

    // Перевірка валідності email
    if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
      return NextResponse.json(
        { error: 'Введіть коректний email' },
        { status: 400 }
      );
    }

    // Перевірка валідності телефону
    if (!/^\+?[\d\s\-\(\)]+$/.test(registrationData.phone)) {
      return NextResponse.json(
        { error: 'Введіть коректний номер телефону' },
        { status: 400 }
      );
    }

    // Перевірка унікальності email для спортсменів
    const existingRegistration = athleteRegistrations.find(
      reg => reg.email.toLowerCase() === registrationData.email.toLowerCase()
    );

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Користувач з такою поштою вже зареєстрований як спортсмен' },
        { status: 409 }
      );
    }

    // Перевірка віку
    const birthDate = new Date(registrationData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 6) {
      return NextResponse.json(
        { error: 'Мінімальний вік для реєстрації - 6 років' },
        { status: 400 }
      );
    }

    // Створюємо реєстрацію спортсмена
    const athleteRegistration = {
      id: `athlete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: session.user.id,
      registrationDate: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected

      // Особисті дані
      firstName: registrationData.firstName.trim(),
      lastName: registrationData.lastName.trim(),
      dateOfBirth: registrationData.dateOfBirth,
      gender: registrationData.gender,
      age: age,

      // Контактна інформація
      email: registrationData.email.toLowerCase().trim(),
      phone: registrationData.phone.trim(),
      address: registrationData.address?.trim() || '',
      city: registrationData.city.trim(),

      // Спортивна інформація
      experience: registrationData.experience,
      category: registrationData.category,
      previousClub: registrationData.previousClub?.trim() || '',
      achievements: registrationData.achievements?.trim() || '',

      // Медична інформація
      hasMedicalClearance: registrationData.hasMedicalClearance || false,
      medicalConditions: registrationData.medicalConditions?.trim() || '',

      // Контакт екстреної допомоги
      emergencyContact: {
        name: registrationData.emergencyContactName.trim(),
        phone: registrationData.emergencyContactPhone.trim(),
        relation: registrationData.emergencyContactRelation
      },

      // Згоди
      consents: {
        dataProcessing: registrationData.dataProcessingConsent,
        rulesAcceptance: registrationData.rulesAcceptance,
        photoConsent: registrationData.photoConsent || false
      },

      // Системні поля
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Зберігаємо реєстрацію
    athleteRegistrations.push(athleteRegistration);

    console.log('✅ Нова реєстрація спортсмена:', {
      id: athleteRegistration.id,
      email: athleteRegistration.email,
      name: `${athleteRegistration.firstName} ${athleteRegistration.lastName}`,
      category: athleteRegistration.category,
      experience: athleteRegistration.experience
    });

    // TODO: Відправити email підтвердження
    // TODO: Сповістити адміністраторів
    // TODO: Створити завдання для перевірки документів

    return NextResponse.json({
      success: true,
      message: 'Реєстрацію спортсмена успішно завершено',
      registration: {
        id: athleteRegistration.id,
        registrationNumber: `FUSAF-ATH-${athleteRegistration.id.substr(-8).toUpperCase()}`,
        status: athleteRegistration.status,
        registrationDate: athleteRegistration.registrationDate
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Помилка реєстрації спортсмена:', error);

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
    const userRegistrations = athleteRegistrations.filter(
      reg => reg.userId === session.user.id
    );

    return NextResponse.json({
      success: true,
      registrations: userRegistrations.map(reg => ({
        id: reg.id,
        registrationNumber: `FUSAF-ATH-${reg.id.substr(-8).toUpperCase()}`,
        status: reg.status,
        registrationDate: reg.registrationDate,
        category: reg.category,
        experience: reg.experience
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
