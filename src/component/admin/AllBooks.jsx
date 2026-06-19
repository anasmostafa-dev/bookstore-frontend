import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
const AllBooks = () => {
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/getAllBooks", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401 || res.status === 403) {
          setError("Not Authorized");
          navigate("/", { replace: true });
          return;
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setBookList(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books", err);
        setError(err.message);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) {
      if (isAuthenticated && isAdmin) {
        fetchBooks();
      } else {
        console.log("Not Authenticated Or Not Admin");
        navigate("/", { replace: true });
      }
    }
  }, [navigate, isAuthenticated, isAdmin, authLoading]);
  if (loading)
    return (
      <div className="container mx-auto px-4 py-10 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <h3 className="mb-7">All Books</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 m-3">
        {bookList?.map((book) => {
          return (
            <a key={book._id} href={`/admin/update-book/${book?._id}`}>
              <div className="flex flex-col bg-gray-50 overflow-hidden gap-3 cursor-pointer border rounded-2xl border-gray-300 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                <img
                  src={book.coverImage}
                  className="w-full h-80 object-cover rounded-xl"
                />

                <h6 className="font-bold text-gray-800">{book?.title}</h6>
                <span className="text-xs text-gray-500">{book?.author}</span>
                <p
                  className={`text-[11px] ${book?.stock < 5 ? "text-red-500 font-medium" : "text-gray-400"}`}
                >
                  {book?.stock < 5
                    ? `Only ${book?.stock} left!`
                    : `In Stock: ${book?.stock}`}
                </p>
                <div className="flex items-center justify-between">
                  <strong className="text-lg text-logo-gold">
                    {book?.price} EGP
                  </strong>

                  <button className="bg-black! px-2! py-2! rounded-full! hover:bg-logo-gold! transition-colors!">
                    <EditIcon />
                  </button>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default AllBooks;
