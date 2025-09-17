import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskBoard from '../components/TaskBoard';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('https://taskmanagernoter.onrender.com/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/login');
        }
      }
    };
    fetchTasks();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <TaskBoard tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

export default Dashboard;