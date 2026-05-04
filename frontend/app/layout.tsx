import "./globals.css";

export const metadata = {
  title: "Team Task Manager",
  description: "Full-stack task manager app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-cream">
      <body className="min-h-screen bg-cream font-sans text-body text-oncream antialiased">{children}</body>
    </html>
  );
}
