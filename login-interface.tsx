import React, { useState } from 'react';

const LoginPage = () => {
  const [userType, setUserType] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // In a real application, this would be an API call
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle login logic here
      console.log(`Logging in as ${userType} with email: ${email}`);
      
      // Redirect based on user type
      window.location.href = userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard';
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
        {/* Logo and Header */}
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Heart Health Monitor</h1>
          <p className="text-blue-100 mt-1">Secure Access Portal</p>
        </div>
        
        {/* Form Container */}
        <div className="p-6">
          {/* User Type Selector */}
          <div className="flex rounded-md overflow-hidden mb-6 border">
            <button
              className={`flex-1 py-2 px-4 text-center ${userType === 'patient' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700'}`}
              onClick={() => setUserType('patient')}
            >
              Patient Login
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${userType === 'doctor' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700'}`}
              onClick={() => setUserType('doctor')}
            >
              Doctor Login
            </button>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">{error}</div>}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center mb-6">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
          
          {/* Registration Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
