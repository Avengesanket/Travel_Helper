import { SessionProvider } from 'next-auth/react'; 
import { Montserrat } from "next/font/google";
import "./globals.css"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from '@/components/ThemeProvider'; 
import AuthProvider from '@/components/AuthProvider'; 

const montserrat = Montserrat({ weight: '400', subsets: ["latin"] });

export const metadata = {
  title: 'Travel Helper',
  description: 'Your one-stop destination for travel blogs and cost estimation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className} suppressHydrationWarning>
      <body>
        <AuthProvider>
            <ThemeProvider>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    {/* The main content area where pages will be rendered */}
                    <main className="flex-grow">
                      {children}
                    </main>
                    <Footer />
                </div>
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}