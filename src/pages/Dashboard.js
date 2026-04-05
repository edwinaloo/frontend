import { useEffect, useState, useCallback } from "react";
import {
  getDashboard,
  getCourses,
  createCourse,
  getAssignments,
  createAssignment,
  toggleAssignment,
} from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

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

  const handleCreate = async () => {
    if (!title) return;

    try {
      await createCourse(token, title);
      setTitle("");
      loadCourses();
    } catch (err) {
      console.error("Error creating course:", err);
    }
  };

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

  const handleCreateAssignment = async () => {
    if (!assignmentTitle || !selectedCourse) return;

    try {
      await createAssignment(token, selectedCourse, assignmentTitle);
      setAssignmentTitle("");
      handleCourseClick(selectedCourse);
    } catch (err) {
      console.error("Error creating assignment:", err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleAssignment(token, id);
      handleCourseClick(selectedCourse);
    } catch (err) {
      console.error("Error toggling assignment:", err);
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
              <div key={a.id}>
                <span
                  onClick={() => handleToggle(a.id)}
                  style={{
                    textDecoration: a.completed ? "line-through" : "none",
                    cursor: "pointer",
                  }}
                >
                  {a.title}
                </span>
              </div>
            ))
          ) : (
            <p>No assignments found</p>
          )}

          <h3>Add Assignment</h3>
          <input
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            placeholder="Assignment name"
          />
          <button onClick={handleCreateAssignment}>Add</button>
        </div>
      )}

      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}