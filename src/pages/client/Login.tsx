
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useToast } from '@/hooks/use-toast';

const ClientLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // This would typically use Supabase Auth in a real implementation
  const handleLogin = async (email: string, password: string) => {
    // Mock login functionality (for demo purposes)
    if (email === 'client@example.com' && password === 'password') {
      // Would use Supabase Auth and store user session
      localStorage.setItem('user', JSON.stringify({ 
        type: 'client', 
        email, 
        name: 'Demo Client',
        clientId: '123456'
      }));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Redirect to client dashboard
      navigate('/client/dashboard');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-center mb-2">Client Portal</h1>
          <p className="text-center text-gray-600">
            Access your inventory information and connect with our team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Client Benefits</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-inventory-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>View your current inventory levels in real-time</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-inventory-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Track product movements and history</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-inventory-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Generate custom inventory reports</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-inventory-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure access to your data</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Demo Access:</strong> Use email: client@example.com and password: password
              </p>
            </div>
          </div>

          <LoginForm userType="client" onSubmit={handleLogin} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientLogin;
