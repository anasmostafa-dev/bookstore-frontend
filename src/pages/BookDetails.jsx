import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Plus, ShoppingBasket, ShoppingCart } from "lucide-react";
import { useCart } from "../auth/CartContext";
import toast from "react-hot-toast";
import Stack from "@mui/material/Stack";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [adding, setAdding] = useState(null);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      fetch(`http://localhost:5000/api/books/getAllBooks/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setBook(data.message);
          setLoading(false);
        });
    } catch (err) {
      console.error("Error fetching book: ", err);
      setLoading(false);
    }
  }, [id]);
  if (loading)
    return (
      <div className="flex mt-44 justify-center ">
        <CircularProgress className="text-slate-800!" size={40} />
      </div>
    );

  const currentPrice = Number(book.price);
  const oldPrice = Number(book.oldPrice);
  const handleAdd = async (book) => {
    try {
      if (book.stock <= 0) {
        toast.error("Sorry, this book is now out of stock");
        return;
      }
      setAdding(book._id);
      await addToCart(book._id);
      setAdding(null);
      setBook((prev) => ({
        ...prev,
        stock: prev.stock - 1,
      }));
      toast.success(`Added ${book.title} to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(null);
    }
  };
  return (
    <div className="mt-10 mb-20 w-full mx-auto px-6">
      <div className="w-full flex md:flex-row flex-col gap-10 md:gap-15 items-center border-2 border-gray-100 bg-white drop-shadow-xl rounded-2xl p-6">
        <div className="flex justify-center md:justify-start">
          <img
            className="w-96 md:w-80 h-112 md:h-120 object-cover rounded-lg shadow hover:scale-105 cursor-pointer transition-all duration-500"
            src={book.coverImage}
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2 ">
          <p className="text-green-700 bg-green-100 mt-5 w-fit rounded-2xl px-6 py-1 font-bold font-sans cursor-pointer">
            {book?.category?.name}
          </p>
          <h2 className="font-black text-4xl font-sans my-7">{book?.title}</h2>

          <p
            className={`${book?.stock > 0 ? "text-green-700 bg-green-100 " : "text-red-600 bg-red-100"} w-fit rounded-2xl px-6 py-1 font-bold font-sans cursor-pointer`}
          >
            {book?.stock > 0 ? `${book.stock} Avaliable` : "Out Of Stock"}
          </p>

          <div className="bg-gray-100 border w-full border-gray-200 rounded-2xl p-3 my-15">
            <div className="flex gap-3 items-center">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-logo-gold">
                  {currentPrice}
                </span>
                <span className="text-lg font-bold text-logo-gold">EGP</span>
              </div>

              {oldPrice > currentPrice && (
                <span className="text-md md:text-xl text-gray-400 line-through decoration-gray-400 font-medium">
                  {oldPrice} EGP
                </span>
              )}

              {oldPrice > currentPrice && (
                <span className="text-[11px] mx-3 font-sans text-white bg-red-600 px-2 py-0.5 md:py-2 md:text-xs rounded-full font-black mt-1 animate-bounce">
                  - {Math.round(((oldPrice - currentPrice) / oldPrice) * 100)}%
                  OFF
                </span>
              )}
            </div>
          </div>
          <p className="font-black text-red-700 text-2xl font-sans mb-7">
            {book?.author}
          </p>
          <div className="mx-auto md:ml-0">
            <button
              onClick={() => handleAdd(book)}
              disabled={book?.stock === 0}
              className={`${book?.stock !== 0 ? "bg-black! hover:bg-logo-gold! hover:text-black!" : "bg-gray-500! cursor-not-allowed!"}  px-6! py-4! rounded-lg! font-bold transition-colors! duration-400!`}
            >
              {adding === book?._id ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : book?.stock === 0 ? (
                "Out Stock"
              ) : (
                <Stack direction={"row"} gap={2} alignItems={"center"}>
                  <ShoppingCart size={20} /> {/* 💡 الأيقونة هنا */}
                  <span>Add To Cart</span>
                </Stack>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
