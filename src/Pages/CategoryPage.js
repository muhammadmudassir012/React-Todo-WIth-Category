import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../Config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../Components/Loader";
import { loadingStart, loadingStop } from "../redux/LoaderSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import EmptyTodo from "../Assets/NoTodoImage/EmptyTodo.png"

function CategoryPage() {
  const { name } = useParams();
  const [firebaseTodos, setFirebaseTodos] = useState([]);
  const [user, setUser] = useState(true);
  const [userUid, setUserUid] = useState(true);
  const [authentication, setAuthentication] = useState(true);
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

  
  const fetchTodos = async () => {
    const tempTodos = [];
    try {
      const querySnapshot = await getDocs(collection(db, `users/${user.uid}/todos`)); 
      querySnapshot.forEach((doc) => {
        tempTodos.push({ id: doc.id, ...doc.data() });
    });
    const filtered = tempTodos.filter((todo) => todo.category === name);
      // dispatch(loadingStop());
      setFirebaseTodos(filtered);
    } catch (error) {
      console.log("Error fetching Todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos(); 
  }, [fetchTodos]);




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

  return (
    <>
      {loader.isLoading ? (
        <Loader />
      ) : (
        <>
        <Navbar/>
        <div className={`min-h-screen ${mode ? "bg-darkGray text-white" : "bg-gray-100 text-black"} flex flex-col items-center px-4 py-6`}>
          <h1 className="text-3xl font-bold mb-6 text-center">{name} Todos</h1>
          {firebaseTodos.length > 0 ? (
            <div className="w-full max-w-4xl">
              <table className={`w-full border-collapse ${mode ? "bg-darkGray " : "bg-gray-100 "} text-left text-sm shadow-lg`}>
                <thead className="bg-gray-500 text-gray-200 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="py-3 px-6">Task</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {firebaseTodos.map((todo) => (
                    <tr key={todo.id} className={`${mode ? "hover:bg-gray-600" : "hover:bg-gray-200"} transition`}>
                      <td className={`py-4 px-6 font-medium ${mode ? "text-gray-100" : "text-black"}`}>
                        {todo.text}
                      </td>
                      <td className={`py-4 px-6 ${mode ? "text-gray-400" : "text-black"}`}>
                        {todo.category}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center space-x-4">
                          <button
                            className="text-red-400 hover:text-red-300 transition"
                            onClick={() =>
                              handleDeleteTodo && handleDeleteTodo(todo.id)
                            }
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // <p className="text-center">No todos found in this category.</p>
            <img className="w-64" src={EmptyTodo}/>
        )}
        </div>
        </>
      )}
    </>
  );
}

export default CategoryPage;
