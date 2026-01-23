import React, { useState, useEffect } from "react";
import Navbar from "./navbar/Navbar";
import { getProjects, deleteProject, downloadProjectFile } from "../api/projects";
import ConfirmationModal from "./modal/ConfirmationModal";

const MyLibrary = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    projectId: null,
    projectName: null,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  // Refresh data when window regains focus (e.g., after returning to tab)
  useEffect(() => {
    const handleFocus = () => {
      fetchProjects();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects();
      setProjects(response.project || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredProjects = projects.filter((project) =>
    project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (projectId, projectName) => {
    setDeleteModal({
      isOpen: true,
      projectId,
      projectName,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.projectId) return;

    try {
      await deleteProject(deleteModal.projectId);
      // Refresh the projects list after successful deletion
      await fetchProjects();
      setDeleteModal({ isOpen: false, projectId: null, projectName: null });
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert(err.message || "Failed to delete project. Please try again.");
      setDeleteModal({ isOpen: false, projectId: null, projectName: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, projectId: null, projectName: null });
  };

  const handleDownload = async (fileUrl, projectName) => {
    try {
      // Get the file extension from the URL or default to .mp3
      const urlParts = fileUrl.split(".");
      const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split("?")[0] : "mp3";
      const filename = `${projectName || "project"}.${extension}`;
      
      // Download through backend proxy to force download
      const blob = await downloadProjectFile(fileUrl, filename);
      
      // Create a temporary anchor element and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download file:", err);
      alert(err.message || "Failed to download file. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full bg-theme">
      <Navbar />
      <div className="flex w-full h-full py-40">
        <div className="w-[90%] mx-auto text-[#DEDEDE] p-10">
          {/* Top Bar */}
          <div className="flex justify-end mb-10">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[260px] h-[48px] rounded-full bg-[#D9D9D9] text-black placeholder-black px-5 outline-none font-semibold"
            />
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 pb-3 border-b border-[#DEDEDE] 4xl:text-2xl sm:text-xl text-lg font-bold">
            <div>Title</div>
            <div>Created at</div>
            <div></div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-3 py-5 border-b border-[#DEDEDE] text-center">
              <div colSpan="3" className="col-span-3">
                Loading projects...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="grid grid-cols-3 py-5 border-b border-[#DEDEDE] text-center">
              <div colSpan="3" className="col-span-3 text-red-400">
                {error}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProjects.length === 0 && (
            <div className="grid grid-cols-3 py-5 border-b border-[#DEDEDE] text-center">
              <div colSpan="3" className="col-span-3">
                {searchTerm ? "No projects found matching your search." : "No projects yet."}
              </div>
            </div>
          )}

          {/* Projects List */}
          {!loading &&
            !error &&
            filteredProjects.map((project) => (
              <div
                key={project._id || project.id}
                className="grid grid-cols-3 py-5 border-b border-[#DEDEDE] sm:text-lg text-sm 4xl:text-xl font-bold"
              >
                <div className="font-semibold">
                  {project.name || "Untitled Project"}
                </div>
                <div>{formatDate(project.createdAt)}</div>
                <div className="flex items-center justify-end gap-4">
                  {/* Download icon */}
                  {project.voice && (
                    <button
                      onClick={() => handleDownload(project.voice, project.name)}
                      title="Download"
                      className="hover:opacity-70 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(project._id || project.id, project.name)}
                    title="Delete project"
                    className="hover:opacity-70 transition-opacity text-red-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.projectName || "this project"}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonColor="destructive"
      />
    </div>
  );
};

export default MyLibrary;
