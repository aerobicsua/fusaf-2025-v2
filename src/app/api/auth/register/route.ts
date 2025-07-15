import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Валідація
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Всі поля обов\'язкові' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль повинен містити мінімум 6 символів' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Введіть коректну електронну пошту' },
        { status: 400 }
      );
    }

    // Реєструємо користувача
    const user = await registerUser(email, password, name);

    console.log('✅ Користувач зареєстрований:', user.email);

    return NextResponse.json({
      message: 'Користувач успішно зареєстрований',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Помилка реєстрації:', error);

    if (error.message === 'Користувач з такою поштою вже існує') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Помилка реєстрації користувача' },
      { status: 500 }
    );
  }
}
