import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AthletesStorage, type Athlete } from '@/lib/athletes-storage';

// GET - отримати список спортсменів з фільтрацією
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const discipline = url.searchParams.get('discipline');
    const country = url.searchParams.get('country');
    const license = url.searchParams.get('license');
    const surname = url.searchParams.get('surname');
    const status = url.searchParams.get('status');

    console.log('🏆 GET /api/athletes з фільтрами:', {
      discipline, country, license, surname, status
    });

    // Застосовуємо фільтри
    const athletes = AthletesStorage.filter({
      discipline: discipline || undefined,
      country: country || undefined,
      license: license || undefined,
      surname: surname || undefined,
      status: status || undefined
    });

    const stats = AthletesStorage.getStats();

    return NextResponse.json({
      athletes: athletes.map(athlete => ({
        ...athlete,
        // Приховуємо чутливу інформацію в публічному API
        email: athlete.email.replace(/(.{2}).*(@.*)/, '$1***$2')
      })),
      total: athletes.length,
      filters: { discipline, country, license, surname, status },
      stats,
      debug: {
        storageType: 'ATHLETES_STORAGE',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Помилка GET /api/athletes:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження спортсменів' },
      { status: 500 }
    );
  }
}

// POST - додати нового спортсмена (тільки для адмінів)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Недостатньо прав для додавання спортсменів' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const athleteData: Partial<Athlete> = body;

    // Валідація обов'язкових полів
    if (!athleteData.firstName || !athleteData.lastName || !athleteData.email) {
      return NextResponse.json(
        { error: 'Обов\'язкові поля: firstName, lastName, email' },
        { status: 400 }
      );
    }

    // Перевіряємо чи спортсмен вже існує
    const existing = AthletesStorage.findByEmail(athleteData.email!);
    if (existing) {
      return NextResponse.json(
        { error: 'Спортсмен з таким email вже існує' },
        { status: 409 }
      );
    }

    // Створюємо нового спортсмена
    const newAthlete: Athlete = {
      id: `athlete-${Date.now()}`,
      license: athleteData.license || `FUSAF-${Date.now()}`,
      title: athleteData.title || '',
      lastName: athleteData.lastName!,
      firstName: athleteData.firstName!,
      email: athleteData.email!,
      gender: athleteData.gender || 'female',
      country: athleteData.country || 'Україна',
      placeOfBirth: athleteData.placeOfBirth || '',
      yearOfBirth: athleteData.yearOfBirth,
      disciplines: athleteData.disciplines || ['Спортивна аеробіка'],
      club: athleteData.club || '',
      coach: athleteData.coach || '',
      profileImage: athleteData.profileImage || '',
      biography: athleteData.biography || '',
      media: athleteData.media || [],
      achievements: athleteData.achievements || [],
      results: athleteData.results || [],
      personalBests: athleteData.personalBests || {},
      registrationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'active',
      visibility: 'public'
    };

    AthletesStorage.add(newAthlete);

    console.log('✅ Додано нового спортсмена:', {
      id: newAthlete.id,
      name: `${newAthlete.firstName} ${newAthlete.lastName}`,
      email: newAthlete.email
    });

    return NextResponse.json({
      message: 'Спортсмена успішно додано',
      athlete: newAthlete
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Помилка POST /api/athletes:', error);
    return NextResponse.json(
      { error: 'Помилка створення спортсмена' },
      { status: 500 }
    );
  }
}

// PUT - оновити інформацію про спортсмена (тільки для адмінів)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Недостатньо прав для редагування спортсменів' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { athleteId, ...updates } = body;

    if (!athleteId) {
      return NextResponse.json(
        { error: 'Не вказано ID спортсмена' },
        { status: 400 }
      );
    }

    const success = AthletesStorage.update(athleteId, updates);

    if (!success) {
      return NextResponse.json(
        { error: 'Спортсмена не знайдено' },
        { status: 404 }
      );
    }

    console.log('✅ Оновлено спортсмена:', athleteId);

    return NextResponse.json({
      message: 'Інформацію про спортсмена оновлено',
      athleteId
    });

  } catch (error) {
    console.error('❌ Помилка PUT /api/athletes:', error);
    return NextResponse.json(
      { error: 'Помилка оновлення спортсмена' },
      { status: 500 }
    );
  }
}

// DELETE - видалити спортсмена (тільки для адмінів)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Недостатньо прав для видалення спортсменів' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const athleteId = url.searchParams.get('id');

    if (!athleteId) {
      return NextResponse.json(
        { error: 'Не вказано ID спортсмена' },
        { status: 400 }
      );
    }

    // Не можна видалити адміністратора
    const athlete = AthletesStorage.findById(athleteId);
    if (athlete?.email === 'andfedos@gmail.com') {
      return NextResponse.json(
        { error: 'Не можна видалити адміністратора' },
        { status: 403 }
      );
    }

    const success = AthletesStorage.remove(athleteId);

    if (!success) {
      return NextResponse.json(
        { error: 'Спортсмена не знайдено' },
        { status: 404 }
      );
    }

    console.log('🗑️ Видалено спортсмена:', athleteId);

    return NextResponse.json({
      message: 'Спортсмена видалено',
      athleteId
    });

  } catch (error) {
    console.error('❌ Помилка DELETE /api/athletes:', error);
    return NextResponse.json(
      { error: 'Помилка видалення спортсмена' },
      { status: 500 }
    );
  }
}
