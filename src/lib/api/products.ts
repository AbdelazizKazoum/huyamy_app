import { Product } from "@/types";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";

/**
 * Fetches all products from the API.
 */
export const fetchAllProductsAPI = async (): Promise<Product[]> => {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

/**
 * Creates a new product via the API.
 * @param formData The product data and images.
 */
export const createProductAPI = async (
  formData: FormData
): Promise<Product> => {
  const response = await fetchWithAuth("/api/products", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create product");
  }
  return response.json();
};

/**
 * Updates an existing product via the API.
 * @param productId The ID of the product to update.
 * @param formData The updated product data and images.
 */
export const updateProductAPI = async (
  productId: string,
  formData: FormData
): Promise<{ message: string; productId: string }> => {
  const response = await fetchWithAuth(`/api/products/${productId}`, {
    method: "PUT",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update product");
  }
  return response.json();
};

/**
 * Deletes a product via the API.
 * @param productId The ID of the product to delete.
 */
export const deleteProductAPI = async (
  productId: string
): Promise<{ message: string }> => {
  const response = await fetchWithAuth(`/api/products/${productId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete product");
  }
  return response.json();
};
