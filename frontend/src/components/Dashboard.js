import React from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const Dashboard = ({ onLogout }) => {
  const username = localStorage.getItem('username');

  const handleTaskAdded = () => {
    // This will be passed to TaskForm to refresh the task list
    window.location.reload(); // Simple approach - could be optimized
  };

  return (
    <div className="dashboard">
      <header>
        <h2>Welcome, {username}!</h2>
        <button onClick={onLogout}>Logout</button>
      </header>
      <div className="dashboard-content">
        <TaskForm onTaskAdded={handleTaskAdded} />
        <TaskList />
      </div>
    </div>
  );
};

export default Dashboard;