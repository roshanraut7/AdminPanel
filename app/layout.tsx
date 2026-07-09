import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/components/redux/provider";
import { ThemeProvider } from "@/components/theme/theme-porvider";
import { AdminThemeLoader } from "@/components/theme/theme-loader";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KamKuro",
  description: "KamKuro authentication and community platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AdminThemeLoader />

            <main className="min-h-screen">{children}</main>

            <Toaster />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}