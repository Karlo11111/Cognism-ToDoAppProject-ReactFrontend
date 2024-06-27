import React, { useEffect, useState } from "react";
import Select, { ActionMeta, MultiValue } from "react-select";
import { getLabels, updateTodo } from "../../Services/Api/ToDo";
import "../../Assets/styles/CreateTodo.css";
import { Label } from "../../Interfaces/todo.interface";

interface UpdateTodoProps {
  todo: any;
  onClose: () => void;
}
const UpdateTodo: React.FC<UpdateTodoProps> = ({ todo, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminder, setReminder] = useState("");
  const [labels, setLabels] = useState<{ label: string; value: string }[]>([]);
  const [labelOptions, setLabelOptions] = useState<{ value: string; label: string }[]>([]); // State to hold label options

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
      setDueDate(todo.dueDate || "");
      setLabels(
        (todo.labels || []).map((label: string) => ({
          label,
          value: label,
        }))
      );
      setReminder(todo.reminder || "");

      // Fetch labels from the API
      fetchLabels();
    }
  }, [todo]);

  const fetchLabels = async () => {
    try {
      const response = await getLabels();
      const fetchedLabels = response.data.map((label: any) => ({
        value: label.name,
        label: label.name,
      }));
      setLabelOptions(fetchedLabels);
    } catch (error) {
      console.error("Error fetching labels:", error);
    }
  };

  const handleLabelChange = (
    newValue: MultiValue<{ label: string; value: string }>
  ) => {
    setLabels(newValue as { label: string; value: string }[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTodo = {
      title,
      description,
      dueDate,
      labels: labels.map((label) => label.value),
      reminder,
    };

    try {
      await updateTodo(todo.id, updatedTodo);
      onClose();
    } catch (error) {
      console.error("Error updating TODO", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
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
        Labels:
        <Select
          isMulti
          value={labels}
          onChange={handleLabelChange}
          options={labelOptions}
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
