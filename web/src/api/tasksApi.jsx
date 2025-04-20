// poor attempts to simplify things 
// not actively used

import axiosInstance from './axiosConfig';

export const fetchTasks = async () => {
  try {
    const response = await axiosInstance.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    throw error; 
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await axiosInstance.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error.message);
    throw error; 
  }
};


export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error.message);
    throw error; 
  }
};


export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error.message);
    throw error; 
  }
};