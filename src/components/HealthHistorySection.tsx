import React from 'react';

type HealthHistorySectionProps = {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  formType: 'masculino' | 'feminino';
};

const HealthHistorySection: React.FC<HealthHistorySectionProps> = ({ 
  formData, 
  handleInputChange, 
  formType 
}) => {
  // Componente para renderizar campos booleanos com input condicional
  const renderBooleanWithConditional = (
    baseFieldName: string,
    label: string,
    detailFieldName: string
  ) => (
    <div className="space-y-4">
      <div>
        <label className="block text-lg font-medium text-white mb-4">
          {label}
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleInputChange(`health_history.has_${baseFieldName}`, true)}
            className={`px-6 py-3 rounded-xl transition-all text-lg ${
              formData.health_history[`has_${baseFieldName}`] === true
                ? 'bg-[#FF5733] text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => handleInputChange(`health_history.has_${baseFieldName}`, false)}
            className={`px-6 py-3 rounded-xl transition-all text-lg ${
              formData.health_history[`has_${baseFieldName}`] === false
                ? 'bg-[#FF5733] text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Não
          </button>
        </div>
      </div>

      {formData.health_history[`has_${baseFieldName}`] && (
        <div>
          <label className="block text-lg font-medium text-white mb-2">
            Por favor, especifique:
          </label>
          <textarea
            value={formData.health_history[detailFieldName] || ''}
            onChange={(e) => handleInputChange(`health_history.${detailFieldName}`, e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white text-lg"
            rows={3}
          />
        </div>
      )}
    </div>
  );

  const standardFields = (
    <div className="space-y-8">
      {renderBooleanWithConditional(
        'chronic_diseases',
        'Possui doenças crônicas?',
        'chronic_diseases'
      )}
      
      {renderBooleanWithConditional(
        'previous_surgeries',
        'Já realizou cirurgias?',
        'previous_surgeries'
      )}
      
      {renderBooleanWithConditional(
        'food_allergies',
        'Possui alergias ou intolerâncias alimentares?',
        'food_allergies'
      )}
      
      {renderBooleanWithConditional(
        'medications',
        'Faz uso de medicamentos?',
        'medications'
      )}
      
      {renderBooleanWithConditional(
        'family_history',
        'Possui histórico familiar de doenças?',
        'family_history'
      )}
      
      <div>
        <label className="block text-lg font-medium text-white mb-4">
          Nível de Ansiedade (0-10)
        </label>
        <input
          type="number"
          min={0}
          max={10}
          value={formData.health_history.anxiety_level || ''}
          onChange={(e) => handleInputChange('health_history.anxiety_level', parseInt(e.target.value))}
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white text-lg"
        />
      </div>
    </div>
  );

  const femaleFields = formType === 'feminino' ? (
    <div className="space-y-8 mt-8">
      {renderBooleanWithConditional(
        'gynecological_diseases',
        'Possui doenças ginecológicas?',
        'gynecological_diseases'
      )}
    </div>
  ) : null;

  return (
    <div>
      {standardFields}
      {femaleFields}
    </div>
  );
};

export default HealthHistorySection; 