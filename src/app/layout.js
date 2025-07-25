'use client';

import { SessionProvider } from 'next-auth/react';
import { Montserrat } from "next/font/google";
import "./globals.css"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const montserrat = Montserrat({ weight: '400', subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="flex flex-col min-h-screen">
      <SessionProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
      </SessionProvider>
      </body>
    </html>
  );
}
