const API_URL = "http://127.0.0.1:5000";

// LOGIN
export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

// DASHBOARD
export const getDashboard = async (token) => {
  const res = await fetch(`${API_URL}/dashboard/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};