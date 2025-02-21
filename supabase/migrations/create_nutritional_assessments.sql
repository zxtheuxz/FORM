CREATE TABLE nutritional_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_id uuid REFERENCES phone_numbers(id) NOT NULL,
  form_type text NOT NULL CHECK (form_type IN ('masculino', 'feminino')),
  full_name text NOT NULL,
  birth_date date NOT NULL,
  weight numeric NOT NULL,
  height numeric NOT NULL,
  usual_weight numeric,
  weight_changes jsonb,
  marital_status text,
  children text,
  health_history jsonb,
  lifestyle jsonb,
  eating_habits jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Adicionar políticas de segurança
ALTER TABLE nutritional_assessments ENABLE ROW LEVEL SECURITY;

-- Permitir insert para números verificados
CREATE POLICY "Allow insert for verified numbers" ON nutritional_assessments
  FOR INSERT TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM phone_numbers
      WHERE phone_numbers.id = phone_id
      AND phone_numbers.verified = true
    )
  );

-- Permitir select próprio
CREATE POLICY "Allow select own assessment" ON nutritional_assessments
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM phone_numbers
      WHERE phone_numbers.id = phone_id
      AND phone_numbers.verified = true
    )
  ); 