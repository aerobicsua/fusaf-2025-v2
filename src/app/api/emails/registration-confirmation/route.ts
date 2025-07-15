import { type NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Перевіряємо авторизацію через NextAuth
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      userEmail,
      userName,
      competitionTitle,
      competitionDate,
      competitionLocation,
      requiresPayment,
      entryFee
    } = await request.json();

    // Валідація даних
    if (!userEmail || !userName || !competitionTitle || !competitionDate || !competitionLocation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Відправляємо email
    await EmailService.sendRegistrationConfirmation(userEmail, {
      participantName: userName,
      competitionTitle,
      competitionDate,
      competitionTime: '10:00',
      location: competitionLocation,
      address: competitionLocation,
      category: 'індивідуальна',
      ageGroup: '18+',
      contactPerson: 'Адміністратор (+380441234567)',
      competitionUrl: 'https://fusaf.org.ua/competitions',
      dashboardUrl: 'https://fusaf.org.ua/dashboard'
    });

    return NextResponse.json({
      success: true,
      message: 'Registration confirmation email sent successfully'
    });

  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
