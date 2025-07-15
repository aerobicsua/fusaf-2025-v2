"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
// ... existing code ... <all other imports>

// Компонент панелі спортсмена
function AthletePanelContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [showRoleRequestAlert, setShowRoleRequestAlert] = useState(false);

  // Перевірка параметру roleRequested
  useEffect(() => {
    // Безпечно отримуємо параметри після монтування
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('roleRequested') === 'true') {
        setShowRoleRequestAlert(true);
        // Очищаємо URL параметр
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

// ... existing code ... <rest of the component until the closing brace>
}

export default function AthletePanel() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Завантаження панелі...</p>
          </div>
        </div>
      </div>
    }>
      <AthletePanelContent />
    </Suspense>
  );
}
