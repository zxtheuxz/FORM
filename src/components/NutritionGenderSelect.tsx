import { useLocation, useNavigate } from 'react-router-dom';
import { User, UserRound } from 'lucide-react';

export default function NutritionGenderSelect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneId } = location.state || {};

  const handleGenderSelect = (gender: 'masculino' | 'feminino') => {
    navigate('/nutrition-assessment', { 
      state: { 
        phoneId,
        formType: gender 
      } 
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Selecione o formulário
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleGenderSelect('masculino')}
            className="p-6 rounded-xl bg-white/20 hover:bg-white/30 transition-all group"
          >
            <div className="flex flex-col items-center">
              <User className="w-12 h-12 text-white mb-4" />
              <h2 className="text-xl font-semibold text-white">
                Masculino
              </h2>
            </div>
          </button>

          <button
            onClick={() => handleGenderSelect('feminino')}
            className="p-6 rounded-xl bg-white/20 hover:bg-white/30 transition-all group"
          >
            <div className="flex flex-col items-center">
              <UserRound className="w-12 h-12 text-white mb-4" />
              <h2 className="text-xl font-semibold text-white">
                Feminino
              </h2>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 