import axios from "../Configs/Axios"

export async function fetchConversations() {
    try {
        const res = await axios.get("/chat/conversations");
        return res.data;
    } catch (err) {
        console.error("Failed to fetch conversations:", err);
        throw err;
    }
}

export async function fetchMessages(conversationId, page = 1, pageSize = 10) {
    try {
        const res = await axios.get(
            `/chat/conversations/${conversationId}/messages`,
            {
                params: { page, pageSize },
            }
        );
        return res.data;
    } catch (err) {
        console.error("Failed to fetch messages:", err);
        throw err;
    }
}
export const createConversationApi = async (dto) => {
    try {
        const response = await axios.post(
            "/chat/conversations", // adjust base URL if needed
            dto,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Create conversation API failed:", error);
        throw error;
    }
};