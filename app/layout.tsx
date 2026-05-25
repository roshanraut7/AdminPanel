import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-porvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});;

export const metadata: Metadata = {
  title: "PasalGuff",
  description: "PasalGuff authentication and community platform",
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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
       <main className="min-h-screen">
          {children}
      </main>
      </ThemeProvider>
    <Toaster />

      </body>
    </html>
  );
}
