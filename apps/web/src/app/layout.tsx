import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ConnectivityBanner } from "@/components/offline/connectivity-banner";
import { ServiceWorkerRegister } from "@/components/offline/service-worker-register";
export const metadata: Metadata = { title: "EduAdapt — Personalized Blended Learning", description: "Personalized learning for overcrowded classrooms. Offline-first, topic-level analysis, teacher intervention radar." };
export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <ConnectivityBanner />
          {children}
        </Providers>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
