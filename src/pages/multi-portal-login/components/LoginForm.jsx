import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const { signIn, signUp, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    let result;
    if (isSignUp) {
      result = await signUp(email, password, { full_name: fullName, role: 'employee' });
    } else {
      result = await signIn(email, password);
    }
    
    if (result?.user && !result?.error) {
      navigate('/admin-dashboard');
    }
  };

  const handleDemoLogin = async (role) => {
    const demoCredentials = {
      admin: { email: 'admin@company.com', password: 'admin123' },
      hr: { email: 'hr@company.com', password: 'hr123' },
      employee: { email: 'john@company.com', password: 'employee123' }
    };

    const credentials = demoCredentials?.[role];
    if (credentials) {
      let result = await signIn(credentials?.email, credentials?.password);
      if (result?.user && !result?.error) {
        navigate('/admin-dashboard');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-gray-600">
          {isSignUp ? 'Join our HRMS platform' : 'Sign in to your account'}
        </p>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-red-600 text-sm">
              {error}
            </div>
          </div>
          <button 
            onClick={() => navigator.clipboard?.writeText(error)}
            className="text-xs text-red-500 hover:text-red-700 mt-1"
          >
            Copy error message
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e?.target?.value)}
              required={isSignUp}
              disabled={loading}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e?.target?.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e?.target?.value)}
            required
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-blue-600 hover:text-blue-800"
          disabled={loading}
        >
          {isSignUp 
            ? 'Already have an account? Sign in' :'Need an account? Sign up'}
        </button>
      </div>
      {/* Demo Login Options */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 text-center mb-4">
          Demo Accounts (Development Only)
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('admin')}
            disabled={loading}
            className="text-xs"
          >
            Admin Demo (admin@company.com)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('hr')}
            disabled={loading}
            className="text-xs"
          >
            HR Manager Demo (hr@company.com)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('employee')}
            disabled={loading}
            className="text-xs"
          >
            Employee Demo (john@company.com)
          </Button>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          HRMS Pro - Human Resource Management System
        </p>
      </div>
    </div>
  );
};

export default LoginForm;