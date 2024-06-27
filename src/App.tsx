import React, { useState, useEffect } from "react";
import Select from "react-select";
import { TodoList } from "./Components/specific/TodoList";
import Modal from "./Components/common/Modal";
import CreateTodo from "./Components/specific/CreateToDo";
import CreateLabelForm from "./Components/specific/CreateLabelForm";
import { getLabels, createLabel, deleteLabel, sortByReminder } from "./Services/Api/ToDo";
import { Label } from "./Interfaces/todo.interface";
import SortedTodoList from "./Components/specific/SortedTodoList"; // Import SortedTodoList component

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [filterLabel, setFilterLabel] = useState<string>("");
  const [isLabelModalOpen, setIsLabelModalOpen] = useState<boolean>(false);
  const [showSortedTodos, setShowSortedTodos] = useState<boolean>(false); // State to toggle between TodoList and SortedTodoList
  const [upcomingClicked, setUpcomingClicked] = useState<boolean>(false); // State to track if "Upcoming" button is clicked

  useEffect(() => {
    getLabels().then((response) => {
      setLabels(response.data);
    });
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLabelChange = (newValue: any) => {
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
    width: "70rem",
  };

  const upcomingButtonStyles = {
    height: "40px",
    marginLeft: "2rem",
    backgroundColor: upcomingClicked ? "#4CAF50" : "transparent", // Change background color if upcomingClicked is true
    color: upcomingClicked ? "white" : "black", 
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "0 1rem",
    cursor: "pointer",
  };

  const handleUpcomingClick = () => {
    setUpcomingClicked(!upcomingClicked); // Toggle upcomingClicked state
    setShowSortedTodos(!showSortedTodos); // Toggle showSortedTodos state
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TODO List</h1>
        <div style={buttonAndSelectStyles}>
          <button className="plus-button" onClick={openModal} style={buttonStyles}>
            +
          </button>
          <Select
            styles={customStyles}
            onChange={handleLabelChange}
            options={labelOptions}
          />
          <button className="upcoming-button" style={upcomingButtonStyles} onClick={handleUpcomingClick}>
            Upcoming
          </button>
        </div>
      </header>
      {showSortedTodos ? (
        <SortedTodoList onClose={() => setShowSortedTodos(false)} />
      ) : (
        <TodoList filterLabel={filterLabel} />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateTodo onClose={closeModal} labels={labels} />
      </Modal>
      <Modal isOpen={isLabelModalOpen} onClose={() => setIsLabelModalOpen(false)}>
        <CreateLabelForm onSubmit={createNewLabel} />
      </Modal>
    </div>
  );
};

export default App;
