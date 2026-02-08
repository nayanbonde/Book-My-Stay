import api from "./api";

const register = (email, password, firstName, lastName, role) => {
    return api.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
        role,
    });
};

const login = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });
    if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error("Error parsing user from localStorage", e);
        return null;
    }
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
