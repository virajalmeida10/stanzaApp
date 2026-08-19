import { api } from '../lib/apiClient';
import type { AssistantRequest, AssistantResponse } from '../types/api';

// Ask the AI assistant a free-text question, e.g.
// "Find me a room in New York with a pool this weekend".
export async function askAssistant(message: string): Promise<AssistantResponse> {
    const body: AssistantRequest = { message };
    const { data } = await api.post<AssistantResponse>('/assistant/search', body);
    return data;
}