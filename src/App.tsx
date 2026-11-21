import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { Products } from '@/sections/Products';
import { Storyboard } from '@/sections/Storyboard';
import { About } from '@/sections/About';
import { Testimonials } from '@/sections/Testimonials';
import { Newsletter } from '@/sections/Newsletter';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { LoginModal } from '@/components/LoginModal';
import { Chatbot } from '@/components/Chatbot';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#FAF8F5] text-[#192434] overflow-x-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="overflow-x-hidden">
          <Hero />
          <Products />
          <Storyboard />
          <About />
          <Testimonials />
          <Newsletter />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Modals & Drawers */}
        <CartDrawer />
        <LoginModal />

        {/* Floating Elements */}
        <Chatbot />

        {/* Toast Notifications - Fast 1.2s Duration */}
        <Toaster
          position="top-right"
          duration={1200}
          visibleToasts={1}
          richColors
          closeButton
          toastOptions={{
            duration: 1200,
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
