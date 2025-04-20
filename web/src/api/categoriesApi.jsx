import axiosInstance from './axiosConfig';

// Fetch all categories
export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

// Create a new category
export const createCategory = async (categoryData) => {
  const response = await axiosInstance.post('/categories', categoryData);
  return response.data;
};

// Update an existing category
export const updateCategory = async (categoryId, categoryData) => {
  const response = await axiosInstance.put(`/categories/${categoryId}`, categoryData);
  return response.data;
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  const response = await axiosInstance.delete(`/categories/${categoryId}`);
  return response.data;
};