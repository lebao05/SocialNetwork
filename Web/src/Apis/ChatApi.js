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
