import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { QrCode } from 'lucide-react';

export default function PhoneVerification() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePhone = (phone: string) => {
    const phoneRegex = /^55[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) {
      toast.error('Número de telefone inválido. Use o formato: 55 + DDD + número');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('phone_numbers')
        .select(`
          id,
          verified,
          assessments (id),
          nutritional_assessments (id)
        `)
        .eq('phone', phone)
        .single();

      if (error) throw error;

      if (!data?.verified) {
        toast.error('Número não verificado. Entre em contato com o suporte.');
        return;
      }

      // Verificar formulários existentes
      const hasGymAssessment = data.assessments?.length > 0;
      const hasNutritionalAssessment = data.nutritional_assessments?.length > 0;

      navigate('/form-selection', { 
        state: { 
          phoneId: data.id,
          hasGymAssessment,
          hasNutritionalAssessment
        } 
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao verificar o número. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-6 text-white">
            Avaliação Fitness Personalizada
          </h1>
          <p className="text-white/90 mb-8 text-lg">
            Comece sua jornada fitness com uma avaliação personalizada. 
            Insira seu número para continuar.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2 text-white/90">
                Número de Telefone
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="55 + DDD + número"
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-teal-600 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? 'Verificando...' : 'Começar Avaliação'}
            </button>
          </form>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center p-8">
          <div className="bg-white/20 rounded-2xl p-8 backdrop-blur-lg">
            <QrCode size={120} className="text-white mb-4" />
            <div className="text-white/90 text-center">
              <p className="font-semibold mb-2">Avaliação Digital</p>
              <p className="text-sm">Processo 100% online e personalizado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}