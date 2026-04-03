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

export const getCourses = async (token) => {
  const res = await fetch(`${API_URL}/courses/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

export const createCourse = async (token, title) => {
  const res = await fetch("http://127.0.0.1:5000/courses/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title })
  });

  return res.json();
};

export const getAssignments = async (token, courseId) => {
  const res = await fetch(`${API_URL}/courses/${courseId}/assignments/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
}