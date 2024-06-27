import React, { useState } from "react";
import Select, { MultiValue } from "react-select";
import { createTodo, getTodos } from "../../Services/Api/ToDo";
import "../../Assets/styles/CreateTodo.css";
import { Label } from "../../Interfaces/todo.interface";

interface CreateTodoProps {
  onClose: () => void;
  labels: Label[];
}

const CreateTodo: React.FC<CreateTodoProps> = ({ onClose, labels }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [selectedLabels, setSelectedLabels] = useState<
    { label: string; value: string }[]
  >([]);
  const [reminder, setReminder] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTodo = {
      title,
      description,
      dueDate,
      labels: selectedLabels.map((label) => label.value),
      reminder,
    };

    try {
      await createTodo(newTodo);
      onClose();
    } catch (error) {
      console.error("Error creating TODO", error);
    }
  };

  const handleLabelChange = (
    selectedOptions: MultiValue<{ label: string; value: string }>
  ) => {
    setSelectedLabels(selectedOptions as { label: string; value: string }[]);
  };

  const labelOptions = labels.map((label) => ({
    value: label.name,
    label: label.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create TODO</h2>
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
          value={selectedLabels}
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
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateTodo;
