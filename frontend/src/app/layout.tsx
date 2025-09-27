import BottomNavigation from "@/components/BottomNavigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./wallet/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Awesome App",
  description: "A cool app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {/* Background Image Container */}
        <div className="fixed inset-0 z-[-1] bg-[url('/logowname.svg')] bg-cover bg-center" />
        {/* Overlay */}
        <div className="fixed inset-0 z-[-1] bg-black/60" />

        <Providers>
          <main className="relative z-10 min-h-screen pb-16 flex flex-col items-center justify-start">
            {children}
          </main>
          <BottomNavigation />
        </Providers>
      </body>
    </html>
  );
}

