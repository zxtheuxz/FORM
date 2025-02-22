import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import HealthHistorySection from './HealthHistorySection';

// Tipos para o histórico de saúde
interface HealthHistory {
  has_chronic_diseases: boolean | null;
  chronic_diseases: string;
  has_previous_surgeries: boolean | null;
  previous_surgeries: string;
  has_food_allergies: boolean | null;
  food_allergies: string;
  has_medications: boolean | null;
  medications: string;
  has_family_history: boolean | null;
  family_history: string;
  anxiety_level: number;
  // Campos específicos femininos
  has_gynecological_diseases?: boolean;
  gynecological_diseases?: string;
  menstrual_cycle?: {
    first_period_age?: number;
    is_regular?: boolean;
    cycle_duration?: number;
    symptoms?: string[];
    affects_eating?: boolean;
  };
}

// Tipos para o estilo de vida
interface Lifestyle {
  physical_activity_level: string;
  sleep_hours: number;
  wake_up_time: string;
  alcohol_consumption: {
    drinks: boolean | null;
  };
  smoking: {
    smokes: boolean | null;
  };
  work_hours: number;
  supplements: string[];
  bowel_movements: {
    frequency: number;
    issues: string[];
  };
  stress_level?: number;
  sleep_quality?: string;
  exercise_routine?: {
    type: string;
    frequency: number;
    time: string;
    duration: number;
  };
  water_intake: number;
  urination: {
    normal: boolean | null;
    observations: string;
  };
}

// Tipos para os hábitos alimentares
interface EatingHabits {
  previous_diets: boolean | null;
  diet_difficulties: string[];
  daily_routine: string;
  disliked_foods: string[];
  favorite_foods: string[];
  soda_consumption: {
    drinks: boolean | null;
  };
  weekend_eating: string;
  eats_watching_tv: boolean | null;
  water_intake: number;
  preferred_taste?: 'sweet' | 'salty' | 'sour' | 'bitter';
  hunger_peak_time?: string;
  eating_routine?: {
    eats_out: boolean;
    prepares_meals: boolean;
    eats_alone: boolean;
  };
  chewing?: {
    speed: 'fast' | 'slow';
    observations: string;
  };
}

// Tipo principal do formulário
interface FormData {
  full_name: string;
  birth_date: string;
  weight: number;
  height: number;
  marital_status: string;
  children: string;
  usual_weight: number;
  weight_changes: {
    recent_loss?: {
      amount: number;
      period: string;
      reason: string;
    };
    recent_gain?: {
      amount: number;
      period: string;
      reason: string;
    };
  };
  health_history: HealthHistory;
  lifestyle: Lifestyle;
  eating_habits: EatingHabits;
}

// Tipo para os campos do formulário
interface Field {
  name: string;
  label: string;
  type: string;
  step?: string;
  min?: number;
  max?: number;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

// Função auxiliar para acessar valores aninhados com segurança
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj);
};

export default function NutritionalAssessmentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneId, formType } = location.state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    birth_date: '',
    weight: 0,
    height: 0,
    marital_status: '',
    children: '',
    usual_weight: 0,
    weight_changes: {},
    health_history: {
      has_chronic_diseases: null,
      chronic_diseases: '',
      has_previous_surgeries: null,
      previous_surgeries: '',
      has_food_allergies: null,
      food_allergies: '',
      has_medications: null,
      medications: '',
      has_family_history: null,
      family_history: '',
      anxiety_level: 0,
    },
    lifestyle: {
      physical_activity_level: 'sedentary',
      sleep_hours: 0,
      wake_up_time: '',
      alcohol_consumption: {
        drinks: null,
      },
      smoking: {
        smokes: null,
      },
      work_hours: 0,
      supplements: [],
      bowel_movements: {
        frequency: 0,
        issues: [],
      },
      water_intake: 0,
      urination: {
        normal: null,
        observations: '',
      },
    },
    eating_habits: {
      previous_diets: null,
      diet_difficulties: [],
      daily_routine: '',
      disliked_foods: [],
      favorite_foods: [],
      soda_consumption: {
        drinks: null,
      },
      weekend_eating: '',
      eats_watching_tv: null,
      water_intake: 0,
    },
  });

  useEffect(() => {
    if (!phoneId) {
      console.log('Nenhum telefone verificado. Redirecionando para a página inicial...');
      navigate('/');
      return;
    }
  }, [phoneId, navigate]);

  const steps = [
    {
      title: 'Dados Pessoais',
      fields: [
        { name: 'full_name', label: 'Nome Completo', type: 'text' },
        { name: 'birth_date', label: 'Data de Nascimento', type: 'date' },
        { name: 'weight', label: 'Peso Atual (kg) (Seu peso hoje.)', type: 'number', step: '0.1' },
        { name: 'usual_weight', label: 'Peso Habitual (kg) (Seu peso médio ao longo do tempo.)', type: 'number', step: '0.1' },
        { name: 'height', label: 'Altura (m)', type: 'number', step: '0.01' },
        { name: 'marital_status', label: 'Estado Civil', type: 'select', options: [
          { value: 'solteiro', label: 'Solteiro(a)' },
          { value: 'casado', label: 'Casado(a)' },
          { value: 'divorciado', label: 'Divorciado(a)' },
          { value: 'viuvo', label: 'Viúvo(a)' }
        ]},
        { name: 'children', label: 'Tem filhos? Quantos?', type: 'text' }
      ]
    },
    {
      title: 'Histórico de Saúde',
      component: () => (
        <HealthHistorySection
          formData={formData}
          handleInputChange={handleInputChange}
          formType={formType}
        />
      )
    },
    {
      title: 'Estilo de Vida',
      fields: [
        { name: 'lifestyle.physical_activity_level', label: 'Nível de Atividade Física', type: 'select', options: [
          { value: 'sedentary', label: 'Sedentário' },
          { value: 'moderate', label: 'Moderado' },
          { value: 'active', label: 'Ativo' }
        ]},
        { name: 'lifestyle.sleep_hours', label: 'Horas de Sono por Noite', type: 'number' },
        { name: 'lifestyle.wake_up_time', label: 'Horário que Acorda', type: 'time' },
        { name: 'lifestyle.alcohol_consumption.drinks', label: 'Consome Bebidas Alcoólicas?', type: 'boolean' },
        { name: 'lifestyle.smoking.smokes', label: 'Fuma?', type: 'boolean' },
        { name: 'lifestyle.work_hours', label: 'Horas de Trabalho por Dia', type: 'number' },
        { name: 'lifestyle.water_intake', label: 'Consumo de Água (litros/dia)', type: 'number', step: '0.5' }
      ]
    },
    {
      title: 'Hábitos Alimentares',
      fields: [
        { name: 'eating_habits.previous_diets', label: 'Já Fez Dieta?', type: 'boolean' },
        { name: 'eating_habits.diet_difficulties', label: 'Dificuldades em Dietas Anteriores', type: 'text' },
        { name: 'eating_habits.daily_routine', label: 'Rotina Alimentar Diária', type: 'textarea' },
        { name: 'eating_habits.disliked_foods', label: 'Alimentos que Não Gosta', type: 'text' },
        { name: 'eating_habits.favorite_foods', label: 'Alimentos Favoritos', type: 'text' },
        { name: 'eating_habits.soda_consumption.drinks', label: 'Consome Refrigerante?', type: 'boolean' },
        { name: 'eating_habits.weekend_eating', label: 'Alimentação aos Finais de Semana', type: 'textarea' },
        { name: 'eating_habits.eats_watching_tv', label: 'Come Assistindo TV?', type: 'boolean' }
      ]
    }
  ];

  const handleInputChange = (field: string, value: any) => {
    const fields = field.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {};
        }
        current[fields[i]] = { ...current[fields[i]] };
        current = current[fields[i]];
      }
      
      current[fields[fields.length - 1]] = value;
      return newData;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validar campos obrigatórios
      if (!formData.full_name || !formData.birth_date || !formData.weight || !formData.height) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      // Converter os dados do formulário para corresponder ao esquema do banco
      const submissionData = {
        phone_id: phoneId,
        form_type: formType,
        full_name: formData.full_name.trim(),
        birth_date: new Date(formData.birth_date).toISOString().split('T')[0], // Formato YYYY-MM-DD
        weight: Number(formData.weight),
        height: Number(formData.height),
        usual_weight: formData.usual_weight ? Number(formData.usual_weight) : null,
        weight_changes: Object.keys(formData.weight_changes).length > 0 ? formData.weight_changes : null,
        marital_status: formData.marital_status || null,
        children: formData.children || null,
        health_history: formData.health_history || null,
        lifestyle: formData.lifestyle || null,
        eating_habits: formData.eating_habits || null
      };

      console.log('Dados a serem enviados:', submissionData);

      const { error } = await supabase
        .from('nutritional_assessments')
        .insert([submissionData]);

      if (error) {
        console.error('Erro detalhado:', error);
        throw new Error(error.message);
      }

      toast.success('Formulário enviado com sucesso!');
      navigate('/success?phoneId=' + phoneId);
    } catch (error) {
      console.error('Erro:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao enviar formulário. Tente novamente.');
      }
    }
  };

  const currentStepData = steps[currentStep - 1];

  if (!phoneId) {
    return null; // Não renderiza nada enquanto redireciona
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        <div className="mb-8">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF5733] transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-white/70 text-sm mt-2 text-center">
            Etapa {currentStep} de {steps.length}
          </p>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          {currentStepData.title}
        </h1>

        <div className="space-y-6">
          {currentStepData.component ? (
            <currentStepData.component />
          ) : (
            currentStepData.fields.map((field: Field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={getNestedValue(formData, field.name) || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  >
                    <option value="" className="bg-gray-800">Selecione...</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={getNestedValue(formData, field.name) || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    rows={4}
                  />
                ) : field.type === 'boolean' ? (
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange(field.name, true)}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        getNestedValue(formData, field.name) === true
                          ? 'bg-[#FF5733] text-white'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange(field.name, false)}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        getNestedValue(formData, field.name) === false
                          ? 'bg-[#FF5733] text-white'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={getNestedValue(formData, field.name) || ''}
                    onChange={(e) => handleInputChange(field.name, 
                      field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                    )}
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  />
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-xl bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all flex items-center"
          >
            <ChevronLeft className="mr-2" size={20} />
            Anterior
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-[#FF5733] text-white hover:bg-[#ff6242] transition-all flex items-center"
          >
            {currentStep === steps.length ? (
              <>
                Finalizar
                <CheckCircle className="ml-2" size={20} />
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="ml-2" size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 