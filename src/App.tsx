import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SectionDivider, SectionReveal } from '@/components/SectionTransition';
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
      <div className="min-h-screen bg-[#FAF8F5] text-[#192434] overflow-x-clip">
        {/* Header */}
        <Header />

        {/* Main Content with Subtle Minimalist Section Dividers & Progressive Scroll Reveal */}
        <main className="overflow-x-clip">
          {/* 1. Hero Section (Kept 100% intact) */}
          <Hero />

          <SectionDivider variant="sand-to-cream" />

          {/* 2. Product Catalog */}
          <SectionReveal yOffset={24}>
            <Products />
          </SectionReveal>

          <SectionDivider variant="cream-to-cream" />

          {/* 3. Scrollytelling Artesanal · Dosquebradas (<canvas> 75 frames) */}
          <Storyboard />

          <SectionDivider variant="cream-to-sand" />

          {/* 4. About & "Ver nuestra historia" 3-Video Grid */}
          <SectionReveal yOffset={24}>
            <About />
          </SectionReveal>

          <SectionDivider variant="sand-to-cream" />

          {/* 5. Testimonials & FAQ with Automatic Dosquebradas Landscape Slideshow */}
          <SectionReveal yOffset={24}>
            <Testimonials />
          </SectionReveal>

          <SectionDivider variant="cream-to-cream" />

          {/* 6. Portion Calculator & Newsletter */}
          <SectionReveal yOffset={24}>
            <Newsletter />
          </SectionReveal>

          <SectionDivider variant="cream-to-white" />

          {/* 7. Contact & Direct WhatsApp */}
          <SectionReveal yOffset={24}>
            <Contact />
          </SectionReveal>

          <SectionDivider variant="white-to-sky" />
        </main>

        {/* Footer with "Síguenos en nuestras redes" */}
        <SectionReveal yOffset={18}>
          <Footer />
        </SectionReveal>

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
