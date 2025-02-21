import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle size={64} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold mb-4 text-white">Obrigado!</h1>
      <p className="text-lg mb-4 text-white/90">
        Suas informações foram enviadas para o suporte.
      </p>
      <p className="text-sm text-white/70">
        Você será redirecionado em alguns segundos...
      </p>
    </div>
  );
}