import { useEffect, useState } from "react";
import { deleteTodo, getTodos, getTodosByLabel } from "../../Services/Api/ToDo";
import "../../Assets/styles/TodoList.css";
import UpdateTodo from "./UpdateTodo";
import Modal from "../common/Modal";
import { Todo } from "../../Interfaces/todo.interface";

interface TodoListProps {
  filterLabel: string;
}

export const TodoList: React.FC<TodoListProps> = ({ filterLabel }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchTodos();
  }, [filterLabel]);

  const fetchTodos = async () => {
    try {
      const response = filterLabel
        ? await getTodosByLabel(filterLabel)
        : await getTodos();
      setTodos(response.data);
    } catch (e) {
      console.error("Error fetching todos", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (e) {
      console.error("Error deleting todo", e);
    }
  };

  const handleUpdateClick = (todo: Todo) => {
    setSelectedTodo(todo);
    openModal();
  };

  const handleUpdateClose = () => {
    setSelectedTodo(null);
    fetchTodos(); // Refresh todos after update
  };

  return (
    <div>
      <ul className="todo-list">
        {todos.map((todo) => (
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
                  <button onClick={() => handleUpdateClick(todo)}>
                    Update
                  </button>
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
