import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock POST /api/competitions/[id]/individual-registration
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Необхідна аутентифікація' },
        { status: 401 }
      );
    }

    const { id: competitionId } = await params;
    const registrationData = await request.json();

    console.log(`📝 Mock індивідуальна реєстрація на змагання ${competitionId}:`, registrationData);

    // Mock successful registration
    const mockRegistration = {
      id: `reg_${Date.now()}`,
      competitionId,
      userId: session.user.id,
      status: 'confirmed',
      registrationNumber: `FUSAF${Date.now()}`,
      registrationDate: new Date().toISOString(),
      participantInfo: {
        firstName: registrationData.firstName || 'Тест',
        lastName: registrationData.lastName || 'Користувач',
        dateOfBirth: registrationData.dateOfBirth || '1990-01-01',
        category: registrationData.category || 'Individual',
        ageGroup: registrationData.ageGroup || 'Open'
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Реєстрація успішно завершена',
      registration: mockRegistration
    });

  } catch (error) {
    console.error('Error in individual registration:', error);
    return NextResponse.json(
      { error: 'Помилка при реєстрації' },
      { status: 500 }
    );
  }
}

// Mock GET to fetch registration details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Необхідна аутентифікація' },
      { status: 401 }
    );
  }

  const { id: competitionId } = await params;

  // Mock competition data
  const mockCompetition = {
    id: competitionId,
    title: 'Чемпіонат України зі спортивної аеробіки',
    date: '2025-02-15',
    status: 'registration_open',
    location: 'Київ, Палац спорту',
    registrationDeadline: '2025-02-10',
    maxParticipants: 100,
    currentParticipants: 25,
    entryFee: 300,
    availableCategories: ['Individual', 'Pairs', 'Groups'],
    ageGroups: ['Junior', 'Senior', 'Open']
  };

  return NextResponse.json({
    success: true,
    competition: mockCompetition
  });
}
