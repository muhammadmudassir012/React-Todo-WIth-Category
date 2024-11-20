import React, { useState } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../redux/DarkModeSlice";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../Config/FirebaseConfig";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [category, setCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  const predefinedCategories = ["Education", "Transportation", "Work", "Personal"];

  const { mode } = useSelector((state) => state.darkMode);
  const dispatch = useDispatch();

  const handleAddTodo = async () => {
    if (todoText.trim() && category) {
      if (isEditing) {
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = { text: todoText.trim(), category };
        setTodos(updatedTodos);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        setTodos([...todos, { text: todoText.trim(), category }]);
        // try {
        //     await addDoc(collection(db, `users/${user.uid}/todos`), {
        //       text: todoText.trim(),
        //       category: category,
        //       username: user.username,
        //       userUid: user.uid,
        //       date: new Date().toLocaleDateString(),
        //       timestamp: Timestamp.fromDate(new Date()),
        //     });
        //   } catch (error) {
        //     console.error("Error adding todos:", error);
        //     alert("Error post!");
        //   }
      }
      setTodoText("");
      setCategory("");
      setIsModalOpen(false);
    }
  };

  const handleEditTodo = (index) => {
    setTodoText(todos[index].text);
    setCategory(todos[index].category);
    setIsEditing(true);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const filteredTodos =
    filterCategory === "All" ? todos : todos.filter((todo) => todo.category === filterCategory);

  return (
    <div className={`min-h-screen ${mode ? "bg-darkGray text-white" : "bg-gray-100 text-black"} flex flex-col items-center px-4 py-6`}>
      {/* Header */}
      <h1 className="text-4xl font-extrabold mt-6 text-purple-400">TODO LIST</h1>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        {/* Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition duration-200"
        >
          Add Todo
        </button>

        {/* Category Filter Dropdown */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-800 text-white px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-purple-400 transition"
        >
          <option value="All">All Categories</option>
          {predefinedCategories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Theme Toggle Button */}
        {/* <button
          onClick={() => dispatch(toggleDarkMode())}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg shadow-lg transition"
        >
          Toggle Theme
        </button> */}
      </div>

      {/* TODO List */}
      <div className="mt-10 w-full max-w-3xl">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo, index) => (
            <div
              key={index}
              className="bg-darkGray text-gray-300 px-4 py-3 rounded-lg flex items-center justify-between mb-4 shadow-lg"
            >
              <div>
                <span className="block font-semibold">{todo.text}</span>
                <span className="text-sm text-gray-400">{todo.category}</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEditTodo(index)}
                  className="text-purple-400 hover:text-purple-300 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteTodo(index)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No tasks yet. Add some!</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-darkGray w-96 p-6 rounded-lg shadow-lg relative">
            <h2 className="text-2xl font-bold text-purple-500 text-center mb-4">{isEditing ? "Edit Todo" : "Add Todo"}</h2>
            <input
              type="text"
              placeholder="Todo text"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              className="w-full text-black mb-4 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-purple-400 focus:outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded-lg border-2 text-black border-gray-300 dark:border-gray-600 focus:border-purple-400 focus:outline-none"
            >
              <option value="">Select Category</option>
              {predefinedCategories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTodo}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
