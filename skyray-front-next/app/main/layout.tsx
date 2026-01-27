import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { QuotationProvider } from "@/app/context/QuotationContext";
import QuotationModal from "@/app/components/QuotationModal";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuotationProvider>
      <Navigation user={{ name: "Guest" }} cartCount={0} />
      <main className="flex-grow">
        {children}
      </main>
      <QuotationModal />
      <Footer />
    </QuotationProvider>
  );
}