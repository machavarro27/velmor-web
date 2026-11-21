import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function LoginModal() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const { isLoginOpen, setLoginOpen, setUser } = useAppStore();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error(isEn ? 'Please fill in all fields' : 'Por favor completa todos los campos');
      return;
    }

    if (isRegister && !formData.name) {
      toast.error(isEn ? 'Please enter your name' : 'Por favor ingresa tu nombre');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      favorites: [],
    };

    setUser(newUser);
    setLoginOpen(false);
    toast.success(
      isRegister
        ? isEn
          ? 'Account created successfully!'
          : '¡Cuenta creada exitosamente!'
        : isEn
        ? `Welcome back, ${newUser.name}!`
        : `¡Bienvenido de nuevo, ${newUser.name}!`
    );

    setFormData({ name: '', email: '', password: '', remember: false });
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setLoginOpen}>
      <DialogContent className="sm:max-w-md bg-white border-[#004B87]/15">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#EBF4FA] flex items-center justify-center mb-3 border border-[#004B87]/15">
            <img
              src="/images/mascota.png"
              alt="Velmor"
              className="w-14 h-14 object-contain"
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-[#004B87]">
            {t('login.title')}
          </DialogTitle>
          <DialogDescription className="text-[#4E5E74]">
            {t('login.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {isRegister && (
            <div className="space-y-1.5">
              <Label htmlFor="login-name" className="text-xs font-bold text-[#192434]">
                {t('login.name')}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5E74]" />
                <Input
                  id="login-name"
                  placeholder={t('login.name')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 bg-[#FAF8F5]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-xs font-bold text-[#192434]">
              {t('login.email')}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5E74]" />
              <Input
                id="login-email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-[#FAF8F5]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="login-password" className="text-xs font-bold text-[#192434]">
              {t('login.password')}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5E74]" />
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10 bg-[#FAF8F5]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E5E74] hover:text-[#192434]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.remember}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, remember: checked as boolean })
                }
              />
              <Label htmlFor="remember" className="text-xs cursor-pointer text-[#4E5E74]">
                {t('login.remember')}
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#004B87] hover:bg-[#003865] text-white font-bold py-5 rounded-xl"
          >
            {isRegister ? t('login.registerSubmit') : t('login.submit')}
          </Button>
        </form>

        <p className="text-center text-sm text-[#4E5E74] mt-3">
          {isRegister ? t('login.hasAccount') : t('login.noAccount')}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#004B87] hover:underline font-bold"
          >
            {isRegister ? t('login.submit') : t('login.register')}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
