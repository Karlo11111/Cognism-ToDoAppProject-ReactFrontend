// UpdateTodo.tsx

import React, { useEffect, useState } from "react";
import { updateTodo } from "../../Services/Api/ToDo";

interface UpdateTodoProps {
  todo: any;
  onClose: () => void;
}

const UpdateTodo: React.FC<UpdateTodoProps> = ({ todo, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState<string[]>([]); 
  const [reminder, setReminder] = useState("");

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
      setDueDate(todo.dueDate || "");
      setLabels(todo.labels || []);
      setReminder(todo.reminder || "");
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTodo = {
      title,
      description,
      dueDate: dueDate,
      labels: labels.map((label) => label.trim()),
      reminder: reminder,
    };

    try {
      await updateTodo(todo.id, updatedTodo);
      onClose();
    } catch (error) {
      console.error("Error updating TODO", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update TODO</h2>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Due Date:
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </label>
      <label>
        Labels (comma separated):
        <input
          type="text"
          value={labels.join(", ")}
          onChange={(e) => setLabels(e.target.value.split(","))}
        />
      </label>
      <label>
        Reminder:
        <input
          type="date"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
        />
      </label>
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateTodo;
