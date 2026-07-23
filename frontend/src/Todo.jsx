import api from './api/config';
import React, { useEffect, useState } from 'react';

export const TodoApp = () => {
  const [todos, setTodo] = useState([]);
  const [task, setTask] = useState(""); // new state for input

  // Fetch all todos
  const fetchAllTodos = async () => {
    try {
      const res = await api.get("/todo/findall");
      setTodo(res.data);
    } catch (error) {
      console.log("error fetching data", error);
    }
  };

  // Add a todo
  const addTodo = async () => {
    if (!task.trim()) return; // prevent empty input
    try {
      const res = await api.post("/todo/addtodo", {
        task,
      });
      setTodo([...todos, res.data]); // append new task to state
      setTask(""); // clear input
    } catch (error) {
      console.log("error adding todo", error);
    }
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">My Todos</h2>

      {/* Add Todo Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task..."
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <ul>
        {todos.map((t) => (
          <li key={t._id} className="p-2 border-b">
            {t.task}
          </li>
        ))}
      </ul>
    </div>
  );
};
