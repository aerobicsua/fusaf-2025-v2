import { NextResponse } from 'next/server';
import { AthletesStorage } from '@/lib/athletes-storage';

// GET - отримати деталі спортсмена за ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const athleteId = params.id;

    console.log('🏆 GET /api/athletes/[id] для ID:', athleteId);

    const athlete = AthletesStorage.findById(athleteId);

    if (!athlete) {
      return NextResponse.json(
        { error: 'Спортсмена не знайдено' },
        { status: 404 }
      );
    }

    // Повертаємо повну інформацію (email прихований для безпеки)
    const athleteDetails = {
      ...athlete,
      email: athlete.email.replace(/(.{2}).*(@.*)/, '$1***$2')
    };

    return NextResponse.json({
      athlete: athleteDetails,
      debug: {
        storageType: 'ATHLETES_STORAGE',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Помилка GET /api/athletes/[id]:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження деталей спортсмена' },
      { status: 500 }
    );
  }
}
