// filepath: /Users/harshita_shar25/Sheldon-Main/Sheldon_main/src/services/caseService.ts
import { CaseModule } from "../../CaseQuest/src/types/case";

// Function to fetch a case module by ID
export const fetchCaseModule = async (moduleId: string): Promise<CaseModule> => {
  try {
    const response = await fetch(`/api/modules/${moduleId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch case module: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching case module:", error);
    throw error;
  }
};
