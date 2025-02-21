import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PhoneVerification from './components/PhoneVerification';
import AssessmentForm from './components/AssessmentForm';
import FormSelection from './components/FormSelection';
import NutritionGenderSelect from './components/NutritionGenderSelect';
import NutritionalAssessmentForm from './components/NutritionalAssessmentForm';
import Success from './components/Success';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600">
        <Routes>
          <Route path="/" element={<PhoneVerification />} />
          <Route path="/form-selection" element={<FormSelection />} />
          <Route path="/assessment" element={<AssessmentForm />} />
          <Route path="/nutrition-gender-select" element={<NutritionGenderSelect />} />
          <Route path="/nutrition-assessment" element={<NutritionalAssessmentForm />} />
          <Route path="/success" element={<Success />} />
        </Routes>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#2DD4BF',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}