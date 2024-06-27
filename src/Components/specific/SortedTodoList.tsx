import React, { useEffect, useState } from "react";
import { sortByReminder, getLabels } from "../../Services/Api/ToDo"; // Assuming getLabels fetches labels
import "../../Assets/styles/TodoList.css";
import UpdateTodo from "./UpdateTodo";
import Modal from "../common/Modal";
import { Todo, Label } from "../../Interfaces/todo.interface";

interface SortedTodoListProps {
  onClose: () => void; 
}

const SortedTodoList: React.FC<SortedTodoListProps> = ({ onClose }) => {
  const [sortedTodos, setSortedTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  useEffect(() => {
    fetchSortedTodos();
  }, []);

  const fetchSortedTodos = async () => {
    try {
      const response = await sortByReminder();
      setSortedTodos(response.data);
    } catch (error) {
      console.error("Error fetching upcoming todos", error);
    }
  };

  const handleUpdateClick = (todo: Todo) => {
    setSelectedTodo(todo);
    openModal();
  };

  const handleUpdateClose = () => {
    setSelectedTodo(null);
    fetchSortedTodos(); // Refresh sorted todos after update
  };

  const handleDelete = async (id: string) => {
    // Implement delete functionality if needed
  };

  return (
    <div>
      <ul className="todo-list">
        {sortedTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div className="todo-checkbox">
              <input type="checkbox" />
            </div>
            <div className="todo-content">
              <div className="todo-main">
                <h2>{todo.title}</h2>
                <p>{todo.description}</p>
              </div>
              <div className="todo-details">
                <p>
                  <strong>Due Date:</strong> {todo.dueDate}
                </p>
                <p>
                  <strong>Reminder:</strong> {todo.reminder}
                </p>
                <p>
                  <strong>Labels:</strong> {todo.labels.join(", ")}
                </p>
              </div>
              <div className="todo-edit">
                <p>
                  <button onClick={() => handleUpdateClick(todo)}>Update</button>
                </p>
              </div>
              <div className="todo-delete">
                <p>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {selectedTodo && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <UpdateTodo todo={selectedTodo} onClose={handleUpdateClose} />
        </Modal>
      )}
    </div>
  );
};

export default SortedTodoList;