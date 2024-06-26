import React, { useState, useEffect } from "react";
import Select from "react-select";
import Modal from "../common/Modal";
import { getLabels, createLabel, deleteLabel } from "../../Services/Api/ToDo";

interface Label {
  id: string;
  name: string;
  color?: string;
}

interface LabelChooserProps {
  initialLabels: Label[];
  onLabelChange: (labelId: string | null) => void;
  onNewLabelSubmit: (label: Label) => void;
}

const LabelChooser: React.FC<LabelChooserProps> = ({
  initialLabels,
  onLabelChange,
  onNewLabelSubmit,
}) => {
  const [labels, setLabels] = useState<Label[]>(initialLabels);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [showNewLabelModal, setShowNewLabelModal] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("");

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      const response = await getLabels();
      setLabels(response.data);
    } catch (error) {
      console.error("Error fetching labels:", error);
    }
  };

  const handleLabelChange = (selectedOption: Label | null) => {
    setSelectedLabel(selectedOption);
    onLabelChange(selectedOption ? selectedOption.id : null);
  };

  const handleNewLabelSubmit = async () => {
    try {
      const newLabel = { name: newLabelName, color: newLabelColor };
      const response = await createLabel(newLabel);

      if (response.status === 201) {
        setLabels([...labels, response.data]);
        onNewLabelSubmit(response.data);
        setShowNewLabelModal(false);
        setNewLabelName("");
        setNewLabelColor("");
      } else {
        console.error("Failed to create new label:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating new label:", error);
    }
  };

  const handleDeleteLabel = async (id: string) => {
    try {
      await deleteLabel(id);
      setLabels(labels.filter((label) => label.id !== id));
      onLabelChange(null);
    } catch (error) {
      console.error("Error deleting label:", error);
    }
  };

  const customOption = (props: any) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span>{data.name}</span>
        <button onClick={() => handleDeleteLabel(data.id)}>Delete</button>
      </div>
    );
  };

  const options = labels.map((label) => ({
    value: label.id,
    label: label.name,
    ...label,
  }));

  return (
    <>
      <div>
        <Select
          value={selectedLabel}
          onChange={handleLabelChange}
          options={options}
          components={{ Option: customOption }}
          placeholder="Select a label"
        />
        <button onClick={() => setShowNewLabelModal(true)}>
          + Add New Label
        </button>
      </div>
      <Modal
        isOpen={showNewLabelModal}
        onClose={() => setShowNewLabelModal(false)}
      >
        <h2>Create New Label</h2>
        <label>
          Name:
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            required
          />
        </label>
        <label>
          Color (optional):
          <input
            type="text"
            value={newLabelColor}
            onChange={(e) => setNewLabelColor(e.target.value)}
          />
        </label>
        <button onClick={handleNewLabelSubmit}>Create</button>
      </Modal>
    </>
  );
};

export default LabelChooser;
