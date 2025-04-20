import axiosInstance from './axiosConfig';

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await axiosInstance.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    throw error; // Rethrow the error to handle it in the caller
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await axiosInstance.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error.message);
    throw error; // Rethrow the error to handle it in the caller
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error.message);
    throw error; // Rethrow the error to handle it in the caller
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error.message);
    throw error; // Rethrow the error to handle it in the caller
  }
};