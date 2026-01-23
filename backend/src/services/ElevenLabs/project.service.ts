import Project, { IProject } from "../../models/project.model";
import { NotFoundError } from "../../utils/AppError";
import { uploadVoiceToSpaces } from "../../utils/digitalocean";


export const createProjectService = async (
    userId: string,
    name: string,
    text: string,
    file?: Express.Multer.File
): Promise<IProject> => {
    
    let voiceUrl = "";

    if (file) {
        voiceUrl = await uploadVoiceToSpaces(file);
    }

    const project = await Project.create({
        userId,
        name,
        text,
        voice: voiceUrl,
    });

    return project;
};

export const getProjectService = async (userId: string): Promise<IProject[]> => {
    const projects = await Project.find({ userId });
    if (!projects) {
        throw new NotFoundError("No projects found");
    }
    return projects;
}