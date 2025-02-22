import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';

// Lazy loading dos componentes
const PhoneVerification = lazy(() => import('./components/PhoneVerification'));
const FormSelection = lazy(() => import('./components/FormSelection'));
const AssessmentForm = lazy(() => import('./components/AssessmentForm'));
const NutritionGenderSelect = lazy(() => import('./components/NutritionGenderSelect'));
const NutritionalAssessmentForm = lazy(() => import('./components/NutritionalAssessmentForm'));
const Success = lazy(() => import('./components/Success'));

// Componente de loading
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<PhoneVerification />} />
            <Route path="/form-selection" element={<FormSelection />} />
            <Route path="/assessment" element={<AssessmentForm />} />
            <Route path="/nutrition-gender-select" element={<NutritionGenderSelect />} />
            <Route path="/nutrition-assessment" element={<NutritionalAssessmentForm />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </Suspense>
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