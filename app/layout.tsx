import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { MedicalStoreProvider } from "@/lib/MedicalStoreProvider";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "n/avi",
  description: "Navigate the medical system with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MedicalStoreProvider>
            <Navbar />
            <main className="pt-12">{children}</main>
            <Toaster />
          </MedicalStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}