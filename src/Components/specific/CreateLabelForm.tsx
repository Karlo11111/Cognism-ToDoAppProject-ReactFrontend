import React, { useState } from "react";

interface CreateLabelFormProps {
  onSubmit: (name: string, color: string) => void;
}

const CreateLabelForm: React.FC<CreateLabelFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, color);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create Label</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Color:
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateLabelForm;
