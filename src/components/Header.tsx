"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, User, LogIn, LogOut, Settings, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  const handleSignOut = () => {
    signOut();
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "athlete":
        return "Спортсмен";
      case "club_owner":
        return "Власник клубу";
      case "coach_judge":
        return "Тренер/Суддя";
      case "admin":
        return "Адміністратор";
      default:
        return "Користувач";
    }
  };

  const getRolesLabels = (roles: string[] | undefined) => {
    if (!roles || roles.length === 0) return "Користувач";
    if (roles.includes("admin")) return "Адміністратор";

    const labels = roles.map(role => {
      switch (role) {
        case "athlete": return "Спортсмен";
        case "club_owner": return "Власник клубу";
        case "coach_judge": return "Тренер/Суддя";
        default: return "";
      }
    }).filter(Boolean);

    return labels.join(" + ") || "Користувач";
  };

  const getDashboardLink = (role: string) => {
    // Адмін завжди йде в адмін панель
    if (role === "admin") return "/admin";

    switch (role) {
      case "athlete":
        return "/athlete-panel";
      case "club_owner":
        return "/dashboard/club-owner";
      case "coach_judge":
        return "/dashboard/coach-judge";
      default:
        return "/dashboard";
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-3">
            <Logo className="h-12 w-auto" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900">Федерація України</span>
              <span className="text-sm text-gray-600 -mt-1">зі Спортивної Аеробіки і Фітнесу</span>
              <span className="text-xs text-blue-600 font-medium">fusaf.org.ua</span>
            </div>
          </Link>

          {/* Десктопна навігація */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/membership" className="text-gray-700 hover:text-pink-600 px-4 py-2">
                  Членство
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-pink-600">
                  Змагання
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] grid gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <Link href="/competitions" className="block p-3 rounded-lg hover:bg-gray-50">
                        <div className="text-sm font-medium">Календар змагань</div>
                        <div className="text-xs text-gray-500">Перегляд усіх змагань</div>
                      </Link>
                    </NavigationMenuLink>
                    {/* Завжди показуємо посилання для тестування */}
                    <NavigationMenuLink asChild>
                      <Link href="/competitions/create" className="block p-3 rounded-lg hover:bg-gray-50 bg-blue-50">
                        <div className="text-sm font-medium">🔥 Створити змагання (ТЕСТ)</div>
                        <div className="text-xs text-gray-500">Пряме посилання без перевірок</div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/competitions/results" className="block p-3 rounded-lg hover:bg-gray-50">
                        <div className="text-sm font-medium">Результати</div>
                        <div className="text-xs text-gray-500">Результати змагань</div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/courses" className="text-gray-700 hover:text-pink-600 px-4 py-2">
                  Курси
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/news" className="text-gray-700 hover:text-pink-600 px-4 py-2">
                  Новини
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/clubs" className="text-gray-700 hover:text-pink-600 px-4 py-2">
                  Клуби
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/instructions" className="text-gray-700 hover:text-pink-600 px-4 py-2">
                  Інструкції
                </Link>
              </NavigationMenuItem>

              {/* Кнопка адмін тільки для конкретного користувача */}
              {session?.user?.email === 'andfedos@gmail.com' && (
                <Link href="/admin">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg shadow-md">
                    ⚡ Адмін
                  </Button>
                </Link>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Права частина */}
          <div className="flex items-center space-x-4">
            {/* Пошук */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* Аутентифікація */}
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-sm font-medium">{session.user?.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {getRolesLabels(session.user?.roles)}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Профіль
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink(session.user?.roles?.[0] || "")} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Панель управління
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Вийти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  onClick={() => router.push('/auth/signin')}
                  variant="outline"
                  className="text-pink-600 border-pink-600 hover:bg-pink-50"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Вхід
                </Button>
                <Button
                  onClick={() => router.push('/auth/signup')}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <User className="mr-2 h-4 w-4" />
                  Реєстрація
                </Button>
              </div>
            )}

            {/* Мобільне меню */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Мобільна навігація */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white py-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/membership" className="px-4 py-2 text-gray-700 hover:text-pink-600">
                Членство
              </Link>
              <Link href="/competitions" className="px-4 py-2 text-gray-700 hover:text-pink-600">
                Змагання
              </Link>
              <Link href="/courses" className="px-4 py-2 text-gray-700 hover:text-pink-600">
                Курси
              </Link>
              <Link href="/news" className="px-4 py-2 text-gray-700 hover:text-pink-600">
                Новини
              </Link>
              <Link href="/clubs" className="px-4 py-2 text-gray-700 hover:text-pink-600">
                Клуби
              </Link>
              <Link href="/instructions" className="px-4 py-2 text-gray-700 hover:text-pink-600">
                Інструкції
              </Link>
              <div className="px-4 pt-4 border-t">
                {session ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Привіт, {session.user?.name}!
                    </div>
                    <Button onClick={handleSignOut} variant="outline" className="w-full">
                      Вийти
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={() => router.push('/auth/signin')}
                      variant="outline"
                      className="w-full text-pink-600 border-pink-600"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Вхід
                    </Button>
                    <Button
                      onClick={() => router.push('/auth/signup')}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Реєстрація
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
