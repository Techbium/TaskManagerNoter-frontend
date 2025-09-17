import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ username, password }) => {
    try {
      const res = await axios.post('https://taskmanagernoter.onrender.com/login', {
        username,
        password,
      });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return <AuthForm title="Login" onSubmit={handleSubmit} error={error} />;
}

export default Login;