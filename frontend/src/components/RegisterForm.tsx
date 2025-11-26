import { useState } from 'react';
import { Mail, Lock, User, Building, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string, company: string) => void;
  onNavigateToLogin: () => void;
}

export function RegisterForm({ onRegister, onNavigateToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; company?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    const newErrors: { name?: string; email?: string; password?: string; company?: string } = {};
    const hasLetter = /[A-Za-zÀ-ú]/;
    if (!name || name.trim().length < 2 || !hasLetter.test(name)) {
      newErrors.name = 'Insira um nome válido (contendo letras)';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Insira um e-mail válido';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'A senha deve ter ao menos 6 caracteres';
    }
    if (!company || company.trim().length < 2 || !hasLetter.test(company)) {
      newErrors.company = 'Nome da empresa inválido (insira também letras)';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onRegister(name.trim(), email.trim(), password, company.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-slate-800 mb-2">Criar Nova Conta</h1>
          <p className="text-slate-600">Preencha os dados para se cadastrar</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="company"
                  type="text"
                  placeholder="Nome da Empresa"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="pl-10"
                  required
                />
                {errors.company && (
                  <p className="text-sm text-red-600 mt-1">{errors.company}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                required
              />
              <label htmlFor="terms" className="text-slate-600 cursor-pointer">
                Aceito os{' '}
                <a href="#" className="text-cyan-600 hover:text-cyan-700">
                  termos de uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-cyan-600 hover:text-cyan-700">
                  política de privacidade
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Já tem uma conta?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-cyan-600 hover:text-cyan-700"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>© 2025 Sistema de Gestão de Frotas. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
