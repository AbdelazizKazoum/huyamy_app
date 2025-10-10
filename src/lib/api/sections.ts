import { Section, SectionWithProducts } from "@/types";

/**
 * Fetches all sections with their products from the API.
 */
export const fetchAllSectionsAPI = async (): Promise<SectionWithProducts[]> => {
  const response = await fetch("/api/sections");
  if (!response.ok) {
    throw new Error("Failed to fetch sections");
  }
  return response.json();
};

/**
 * Creates a new section via the API.
 * @param formData The section data and optional image.
 */
export const createSectionAPI = async (
  formData: FormData
): Promise<Section> => {
  const response = await fetch("/api/sections", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create section");
  }
  return response.json();
};

/**
 * Updates an existing section via the API.
 * @param sectionId The ID of the section to update.
 * @param formData The updated section data and optional image.
 */
export const updateSectionAPI = async (
  sectionId: string,
  formData: FormData
): Promise<{ message: string }> => {
  const response = await fetch(`/api/sections/${sectionId}`, {
    method: "PUT",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update section");
  }
  return response.json();
};

/**
 * Deletes a section via the API.
 * @param sectionId The ID of the section to delete.
 */
export const deleteSectionAPI = async (
  sectionId: string
): Promise<{ message: string }> => {
  const response = await fetch(`/api/sections/${sectionId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete section");
  }
  return response.json();
};
