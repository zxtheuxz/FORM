import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAssessments = async () => {
      try {
        // Recuperar o phoneId da URL
        const params = new URLSearchParams(location.search);
        const phoneId = params.get('phoneId');

        if (!phoneId) {
          navigate('/');
          return;
        }

        // Verificar avaliações existentes
        const { data, error } = await supabase
          .from('phone_numbers')
          .select(`
            id,
            assessments (id),
            nutritional_assessments (id)
          `)
          .eq('id', phoneId)
          .single();

        if (error) throw error;

        const hasGymAssessment = data.assessments?.length > 0;
        const hasNutritionalAssessment = data.nutritional_assessments?.length > 0;

        // Aguardar um pouco antes de redirecionar
        setTimeout(() => {
          navigate('/form-selection', {
            state: {
              phoneId,
              hasGymAssessment,
              hasNutritionalAssessment
            }
          });
        }, 3000);
      } catch (error) {
        console.error('Erro ao verificar avaliações:', error);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    checkAssessments();
  }, [navigate, location]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl text-center">
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Formulário Enviado com Sucesso!
        </h1>
        <p className="text-white/90 mb-8">
          {isLoading 
            ? "Processando suas informações..."
            : "Você será redirecionado em alguns segundos..."}
        </p>
      </div>
    </div>
  );
} 