import React, { useState, useEffect } from "react";
import Select, { ActionMeta, SingleValue } from "react-select";
import { TodoList } from "./Components/specific/TodoList";
import Modal from "./Components/common/Modal";
import CreateTodo from "./Components/specific/CreateToDo";
import CreateLabelForm from "./Components/specific/CreateLabelForm";
import { getLabels, createLabel, deleteLabel } from "./Services/Api/ToDo";
import { Label } from "./Interfaces/todo.interface";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [filterLabel, setFilterLabel] = useState<string>("");
  const [isLabelModalOpen, setIsLabelModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getLabels().then((response) => {
      setLabels(response.data);
    });
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  type OptionType = { label: string | JSX.Element; value: string };

  // Update handleLabelChange to match the expected signature
  const handleLabelChange = (
    newValue: OptionType | null,
    actionMeta: ActionMeta<OptionType>
  ) => {
    if (newValue?.value === "new") {
      setIsLabelModalOpen(true);
    } else {
      setFilterLabel(newValue ? newValue.value : "");
    }
  };

  const createNewLabel = async (name: string, color: string) => {
    const response = await createLabel({ name, color });
    setLabels([...labels, response.data]);
    setIsLabelModalOpen(false);
  };

  const handleDeleteLabel = async (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation(); // Prevent click event from bubbling up
    await deleteLabel(id);
    const updatedLabels = labels.filter((label) => label.id !== id);
    setLabels(updatedLabels);
  };

  const labelOptions = [
    { value: "", label: "All Labels" },
    ...labels.map((label) => ({
      value: label.name,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{label.name}</span>
          <button onClick={(event) => handleDeleteLabel(label.id, event)}>
            Delete
          </button>
        </div>
      ),
    })),
    { value: "new", label: "Create New Label" },
  ];

  // Custom styles for react-select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: "30px",
      height: "40px",
      fontSize: "12px",
      width: "200px",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: "30px",
      padding: "0 6px",
    }),
    input: (provided: any) => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "30px",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: "none",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: "4px",
    }),
  };

  const buttonStyles = {
    width: "60px",
    height: "40px",
    marginRight: "2rem",
    marginBottom: "2rem",
  };

  const buttonAndSelectStyles = {
    display: "flex",
    width: "50rem",
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TODO List</h1>
        <div style={buttonAndSelectStyles}>
          <button
            className="plus-button"
            onClick={openModal}
            style={buttonStyles}
          >
            +
          </button>
          <Select
            styles={customStyles}
            value={labelOptions.find((option) => option.value === filterLabel)}
            onChange={handleLabelChange}
            options={labelOptions}
          />
        </div>
      </header>
      <TodoList filterLabel={filterLabel} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateTodo onClose={closeModal} labels={labels} />
      </Modal>
      <Modal
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
      >
        <CreateLabelForm onSubmit={createNewLabel} />
      </Modal>
    </div>
  );
};

export default App;
