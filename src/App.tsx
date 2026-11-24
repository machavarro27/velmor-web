import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SectionDivider, SectionReveal } from '@/components/SectionTransition';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { Products } from '@/sections/Products';
import { HowToBuy } from '@/sections/HowToBuy';
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

        {/* Main Content — Ordered: 1. Hero -> 2. Products -> 3. HowToBuy -> 4. Storyboard -> 5. About -> 6. Testimonials -> 7. Newsletter -> 8. Contact */}
        <main className="overflow-x-clip">
          {/* 1. Inicio / Hero Principal */}
          <Hero />

          <SectionDivider variant="cream-to-cream" />

          {/* 2. Productos / Catálogo */}
          <SectionReveal yOffset={24}>
            <Products />
          </SectionReveal>

          <SectionDivider variant="cream-to-sand" />

          {/* 3. Cómo comprar (Reubicado inmediatamente después de Productos) */}
          <SectionReveal yOffset={24}>
            <HowToBuy />
          </SectionReveal>

          <SectionDivider variant="sand-to-cream" />

          {/* 4. Galería Horizontal Artesanal · Dosquebradas (Sin bloqueo de scroll vertical) */}
          <SectionReveal yOffset={24}>
            <Storyboard />
          </SectionReveal>

          <SectionDivider variant="cream-to-sand" />

          {/* 5. Nosotros & "Ver nuestra historia" */}
          <SectionReveal yOffset={24}>
            <About />
          </SectionReveal>

          <SectionDivider variant="sand-to-cream" />

          {/* 6. Testimonios & Preguntas Frecuentes */}
          <SectionReveal yOffset={24}>
            <Testimonials />
          </SectionReveal>

          <SectionDivider variant="cream-to-cream" />

          {/* 7. Calculadora de Porciones & Newsletter */}
          <SectionReveal yOffset={24}>
            <Newsletter />
          </SectionReveal>

          <SectionDivider variant="cream-to-white" />

          {/* 8. Contáctanos */}
          <SectionReveal yOffset={24}>
            <Contact />
          </SectionReveal>

          <SectionDivider variant="white-to-sky" />
        </main>

        {/* Footer con "Síguenos en nuestras redes" */}
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
