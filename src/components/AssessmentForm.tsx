import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, CheckCircle, Upload } from 'lucide-react';
import MedicalDocumentUpload from './MedicalDocumentUpload';

type FormData = {
  sex: string;
  age_range: string;
  objective: string;
  inactive_period: string;
  experience_period: string;
  availability: string;
  training_level: string;
  chest_pain: boolean;
  medical_clearance?: boolean;
  medical_document?: File;
  medical_document_url?: string;
  agreement: boolean;
  medication: string;
  pre_existing_condition: string;
  risk_condition: string;
  injury: string;
};

export default function AssessmentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneId } = location.state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    sex: '',
    age_range: '',
    objective: '',
    inactive_period: '',
    experience_period: '',
    availability: '',
    training_level: '',
    chest_pain: false,
    agreement: false,
    medication: '',
    pre_existing_condition: '',
    risk_condition: '',
    injury: '',
  });

  useEffect(() => {
    if (!phoneId) {
      console.log('Nenhum telefone verificado. Redirecionando para a página inicial...');
      navigate('/');
      return;
    }
  }, [phoneId, navigate]);

  const questions = [
    {
      title: '1. Sexo',
      field: 'sex',
      options: [
        { value: 'masculino', label: 'Masculino' },
        { value: 'feminino', label: 'Feminino' }
      ]
    },
    {
      title: '2. Faixa Etária',
      field: 'age_range',
      options: [
        { value: '14-18', label: '14 a 18 anos' },
        { value: '18-60', label: '18 a 60 anos' },
        { value: '60-80', label: '60 a 80 anos' }
      ]
    },
    {
      title: '3. Qual seu objetivo',
      field: 'objective',
      options: [
        { value: 'emagrecimento', label: 'Emagrecimento' },
        { value: 'hipertrofia', label: 'Hipertrofia' },
        { value: 'hipertrofia-emagrecimento', label: 'Hipertrofia / Emagrecimento' },
        { value: 'fortalecimento', label: 'Fortalecimento' }
      ]
    },
    {
      title: '4. Há quanto tempo está parado sem fazer atividade física ou musculação',
      field: 'inactive_period',
      options: [
        { value: 'nunca', label: 'Nunca pratiquei atividade física' },
        { value: 'ate-6-meses', label: 'Até 6 meses parado' },
        { value: 'mais-6-meses', label: '6 meses ou mais parado' },
        { value: 'nao-parado', label: 'Não estou parado' }
      ]
    },
    {
      title: '5. Diga por quanto tempo praticou ou pratica musculação',
      field: 'experience_period',
      options: [
        { value: 'nunca', label: 'Nunca pratiquei musculação' },
        { value: '1-6-meses', label: '1 a 6 meses' },
        { value: '6-12-meses', label: '6 a 12 meses' },
        { value: '1-2-anos', label: '1 a 2 anos' },
        { value: '3-mais-anos', label: 'Há mais de 3 anos' }
      ]
    },
    {
      title: '6. Qual disponibilidade de tempo por semana você tem para treinar',
      field: 'availability',
      options: [
        { value: '3-dias', label: '3 dias por semana' },
        { value: '4-dias', label: '4 dias por semana' },
        { value: '5-dias', label: '5 dias por semana' },
        { value: '6-dias', label: '6 dias por semana' }
      ]
    },
    {
      title: '7. Diga em que nível de treinamento você acha que se enquadra',
      field: 'training_level',
      options: [
        { value: 'sem-experiencia', label: 'Nunca tive experiência c/musculação' },
        { value: 'iniciante', label: 'Iniciante' },
        { value: 'intermediario', label: 'Intermediário' },
        { value: 'avancado', label: 'Avançado' }
      ]
    },
    {
      title: '8. Sente dores no peito, tontura ou falta de ar durante atividade física',
      field: 'chest_pain',
      options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' }
      ]
    },
    {
      title: '9. Faz uso de algum medicamento que impossibilite a prática de atividade física',
      field: 'medication',
      options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' }
      ]
    },
    {
      title: '10. Tem alguma doença pré existente',
      field: 'pre_existing_condition',
      options: [
        { value: 'nao', label: 'Não' },
        { value: 'diabetes', label: 'Diabetes' },
        { value: 'hipertensao', label: 'Hipertensão Arterial' }
      ]
    },
    {
      title: '11. Algum tipo de doença que impossibilite a prática de atividade física ou leve risco a sua vida',
      field: 'risk_condition',
      options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' }
      ]
    },
    {
      title: '12. Tem alguma lesão que impossibilite você de fazer alguma atividade física',
      field: 'injury',
      options: [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' }
      ]
    }
  ];

  const totalSteps = questions.length + 2; // Agora será 13 (11 questions + chest pain + agreement)

  const handleInputChange = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Log dos dados antes do envio
      console.log('Dados do formulário:', {
        ...formData,
        phoneId: location.state?.phoneId
      });

      // Verificar se todos os campos obrigatórios estão preenchidos
      const requiredFields = {
        sex: 'Sexo',
        age_range: 'Faixa Etária',
        objective: 'Objetivo',
        inactive_period: 'Período Inativo',
        experience_period: 'Experiência',
        availability: 'Disponibilidade',
        training_level: 'Nível de Treino',
        chest_pain: 'Dores no Peito',
        medication: 'Medicação',
        pre_existing_condition: 'Doença Pré-existente',
        risk_condition: 'Condição de Risco',
        injury: 'Lesão',
        agreement: 'Termo de Acordo'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => {
          const value = formData[key as keyof FormData];
          // Considerar valores booleanos (true/false) como preenchidos
          return typeof value === 'boolean' ? false : !value;
        })
        .map(([, label]) => label);

      if (missingFields.length > 0) {
        console.log('Campos não preenchidos:', missingFields);
        throw new Error(`Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`);
      }

      if (!location.state?.phoneId) {
        console.log('ID do telefone não encontrado');
        throw new Error('ID do telefone não encontrado');
      }

      // Inserir dados na tabela assessments
      const { error } = await supabase
        .from('assessments')
        .insert([
          {
            phone_id: location.state?.phoneId,
            sex: formData.sex,
            age_range: formData.age_range,
            objective: formData.objective,
            inactive_period: formData.inactive_period,
            experience_period: formData.experience_period,
            availability: formData.availability,
            training_level: formData.training_level,
            chest_pain: formData.chest_pain,
            medical_clearance: formData.medical_clearance,
            medication: formData.medication === 'sim',
            pre_existing_condition: formData.pre_existing_condition,
            life_threatening_condition: formData.risk_condition === 'sim',
            injury: formData.injury === 'sim',
            agreement: formData.agreement
          }
        ]);

      if (error) {
        console.error('Erro Supabase:', error);
        throw error;
      }

      navigate('/success?phoneId=' + location.state?.phoneId);
    } catch (error) {
      console.error('Erro detalhado:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao enviar formulário. Por favor, verifique se todos os campos foram preenchidos corretamente.');
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      // Verificar o tamanho do arquivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB em bytes
      if (file.size > maxSize) {
        throw new Error('O arquivo é muito grande. O tamanho máximo permitido é 5MB.');
      }

      // Verificar o tipo do arquivo
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Use PDF, DOC, DOCX, JPG ou PNG.');
      }

      handleInputChange('medical_document', file);
      handleNext();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao processar o arquivo. Por favor, tente novamente.');
      }
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
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

  const currentQuestion = currentStep <= questions.length ? questions[currentStep - 1] : null;

  const canProceed = () => {
    if (currentStep <= questions.length) {
      const currentField = questions[currentStep - 1].field;
      if (currentField === 'chest_pain') {
        // Se respondeu sim para dores no peito, precisa responder sobre o laudo médico
        if (formData.chest_pain === true) {
          if (formData.medical_clearance === true) {
            // Se tem laudo médico, precisa fazer upload
            return formData.medical_document_url != null;
          }
          // Se não tem laudo médico, pode prosseguir
          return formData.medical_clearance === false;
        }
        // Se respondeu não para dores no peito, pode prosseguir
        return formData.chest_pain === false;
      }
      // Para outras perguntas, verifica se há resposta
      return formData[currentField as keyof FormData] !== '';
    }
    // Para o termo de acordo
    if (currentStep === questions.length + 1) {
      return formData.agreement;
    }
    // Para a última etapa (revisão)
    return true;
  };

  if (!phoneId) {
    return null; // Não renderiza nada enquanto redireciona
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-[#FF5733]/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-[#FF5733]/20">
        <div className="mb-8">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF5733] transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <p className="text-white/70 text-sm mt-2 text-center">
            {currentStep === totalSteps ? 'Última etapa' : `Questão ${currentStep} de ${totalSteps}`}
          </p>
        </div>

        {currentStep <= questions.length && currentQuestion ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              {currentQuestion.title}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (currentQuestion.field === 'chest_pain') {
                      handleInputChange('chest_pain', option.value === 'sim');
                      if (option.value === 'sim') {
                        handleInputChange('medical_clearance', null);
                      }
                    } else {
                      handleInputChange(currentQuestion.field as keyof FormData, option.value);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    currentQuestion.field === 'chest_pain'
                      ? (formData.chest_pain && option.value === 'sim') || (!formData.chest_pain && option.value === 'nao')
                        ? 'bg-[#FF5733] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                      : formData[currentQuestion.field as keyof FormData] === option.value
                        ? 'bg-[#FF5733] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {currentQuestion.field === 'chest_pain' && formData.chest_pain && (
              <div className="mt-8 space-y-6">
                <h3 className="text-xl font-bold text-white">
                  Tem algum laudo médico que permita que você faça atividade física?
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      handleInputChange('medical_clearance', true);
                    }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      formData.medical_clearance === true
                        ? 'bg-[#FF5733] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => {
                      handleInputChange('medical_clearance', false);
                    }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      formData.medical_clearance === false
                        ? 'bg-[#FF5733] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Não
                  </button>
                </div>

                {formData.medical_clearance && (
                  <div className="mt-4">
                    <p className="text-white/90 mb-4">
                      Por favor, faça o upload do seu laudo médico para continuar
                    </p>
                    <MedicalDocumentUpload
                      phoneId={location.state?.phoneId}
                      currentFile={formData.medical_document}
                      onFileUpload={(file, url) => {
                        handleInputChange('medical_document', file);
                        handleInputChange('medical_document_url', url);
                        if (file && url) {
                          handleNext();
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : currentStep === questions.length + 1 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Termo de Acordo
            </h2>
            <div className="bg-white/10 p-6 rounded-xl">
              <label className="flex items-start space-x-4 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreement}
                  onChange={(e) => {
                    handleInputChange('agreement', e.target.checked);
                  }}
                  className="mt-1"
                />
                <span className="text-sm">
                  CERTIFICO-ME ESTAR CIENTE DE TODAS AS INFORMAÇÕES AQUI PRESTADAS, 
                  TENDO TOTAL RESPONSABILIDADE PELA VERACIDADE DAS MINHAS RESPOSTAS 
                  E ATESTANDO ESTAR APTO A REALIZAR ATIVIDADE FÍSICA.
                </span>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Revisão e Envio
            </h2>
            <div className="bg-white/10 p-6 rounded-xl">
              <p className="text-white mb-4">
                Por favor, revise suas respostas e clique em Finalizar para enviar o formulário.
              </p>
              <button
                onClick={handleSubmit}
                className="w-full px-6 py-3 rounded-xl bg-[#FF5733] text-white hover:bg-[#ff6242] transition-all flex items-center justify-center"
              >
                Finalizar Avaliação
                <CheckCircle className="ml-2" size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-xl bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all flex items-center"
          >
            <ChevronLeft className="mr-2" size={20} />
            Anterior
          </button>
          {currentStep < totalSteps && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-3 rounded-xl bg-[#FF5733] text-white hover:bg-[#ff6242] transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <ChevronRight className="ml-2" size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}