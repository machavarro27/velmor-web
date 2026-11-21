import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ThemeType, LanguageType, FilterState, User, ShippingInfo } from '@/types';

interface AppState {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  promoCode: string;
  discountPercent: number;
  shippingInfo: ShippingInfo;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  applyPromoCode: (code: string) => boolean;
  setShippingInfo: (info: Partial<ShippingInfo>) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;

  // Theme & Language
  theme: ThemeType;
  language: LanguageType;
  highContrast: boolean;
  soundEnabled: boolean;
  setTheme: (theme: ThemeType) => void;
  setLanguage: (lang: LanguageType) => void;
  toggleHighContrast: () => void;
  toggleSound: () => void;

  // Filters
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setSizeFilter: (size: FilterState['size']) => void;
  setFlavorFilter: (flavor: FilterState['flavor']) => void;
  resetFilters: () => void;

  // User
  user: User | null;
  isLoginOpen: boolean;
  setUser: (user: User | null) => void;
  setLoginOpen: (open: boolean) => void;
  toggleFavorite: (productId: string) => void;

  // Chatbot
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;

  // Compare
  compareList: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
}

const VALID_PROMO_CODES: Record<string, number> = {
  'VELMOR10': 10,
  'PRIMERA10': 10,
  'SKYR15': 15,
  'FAMILIA20': 20,
};

const defaultShippingInfo: ShippingInfo = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: 'Dosquebradas, Risaralda',
  neighborhood: '',
  postalCode: '',
  notes: '',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart State
      cart: [],
      isCartOpen: false,
      promoCode: '',
      discountPercent: 0,
      shippingInfo: defaultShippingInfo,

      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.product.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ cart: [], promoCode: '', discountPercent: 0 });
      },

      setCartOpen: (open) => set({ isCartOpen: open }),

      applyPromoCode: (code) => {
        const normalizedCode = code.toUpperCase().trim();
        const discount = VALID_PROMO_CODES[normalizedCode];
        if (discount) {
          set({ promoCode: normalizedCode, discountPercent: discount });
          return true;
        }
        return false;
      },

      setShippingInfo: (info) => {
        set((state) => ({
          shippingInfo: { ...state.shippingInfo, ...info },
        }));
      },

      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getCartTotal();
        return Math.round((subtotal * get().discountPercent) / 100);
      },

      getFinalTotal: () => {
        const subtotal = get().getCartTotal();
        const discount = get().getDiscountAmount();
        const shipping = subtotal >= 50000 ? 0 : 5000;
        return subtotal - discount + shipping;
      },

      // Theme & Language (Forced Nordic Light Theme)
      theme: 'nordic',
      language: 'es',
      highContrast: false,
      soundEnabled: false,

      setTheme: () => set({ theme: 'nordic' }),
      setLanguage: (language) => set({ language }),
      toggleHighContrast: () => set({ highContrast: false }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      // Filters
      filters: {
        search: '',
        size: 'all',
        flavor: 'all',
      },

      setSearchQuery: (search) =>
        set((state) => ({ filters: { ...state.filters, search } })),

      setSizeFilter: (size) =>
        set((state) => ({ filters: { ...state.filters, size } })),

      setFlavorFilter: (flavor) =>
        set((state) => ({ filters: { ...state.filters, flavor } })),

      resetFilters: () =>
        set({
          filters: { search: '', size: 'all', flavor: 'all' },
        }),

      // User
      user: null,
      isLoginOpen: false,
      setUser: (user) => set({ user }),
      setLoginOpen: (open) => set({ isLoginOpen: open }),
      toggleFavorite: (productId) => {
        const { user } = get();
        if (!user) return;
        const exists = user.favorites.includes(productId);
        set({
          user: {
            ...user,
            favorites: exists
              ? user.favorites.filter(id => id !== productId)
              : [...user.favorites, productId],
          },
        });
      },

      // Chatbot
      isChatOpen: false,
      setChatOpen: (open) => set({ isChatOpen: open }),

      // Compare
      compareList: [],
      toggleCompare: (productId) => {
        const { compareList } = get();
        if (compareList.includes(productId)) {
          set({ compareList: compareList.filter(id => id !== productId) });
        } else if (compareList.length < 3) {
          set({ compareList: [...compareList, productId] });
        }
      },
      clearCompare: () => set({ compareList: [] }),
    }),
    {
      name: 'velmor-storage-v4',
      partialize: (state) => ({
        cart: state.cart,
        language: state.language,
        soundEnabled: state.soundEnabled,
        user: state.user,
        promoCode: state.promoCode,
        discountPercent: state.discountPercent,
        shippingInfo: state.shippingInfo,
      }),
    }
  )
);
