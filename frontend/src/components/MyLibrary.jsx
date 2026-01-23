import React, { useState, useEffect } from "react";
import Navbar from "./navbar/Navbar";
import { getProjects } from "../api/projects";

const MyLibrary = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
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
                  {/* Download icon - can be implemented later */}
                  {project.voice && (
                    <button
                      onClick={() => {
                        if (project.voice) {
                          window.open(project.voice, "_blank");
                        }
                      }}
                      title="Download"
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
                  <button className="text-xl" title="More options">
                    ⋯
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyLibrary;
