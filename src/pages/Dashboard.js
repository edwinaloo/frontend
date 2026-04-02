import { useEffect, useState } from "react";
import { getDashboard, getCourses, createCourse } from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dash = await getDashboard(token);
        setData(dash);

        const courseRes = await getCourses(token);
        console.log("Courses response:", courseRes);
        setCourses(courseRes);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleCreate = async () => {
    if (!title) return;

    try {
      await createCourse(token, title);
      setTitle("");

      const updated = await getCourses(token);
      setCourses(updated);
    } catch (err) {
      console.error(err);
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
      {courses.map((c) => (
        <p key={c.id}>{c.title}</p>
      ))}

      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}