export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      {children}
    </section>
  );
}
