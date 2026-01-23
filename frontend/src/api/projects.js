import httpClient from "../lib/httpClient";

/**
 * Create a new project with voice file, name, and text
 * @param {string} name - The name of the project
 * @param {string} text - The transcribed text
 * @param {Blob} audioBlob - The audio blob to upload
 * @returns {Promise<{message: string, project: Object}>}
 */
export async function createProject(name, text, audioBlob) {
  try {
    const formData = new FormData();
    // Determine file extension based on blob type
    const extension = audioBlob.type.includes("webm") 
      ? "webm" 
      : audioBlob.type.includes("mp4") 
      ? "mp4" 
      : "webm"; // fallback
    formData.append("voice", audioBlob, `voice-recording.${extension}`);
    formData.append("name", name);
    formData.append("text", text);

    const { data } = await httpClient.post("/projects", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (err) {
    if (err.response) {
      console.error("Create project error:", err.response.status, err.response.data);
      throw new Error(
        err.response.data?.error || `Failed to create project (${err.response.status})`
      );
    }
    throw new Error(err.message || "Failed to create project");
  }
}

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
