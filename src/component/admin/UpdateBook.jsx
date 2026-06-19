import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      fetch(`http://localhost:5000/api/books/getAllBooks/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const fetchedBook = data?.message;
          if (!fetchedBook.oldPrice || fetchedBook.oldPrice === 0) {
            fetchedBook.oldPrice = fetchedBook.price;
          }
          setBook(fetchedBook);
          setLoading(false);
        });
    } catch (err) {
      console.error("Error fetching book: ", err);
      setLoading(false);
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...book,
        price: Number(book.price) || 0,
        oldPrice: Number(book.oldPrice) || Number(book.price) || 0,
        stock: Number(book.stock),
        isOnSale: Boolean(book.isOnSale),
      };
      const res = await fetch(
        `http://localhost:5000/api/books/updateBook/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success(data.message, {
        duration: 3000,
        style: {
          border: "1px solid #22C55E",
          padding: "10px",
          color: "#1e293b",
          fontWeight: "bold",
        },
        iconTheme: {
          primary: "#22C55E",
          secondary: "#FFFAEE",
        },
      });
      navigate("/admin/all-books");
    } catch (err) {
      toast.error("Failed to update book");
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this book!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/books/deleteBook/${id}`,
          {
            method: "DELETE",
          },
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        toast.success(data.message || "Book deleted successfully");
        navigate("/admin/all-books");
      } catch (err) {
        toast.error("Failed to delete book");
        console.log(err);
      }
    }
  };

  if (loading)
    return (
      <div className="flex mt-40 justify-center">
        <CircularProgress size={40} />
      </div>
    );
  return (
    <>
      <h3 className="mt-5 p-3 mb-4">Edit Book</h3>
      <div className="max-w-lg mx-auto mt-10 p-6 backdrop-blur-2xl bg-slate-50 shadow rounded-xl">
        <h4 className="mt-5 p-3 text-center text-[25px] font-black text-logo-gold">
          Update Book
        </h4>

        <div className="mt-6">
          <label className="text-[12px] text-gray-400">Title *</label>
          <input
            className="border border-gray-400 rounded-xl p-2 w-full mb-3"
            type="text"
            name="title"
            value={book.title || ""}
            onChange={handleChange}
            placeholder="Title"
          />

          <label className="text-[12px] text-gray-400">Author *</label>
          <input
            className="border border-gray-400 rounded-xl p-2 w-full mb-3"
            type="text"
            name="author"
            value={book.author || ""}
            onChange={handleChange}
            placeholder="Author"
          />
          <label className="text-[12px] text-gray-400">Description *</label>
          <textarea
            className="border border-gray-400 rounded-xl p-2 w-full mb-3"
            name="description"
            value={book.description || ""}
            onChange={handleChange}
            placeholder="Description"
          />

          <label className="text-[12px] text-gray-400">Price after sale</label>
          <input
            className="border border-gray-400 rounded-xl p-2 w-full mb-3"
            type="number"
            name="price"
            value={book.price || ""}
            onChange={handleChange}
            placeholder="Price"
          />

          <label className="text-[12px] text-gray-400">
            Original Price 
          </label>
          <input
            className="border border-gray-400 rounded-xl p-2 w-full mb-3"
            type="number"
            name="oldPrice"
            value={book.oldPrice || ""}
            onChange={handleChange}
            placeholder="oldPrice"
          />

          <input
            className="border border-gray-400 rounded-xl p-2 w-full mb-3"
            type="number"
            name="stock"
            value={book.stock || ""}
            onChange={handleChange}
            placeholder="Stock"
          />
        </div>

        <div className="flex items-center gap-2 mb-4 p-2 bg-amber-50 rounded-xl border border-amber-200">
          <input
            type="checkbox"
            name="isOnSale"
            checked={book.isOnSale || false}
            onChange={(e) => setBook({ ...book, isOnSale: e.target.checked })}
            className="w-5 h-7 cursor-pointer accent-logo-gold"
          />
          <span className="font-bold text-sm cursor-pointer text-amber-900">
            Activate "On Sale" Tag
          </span>
        </div>
        <div className="flex items-center gap-2 mb-4 p-2 bg-amber-50 rounded-xl border border-amber-200">
          <input
            type="checkbox"
            name="isFeatured"
            checked={book.isFeatured || false}
            onChange={(e) => setBook({ ...book, isFeatured: e.target.checked })}
            className="w-5 h-7 cursor-pointer accent-logo-gold"
          />
          <span className="font-bold text-sm cursor-pointer text-amber-900">
            Activate "is Featured" Tag
          </span>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-black! text-white! font-bold hover:bg-logo-gold! hover:text-black! shadow-lg"
            onClick={handleUpdate}
          >
            Save Changes
          </button>
          <button
            className="px-6! py-3! border-2! bg-red-600! border-red-500!  font-bold! rounded-xl! hover:bg-red-400! hover:text-white! transition-all! shadow-sm!"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateBook;
