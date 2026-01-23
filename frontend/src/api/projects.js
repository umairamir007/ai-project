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
