// src/api/userApi.js
import Axios from "../Configs/Axios";

// ✅ Upload avatar
export const uploadAvatarApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log("Uploading file:", file);
  const res = await Axios.post("/user/uploadavatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("Upload response:", res);
  return res.data;
};

// ✅ Upload cover
export const uploadCoverApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await Axios.post("/user/uploadcover", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ✅ Work APIs
export const addWorkApi = async (data) => {
  const res = await Axios.post("/user/work", data);
  return res.data;
};

export const updateWorkApi = async (data) => {
  const res = await Axios.put("/user/work", data);
  return res.data;
};

export const deleteWorkApi = async (id) => {
  const res = await Axios.delete(`/user/work/${id}`);
  return res.data;
};

export const getAllWorksApi = async () => {
  const res = await Axios.get("/user/work/all");
  return res.data;
};

// ✅ Education APIs
export const addEducationApi = async (data) => {
  const res = await Axios.post("/user/education", data);
  return res.data;
};

export const updateEducationApi = async (data) => {
  const res = await Axios.put("/user/education", data);
  return res.data;
};

export const deleteEducationApi = async (id) => {
  const res = await Axios.delete(`/user/education/${id}`);
  return res.data;
};

export const getAllEducationsApi = async () => {
  const res = await Axios.get("/user/education/all");
  return res.data;
};

// ✅ Update basic info
export const updateBasicInfoApi = async (data) => {
  const res = await Axios.put("/user/info", data);
  return res.data;
};

// ✅ Get current user profile
export const getMeApi = async () => {
  const res = await Axios.get("/user/getme");
  return res.data;
};
export const getProfileApi = async (userId) => {
  const res = await Axios.get("/user/profile/" + userId);
  return res.data;
};
