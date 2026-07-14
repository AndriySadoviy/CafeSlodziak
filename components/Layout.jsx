import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-brand-light-cream">
      <Navbar />
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-5 sm:py-8 bg-brand-light-cream safe-bottom">
        {children}
      </main>
      <Footer />
    </div>
  );
}