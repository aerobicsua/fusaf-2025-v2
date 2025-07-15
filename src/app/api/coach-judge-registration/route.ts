import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Інтерфейс для реєстрації тренера/судді
interface CoachJudgeRegistration {
  id: string;
  userId: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';

  // Особисті дані
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;

  // Контактна інформація
  email: string;
  phone: string;
  address: string;
  city: string;

  // Професійна інформація
  education: string;
  specialization: string;
  experience: string;
  currentPosition: string;
  workPlace: string;
  certifications: string;
  achievements: string;

  // Тренерська/суддівська діяльність
  coachingExperience: string;
  judgingExperience: string;
  preferredRole: string;
  languageSkills: string;

  // Контакт екстреної допомоги
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };

  // Згоди
  consents: {
    dataProcessing: boolean;
    rulesAcceptance: boolean;
    ethicsCodeAcceptance: boolean;
    photoConsent: boolean;
  };

  createdAt: string;
  updatedAt: string;
}

// Мок сховище для реєстрацій тренерів/суддів
let coachJudgeRegistrations: CoachJudgeRegistration[] = [];

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
      'email', 'phone', 'city', 'education', 'specialization',
      'experience', 'preferredRole', 'emergencyContactName',
      'emergencyContactPhone', 'emergencyContactRelation'
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
        { error: 'Введіть коректний email' },
        { status: 400 }
      );
    }

    // Перевірка унікальності email для тренерів/суддів
    const existingRegistration = coachJudgeRegistrations.find(
      reg => reg.email.toLowerCase() === registrationData.email.toLowerCase()
    );

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Користувач з такою поштою вже зареєстрований як тренер/суддя' },
        { status: 409 }
      );
    }

    // Створюємо реєстрацію тренера/судді
    const coachJudgeRegistration: CoachJudgeRegistration = {
      id: `coach_judge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: session.user.id,
      registrationDate: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected

      // Особисті дані
      firstName: registrationData.firstName.trim(),
      lastName: registrationData.lastName.trim(),
      dateOfBirth: registrationData.dateOfBirth,
      gender: registrationData.gender,

      // Контактна інформація
      email: registrationData.email.toLowerCase().trim(),
      phone: registrationData.phone.trim(),
      address: registrationData.address?.trim() || '',
      city: registrationData.city.trim(),

      // Професійна інформація
      education: registrationData.education,
      specialization: registrationData.specialization,
      experience: registrationData.experience,
      currentPosition: registrationData.currentPosition?.trim() || '',
      workPlace: registrationData.workPlace?.trim() || '',
      certifications: registrationData.certifications?.trim() || '',
      achievements: registrationData.achievements?.trim() || '',

      // Тренерська/суддівська діяльність
      coachingExperience: registrationData.coachingExperience || '',
      judgingExperience: registrationData.judgingExperience || '',
      preferredRole: registrationData.preferredRole,
      languageSkills: registrationData.languageSkills?.trim() || '',

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
        ethicsCodeAcceptance: registrationData.ethicsCodeAcceptance,
        photoConsent: registrationData.photoConsent || false
      },

      // Системні поля
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Зберігаємо реєстрацію
    coachJudgeRegistrations.push(coachJudgeRegistration);

    console.log('✅ Нова реєстрація тренера/судді:', {
      id: coachJudgeRegistration.id,
      email: coachJudgeRegistration.email,
      name: `${coachJudgeRegistration.firstName} ${coachJudgeRegistration.lastName}`,
      preferredRole: coachJudgeRegistration.preferredRole,
      specialization: coachJudgeRegistration.specialization
    });

    // TODO: Відправити email підтвердження
    // TODO: Сповістити адміністраторів
    // TODO: Створити завдання для перевірки документів

    return NextResponse.json({
      success: true,
      message: 'Заявку на статус тренера/судді успішно подано',
      registration: {
        id: coachJudgeRegistration.id,
        registrationNumber: `FUSAF-CJ-${coachJudgeRegistration.id.substr(-8).toUpperCase()}`,
        status: coachJudgeRegistration.status,
        registrationDate: coachJudgeRegistration.registrationDate
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Помилка реєстрації тренера/судді:', error);

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
    const userRegistrations = coachJudgeRegistrations.filter(
      reg => reg.userId === session.user.id
    );

    return NextResponse.json({
      success: true,
      registrations: userRegistrations.map(reg => ({
        id: reg.id,
        registrationNumber: `FUSAF-CJ-${reg.id.substr(-8).toUpperCase()}`,
        status: reg.status,
        registrationDate: reg.registrationDate,
        preferredRole: reg.preferredRole,
        specialization: reg.specialization
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
