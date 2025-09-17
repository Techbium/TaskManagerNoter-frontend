import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';

function Register() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async ({ username, password }) => {
    try {
      await axios.post('https://taskmanagernoter.onrender.com/register', {
        username,
        password,
      });
      navigate('/login');
    } catch (err) {
      setError('Username taken or invalid input');
    }
  };

  return <AuthForm title="Register" onSubmit={handleSubmit} error={error} />;
}

export default Register;