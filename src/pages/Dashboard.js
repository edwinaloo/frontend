import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    getDashboard(token)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <p>Total Courses: {data.total_courses}</p>
      <p>Total Assignments: {data.total_assignments}</p>
      <p>Completed: {data.completed}</p>
      <p>Pending: {data.pending}</p>
    </div>
  );
}