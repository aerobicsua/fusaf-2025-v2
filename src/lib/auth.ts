import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'
import bcrypt from 'bcryptjs'

// Тимчасове сховище користувачів (замість бази даних)
const users = [
  {
    id: '1',
    email: 'andfedos@gmail.com',
    name: 'Андрій Федосенко',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewaBnBdmcvrZub.', // password123
    roles: ['admin', 'user']
  },
  {
    id: '2',
    email: 'coach@fusaf.org.ua',
    name: 'Тренер ФУСАФ',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewaBnBdmcvrZub.', // password123
    roles: ['coach_judge', 'user']
  },
  {
    id: '3',
    email: 'athlete@fusaf.org.ua',
    name: 'Спортсмен ФУСАФ',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewaBnBdmcvrZub.', // password123
    roles: ['athlete', 'user']
  }
]

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 години
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email та пароль обов\'язкові')
        }

        console.log('🔐 Спроба авторизації:', credentials.email)

        const user = users.find(u => u.email === credentials.email)

        if (!user) {
          console.log('❌ Користувача не знайдено:', credentials.email)
          throw new Error('Невірні облікові дані')
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password)

        if (!isValidPassword) {
          console.log('❌ Невірний пароль для:', credentials.email)
          throw new Error('Невірні облікові дані')
        }

        console.log('✅ Успішна авторизація:', user.email, 'Ролі:', user.roles)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.roles = user.roles || ['user']
        token.id = user.id
        console.log('🎫 JWT створено для:', user.email, 'Ролі:', token.roles)
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.roles = token.roles as string[]
        console.log('👤 Сесія створена для:', session.user.email, 'Ролі:', session.user.roles)
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fusaf-secret-key-2025',
  debug: process.env.NODE_ENV === 'development',
}

// Функція для реєстрації нового користувача
export async function registerUser(email: string, password: string, name: string) {
  // Перевіряємо чи користувач вже існує
  const existingUser = users.find(u => u.email === email)
  if (existingUser) {
    throw new Error('Користувач з такою поштою вже існує')
  }

  // Хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 12)

  // Створюємо нового користувача
  const newUser = {
    id: (users.length + 1).toString(),
    email,
    name,
    password: hashedPassword,
    roles: ['athlete', 'user'] // За замовчуванням - спортсмен
  }

  users.push(newUser)
  console.log('✅ Новий користувач зареєстрований:', email)

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    roles: newUser.roles
  }
}

// Функція для зміни ролей користувача (тільки для адмінів)
export function updateUserRoles(userId: string, newRoles: string[]) {
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex === -1) {
    throw new Error('Користувача не знайдено')
  }

  users[userIndex].roles = newRoles
  console.log('✅ Ролі оновлено для користувача:', users[userIndex].email, 'Нові ролі:', newRoles)

  return users[userIndex]
}

// Функція для отримання всіх користувачів (тільки для адмінів)
export function getAllUsers() {
  return users.map(({ password, ...user }) => user) // Виключаємо пароль
}

// Типи для ролей користувачів
export enum UserRole {
  ATHLETE = "athlete",
  CLUB_OWNER = "club_owner",
  COACH_JUDGE = "coach_judge",
  ADMIN = "admin",
  USER = "user"
}

// Функції для перевірки ролей
export const hasRole = (userRoles: string[] | undefined, requiredRole: string): boolean => {
  return userRoles?.includes(requiredRole) || userRoles?.includes("admin") || false;
};

export const hasAnyRole = (userRoles: string[] | undefined, requiredRoles: string[]): boolean => {
  if (!userRoles) return false;
  if (userRoles.includes("admin")) return true; // Адмін має всі права
  return requiredRoles.some(role => userRoles.includes(role));
};

export const canRegisterTeams = (userRoles: string[] | undefined): boolean => {
  return hasAnyRole(userRoles, ["club_owner", "coach_judge", "admin"]);
};

export const canRegisterIndividual = (userRoles: string[] | undefined): boolean => {
  return hasAnyRole(userRoles, ["athlete", "club_owner", "coach_judge", "admin"]);
};

// Розширення типів NextAuth
declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[];
    // primaryRole?: string;
    // role?: string; // Зворотна сумісність
    // roleRequest?: {
    //   status: 'pending' | 'approved' | 'rejected';
    //   requestedRole: string;
    //   requestDate: string;
    // } | null;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: string[];
      // primaryRole?: string;
      // role?: string; // Зворотна сумісність
      // roleRequest?: {
      //   status: 'pending' | 'approved' | 'rejected';
      //   requestedRole: string;
      //   requestDate: string;
      // } | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    roles?: string[];
    // primaryRole?: string;
    // role?: string; // Зворотна сумісність
    // roleRequest?: {
    //   status: 'pending' | 'approved' | 'rejected';
    //   requestedRole: string;
    //   requestDate: string;
    // } | null;
  }
}
