import axios from "../Configs/Axios";

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
export const fetchConversationApi = async (id) => {
  try {
    const response = await axios.get(`/chat/conversations/${id}`); // fix endpoint if needed
    return response.data;
  } catch (err) {
    console.error(
      "Failed to fetch conversation:",
      err.response?.data || err.message
    );
    throw err;
  }
};
export const fetchConversationIdBetweenTwo = async (userId) => {
  try {
    const response = await axios.get(`/chat/conversations/user/${userId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Failed to fetch conversation:",
      err.response?.data || err.message
    );
    throw err;
  }
};
export const deleteConversation = async (conversationId) => {
  try {
    const response = await axios.delete(
      `/chat/conversations/${conversationId}`
    );
    return response.data;
  } catch (err) {
    console.error(
      "Failed to fetch conversation:",
      err.response?.data || err.message
    );
    throw err;
  }
};
export const BlockMessageUser = async (userId) => {
  try {
    const response = await axios.post(`/chat/block/${userId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Failed to fetch conversation:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const GetBlockedUsers = async () => {
  const response = await axios.get(`/chat/block`);
  return response.data;
};

export const EnableNotification = async (conversationId) => {
  const response = await axios.put(`/chat/notification/${conversationId}`);
  return response.data;
};
export async function uploadFileToSas(file) {
  // 1️⃣ Request SAS URL + blob info from backend
  const res = await axios.post("/chat/get-sas-upload", {
    originalName: file.name,
    fileType: file.type,
    size: file.size,
  });
  const { sasUrl, blobname } = res.data.data;
  const blobUrl = sasUrl.split("?")[0]; // clean URL

  // 2️⃣ Upload directly to Azure Blob
  await axios.put(sasUrl, file, {
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type,
    },
  });

  // 3️⃣ Return metadata for message linking
  return {
    blobName: blobname,
    blobUrl,
    originalName: file.name,
    size: file.size,
  };
}
