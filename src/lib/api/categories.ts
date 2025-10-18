import { Category } from "@/types";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth"; // <-- Import the helper

/**
 * Fetches all categories from the API.
 */
export const fetchAllCategoriesAPI = async (): Promise<Category[]> => {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

/**
 * Creates a new category via the API.
 * @param formData The category data and image.
 */
export const createCategoryAPI = async (
  formData: FormData
): Promise<Category> => {
  const response = await fetchWithAuth("/api/categories", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create category");
  }
  return response.json();
};

/**
 * Updates an existing category via the API.
 * @param categoryId The ID of the category to update.
 * @param formData The updated category data and image.
 */
export const updateCategoryAPI = async (
  categoryId: string,
  formData: FormData
): Promise<{ message: string }> => {
  const response = await fetchWithAuth(`/api/categories/${categoryId}`, {
    method: "PUT",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update category");
  }
  return response.json();
};

/**
 * Deletes a category via the API.
 * @param categoryId The ID of the category to delete.
 */
export const deleteCategoryAPI = async (
  categoryId: string
): Promise<{ message: string }> => {
  const response = await fetchWithAuth(`/api/categories/${categoryId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete category");
  }
  return response.json();
};
