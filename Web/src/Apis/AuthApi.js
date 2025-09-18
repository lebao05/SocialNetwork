import Axios from "../Configs/Axios"
export const registerAPI = async (registerDto) => {
  // registerDto = { name, email, password, gender }
  const res = await Axios.post("/auth/register", registerDto, {
    withCredentials: true, // <-- important: send cookies
  });
  return res.data;
};

// --- Login ---
export const loginAPI = async (loginDto) => {
  // loginDto = { email, password }
  const res = await Axios.post("/auth/login", loginDto, {
    withCredentials: true, // <-- needed for cookie-based auth
  });
  return res.data;
};

// --- Logout ---
export const logoutAPI = async () => {
  const res = await Axios.post("/auth/logout", {}, { withCredentials: true });
  return res.data;
};