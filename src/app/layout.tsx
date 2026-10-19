import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPR Engine PDF - Suíte de Edição & Manipulação",
  description: "Alternativa web moderna e completa para visualização, anotações, desenhos, rotação, reordenação e exportação de PDFs de alta fidelidade.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-brand-dark text-brand-text antialiased select-none">
        {children}
      </body>
    </html>
  );
}
