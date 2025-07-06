// import React, { useState, useEffect } from "react";

// function Todo() {
//   const [tasks, setTasks] = useState([]);
//   const [addtasks, setAddTasks] = useState("");
//   const [completed, setCompleted] = useState([]);

//   useEffect(() => {
//     const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
//     const savedCompleted = JSON.parse(localStorage.getItem("completed")) || [];
//     console.log("Loaded:", savedTasks, savedCompleted);
//     setTasks(savedTasks);
//     setCompleted(savedCompleted);
//   }, []);

//   useEffect(() => {
//     console.log("Saving:", tasks, completed);
//     localStorage.setItem("tasks", JSON.stringify(tasks));
//     localStorage.setItem("completed", JSON.stringify(completed));
//   }, [tasks, completed]);

//   const handleOnChange = (e) => setAddTasks(e.target.value);

//   const handleOnClick = () => {
//     if (addtasks.trim() !== "") {
//       setTasks([...tasks, addtasks]);
//       setCompleted([...completed, false]);
//       setAddTasks("");
//     }
//   };

//   const handleDelete = (index) => {
//     setTasks(tasks.filter((_, i) => i !== index));
//     setCompleted(completed.filter((_, i) => i !== index));
//   };

//   const handleCheckboxChange = (index) => {
//     const updated = [...completed];
//     updated[index] = !updated[index];
//     setCompleted(updated);
//     if (updated[index]) alert("Hurrayyy!! 🎉");
//   };

//   return (
//     <>
//       <h1>TODO LIST📝</h1>
//       <ol>
//         {tasks.map((task, index) => (
//           <li key={index}>
//             <input
//               type="checkbox"
//               checked={completed[index]}
//               onChange={() => handleCheckboxChange(index)}
//             />
//             <span style={{ textDecoration: completed[index] ? "line-through" : "none" }}>
//               {task}
//             </span>
//             <button onClick={() => handleDelete(index)}>delete🗑️</button>
//           </li>
//         ))}
//       </ol>
//       <input placeholder="Add a task" value={addtasks} onChange={handleOnChange} />
//       <button onClick={handleOnClick}>ADD</button>
//     </>
//   );
// }

// export default Todo;





import React, { useState, useEffect } from "react";
import "./Todo.css";

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [addtasks, setAddTasks] = useState("");

  // Load tasks from backend server on mount
  useEffect(() => {
    fetch("http://localhost:4000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(console.error);
  }, []);

  // Add new task API call
  const handleOnClick = () => {
    if (addtasks.trim() === "") return;

    fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: addtasks }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        setAddTasks("");
      })
      .catch(console.error);
  };

  // Delete task API call
  const handleDelete = (id) => {
    fetch(`http://localhost:4000/tasks/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((task) => task._id !== id)))
      .catch(console.error);
  };

  // Toggle completed API call
  const handleCheckboxChange = (task) => {
    fetch(`http://localhost:4000/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed, text: task.text }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(
          tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
        if (updatedTask.completed) alert("Hurrayyy!! 🎉");
      })
      .catch(console.error);
  };

  return (
    <div className="todo-container">
      <h1>TODO LIST📝</h1>
      <ol>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleCheckboxChange(task)}
            />
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>
            <button onClick={() => handleDelete(task._id)}>delete🗑️</button>
          </li>
        ))}
      </ol>
      <input
        placeholder="Add a task"
        value={addtasks}
        onChange={(e) => setAddTasks(e.target.value)}
        type="text"
      />
      <button className="add-btn" onClick={handleOnClick}>
        ADD
      </button>
    </div>
  );
}

export default Todo;
