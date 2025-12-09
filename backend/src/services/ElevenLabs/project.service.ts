import Project, { IProject } from "../../models/project.model";
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
