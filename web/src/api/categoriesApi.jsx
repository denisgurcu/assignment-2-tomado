import axiosInstance from './axiosConfig';

// Fetch all categories from the backend
// This function can be used to get a list of all categories, typically for displaying in a dropdown, table, or list.
export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

// Create a new category in the backend
// This function is used to add a new category, often triggered by a form submission.
export const createCategory = async (categoryData) => {
  const response = await axiosInstance.post('/categories', categoryData);
  return response.data;
};

// Update an existing category in the backend
// This function is used to modify an existing category, usually triggered by an edit form.
export const updateCategory = async (categoryId, categoryData) => {
  const response = await axiosInstance.put(`/categories/${categoryId}`, categoryData);
  return response.data;
};

// Delete a category from the backend
// This function is called to remove a category, typically triggered by a delete button.
export const deleteCategory = async (categoryId) => {
  const response = await axiosInstance.delete(`/categories/${categoryId}`);
  return response.data;
};