// app/(main)/layout.tsx
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation user={null} cartCount={0} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}