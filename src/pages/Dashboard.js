import { useEffect, useState, useCallback } from "react";
import {
  getDashboard,
  getCourses,
  createCourse,
  getAssignments,
} from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // ✅ Stable function (fixes ESLint warning)
  const loadCourses = useCallback(async () => {
    try {
      const res = await getCourses(token);

      if (Array.isArray(res)) {
        setCourses(res);
      } else {
        console.error("Courses error:", res);
        setCourses([]);
      }
    } catch (err) {
      console.error("Error loading courses:", err);
      setCourses([]);
    }
  }, [token]);

  // ✅ Fetch dashboard + courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dash = await getDashboard(token);
        setData(dash);

        await loadCourses();
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    if (token) fetchData();
  }, [token, loadCourses]);

  // ✅ Create course
  const handleCreate = async () => {
    if (!title) return;

    try {
      await createCourse(token, title);
      setTitle("");
      loadCourses(); // refresh
    } catch (err) {
      console.error("Error creating course:", err);
    }
  };

  // ✅ Click course → load assignments
  const handleCourseClick = async (courseId) => {
    setSelectedCourse(courseId);

    try {
      const res = await getAssignments(token, courseId);

      if (Array.isArray(res)) {
        setAssignments(res);
      } else {
        console.error("Assignments error:", res);
        setAssignments([]);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setAssignments([]);
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <p>Total Courses: {data.total_courses}</p>
      <p>Total Assignments: {data.total_assignments}</p>

      <hr />

      <h3>Create Course</h3>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Course name"
      />
      <button onClick={handleCreate}>Add</button>

      <h3>Your Courses</h3>
      {Array.isArray(courses) && courses.length > 0 ? (
        courses.map((c) => (
          <p
            key={c.id}
            onClick={() => handleCourseClick(c.id)}
            style={{
              cursor: "pointer",
              fontWeight: selectedCourse === c.id ? "bold" : "normal",
            }}
          >
            {c.title}
          </p>
        ))
      ) : (
        <p>No courses found</p>
      )}

      {selectedCourse && (
        <div>
          <h3>Assignments for Course {selectedCourse}</h3>

          {Array.isArray(assignments) && assignments.length > 0 ? (
            assignments.map((a) => (
              <p key={a.id}>{a.title}</p>
            ))
          ) : (
            <p>No assignments found</p>
          )}
        </div>
      )}

      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}