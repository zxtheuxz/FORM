import { useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Apple, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

export default function FormSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneId, hasGymAssessment, hasNutritionalAssessment } = location.state || {};

  useEffect(() => {
    if (!phoneId) {
      console.log('Nenhum telefone verificado. Redirecionando para a página inicial...');
      navigate('/');
      return;
    }
  }, [phoneId, navigate]);

  const handleFormSelect = (type: string) => {
    if (!phoneId) {
      toast.error('Por favor, verifique seu número de telefone primeiro.');
      navigate('/');
      return;
    }

    if (type === 'gym') {
      if (hasGymAssessment) {
        toast.error('Você já preencheu a avaliação física.');
        return;
      }
      navigate('/assessment', { state: { phoneId } });
    } else if (type === 'nutrition') {
      if (hasNutritionalAssessment) {
        toast.error('Você já preencheu a avaliação nutricional.');
        return;
      }
      navigate('/nutrition-gender-select', { state: { phoneId } });
    }
  };

  if (!phoneId) {
    return null; // Não renderiza nada enquanto redireciona
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Escolha o tipo de avaliação
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleFormSelect('gym')}
            disabled={hasGymAssessment}
            className={`p-6 rounded-xl transition-all group ${
              hasGymAssessment 
                ? 'bg-white/10 cursor-not-allowed opacity-60' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <div className="flex flex-col items-center">
              <Dumbbell className="w-12 h-12 text-white mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Avaliação Física
              </h2>
              {hasGymAssessment && (
                <div className="flex items-center gap-2 text-yellow-300">
                  <AlertCircle size={16} />
                  <span className="text-sm">
                    Formulário já preenchido
                  </span>
                </div>
              )}
            </div>
          </button>

          <button
            onClick={() => handleFormSelect('nutrition')}
            disabled={hasNutritionalAssessment}
            className={`p-6 rounded-xl transition-all group ${
              hasNutritionalAssessment 
                ? 'bg-white/10 cursor-not-allowed opacity-60' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <div className="flex flex-col items-center">
              <Apple className="w-12 h-12 text-white mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Avaliação Nutricional
              </h2>
              {hasNutritionalAssessment && (
                <div className="flex items-center gap-2 text-yellow-300">
                  <AlertCircle size={16} />
                  <span className="text-sm">
                    Formulário já preenchido
                  </span>
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 