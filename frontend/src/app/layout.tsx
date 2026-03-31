import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { FocusModeProvider } from "../context/FocusModeContext";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Socratic AI Tutor - Learn by Thinking",
  description: "Experience a learning environment designed for deep focus and academic rigor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${jakartaSans.variable} ${inter.variable} bg-surface dark:bg-black text-on-surface dark:text-gray-200 selection:bg-primary-fixed selection:text-on-primary-fixed transition-colors duration-300 font-body`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FocusModeProvider>{children}</FocusModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
