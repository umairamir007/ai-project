import httpClient from "../lib/httpClient";

/**
 * Fetch all projects for the current user
 * @returns {Promise<{message: string, project: Array}>}
 */
export async function getProjects() {
  try {
    const { data } = await httpClient.get("/projects");
    return data;
  } catch (err) {
    if (err.response) {
      console.error("Get projects error:", err.response.status, err.response.data);
      throw new Error(
        err.response.data?.error || `Failed to fetch projects (${err.response.status})`
      );
    }
    throw new Error(err.message || "Failed to fetch projects");
  }
}

/**
 * Delete a project by ID
 * @param {string} projectId - The ID of the project to delete
 * @returns {Promise<{message: string, project: Object}>}
 */
export async function deleteProject(projectId) {
  try {
    const { data } = await httpClient.delete(`/projects/${projectId}`);
    return data;
  } catch (err) {
    if (err.response) {
      console.error("Delete project error:", err.response.status, err.response.data);
      throw new Error(
        err.response.data?.error || `Failed to delete project (${err.response.status})`
      );
    }
    throw new Error(err.message || "Failed to delete project");
  }
}

/**
 * Download a project file through backend proxy
 * @param {string} fileUrl - The URL of the file to download
 * @param {string} filename - The desired filename for the download
 * @returns {Promise<Blob>}
 */
export async function downloadProjectFile(fileUrl, filename) {
  try {
    const response = await httpClient.get("/projects/download", {
      params: { fileUrl, filename },
      responseType: "blob", // Important: set responseType to blob
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("Download file error:", err.response.status, err.response.data);
      throw new Error(
        err.response.data?.error || `Failed to download file (${err.response.status})`
      );
    }
    throw new Error(err.message || "Failed to download file");
  }
}
