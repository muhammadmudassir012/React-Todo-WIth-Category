import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../redux/DarkModeSlice";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../Config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import { loadingStart, loadingStop } from "../redux/LoaderSlice";
import Navbar from "../Components/Navbar";
import EmptyTodo from "../Assets/NoTodoImage/EmptyTodo.png"

const HomePage = () => {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [category, setCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [authentication, setAuthentication] = useState(true);
  const [userUid, setUserUid] = useState(true);
  const [user, setUser] = useState(true);
  const [firebaseTodos, setFirebaseTodos] = useState([]);

  const predefinedCategories = [
    "Education",
    "Office",
    "Client",
    "Personal",
  ];

  const { mode } = useSelector((state) => state.darkMode);
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.loader);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUser({
            uid: user.uid,
            email: user.email,
            username: userDoc.data().dislayName,
          });
          console.log(userDoc.data());
        } else {
          console.log("No such user data found in Firestore.");
        }
        console.log("user signed in", user.uid);
        setAuthentication(true);
        setUserUid(user.uid);
      } else {
        console.log("user signed out");
        setAuthentication(false);
      }
    });
  }, []);

  const handleAddTodo = async () => {
    if (todoText.trim() && category) {
      if (isEditing) {
        const userTodoRef = doc(db, `users/${user.uid}/todos/${editIndex}`);

        try {
          await updateDoc(userTodoRef, {
            text: todoText,
            category: category,
            timestamp: Timestamp.fromDate(new Date()),
          });
          console.log(`Todo with ID ${editIndex} updated successfully.`);
        } catch (error) {
          console.error("Error updating document:", error);
        }
        setIsEditing(false);
        setEditIndex(null);
        setTodoText("");
        setCategory("");  
      } else {
        try {
          await addDoc(collection(db, `users/${user.uid}/todos`), {
            text: todoText.trim(),
            category: category,
            username: user.username,
            userUid: user.uid,
            date: new Date().toLocaleDateString(),
            timestamp: Timestamp.fromDate(new Date()),
          });
          console.log("Todo added successfully!");
        } catch (error) {
          console.error("Error adding todos:", error);
          alert("Error post!");
        }
      }
      setTodoText("");
      setCategory("");
      setIsModalOpen(false);
    }
  };

  const handleEditTodo = (todos) => {
    setTodoText(todos.text);
    setCategory(todos.category);
    console.log(todos);

    setIsEditing(true);
    setEditIndex(todos.id);
    setIsModalOpen(true);
  };

  const handleDeleteTodo = async (index) => {
    const deleteTodoRef = doc(db, `users/${user.uid}/todos/${index}`);
    try {
      // Delete the blog document
      await deleteDoc(deleteTodoRef);
      Swal.fire({
        icon: "success",
        title: "Delete Successful",
        text: "Blog Deleted Successfully!",
      });
      console.log(`Blog with ID ${index} deleted successfully.`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message,
      });
      console.error("Error deleting document:", error);
    }
  };

  const fetchTodos = async () => {
    const tempTodos = [];
    try {
      const querySnapshot = await getDocs(
        collection(db, `users/${user.uid}/todos`)
      );
      querySnapshot.forEach((doc) => {

        tempTodos.push({ id: doc.id, ...doc.data() });
      });
      setFirebaseTodos(tempTodos);
    } catch (error) {
      console.log("Error fetching Todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const navigate = useNavigate();
  const checkFilter = (value) => {
    console.log(value);
    navigate(`/category/${value}`);
  };
  return (
    <>
      {loader.isLoading ? (
        <Loader />
      ) : (
        <>
        <Navbar/>
        <div
          className={`min-h-screen ${
            mode ? "bg-darkGray text-white" : "bg-gray-100 text-black"
          } flex flex-col items-center px-4 py-6`}
        >
          <div className="flex flex-wrap  gap-4 mt-8">
            <div className="flex space-x-4">
            <input
              placeholder="Add Todo"
              onClick={() => setIsModalOpen(true)}
              className={`w-full max-w-[400px] ${mode ? "bg-darkGray shadow-black" : "bg-white"} text-white px-6 py-3 rounded-lg font-medium shadow-lg transition duration-200`}
            />
            <select
              onChange={(e) => checkFilter(e.target.value)}
              className="bg-purplee w-1/3 hover:bg-darkPurple text-white px-3 py-3 rounded-lg border-none focus:ring-2 focus:ring-purple-400 transition"
            >
              <option value="All">All </option>
              <option value="Education">Education</option>
              <option value="Office">Office</option>
              <option value="Client">Client</option>
              <option value="Personal">Personal</option>
            </select>
            </div>
          </div>

          {/* TODO List */}
          <div className="mt-10 w-full max-w-3xl">
            {firebaseTodos.length > 0 ? (
              firebaseTodos.map((todo, index) => (
                <div
                  key={todo.id}
                  className={`${
                    mode ? "bg-darkGray text-white" : "bg-gray-100 text-black"
                  } px-4 py-3 rounded-lg flex items-center justify-between mb-4 shadow-lg`}
                >
                  <div>
                    {/* <div className="flex flex-row justify-around"> */}
                      <span className="block text-xl font-semibold">{todo.text}</span>
                      <span className="text-sm flex text-gray-400">{todo.category}</span>
                    {/* </div> */}
                    <span className="text-sm text-gray-400">{todo.date}</span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="text-purplee hover:text-darkPurple transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center text-center align-center items-center">
                <img className="" src={EmptyTodo}/>
              </div>
            )}
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className={`fixed inset-0 ${mode ? "bg-darkGray opacity-100" : "bg-gray-100 opacity-100"} flex items-center justify-center z-50`}>
              <div className={`bg-white ${mode ? "dark:bg-darkGray" : "bg-gray-100"} w-96 p-6 shadow-black rounded-lg shadow-lg relative`}>
                <h2 className="text-2xl font-bold text-purplee text-center mb-4">
                  {isEditing ? "Edit Todo" : "Add Todo"}
                </h2>
                <input
                  type="text"
                  placeholder="Todo text"
                  value={todoText}
                  onChange={(e) => setTodoText(e.target.value)}
                  className="w-full text-black mb-4 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-darkPurple focus:outline-none"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mb-4 px-4 py-2 rounded-lg border-2 text-black border-gray-300 dark:border-gray-600 focus:border-darkPurple focus:outline-none"
                >
                  <option value="All">Select Category</option>
                  {predefinedCategories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className={`${mode ? "bg-gray-600" : "dark:bg-gray-300"}  px-4 py-2 rounded-lg`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTodo}
                    className="bg-purplee hover:bg-darkPurple text-white px-4 py-2 rounded-lg"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
      )}
    </>
  );
};

export default HomePage;
