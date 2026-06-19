import { Plus, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../auth/CartContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FeaturedProduct = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("https://bookstore-backend-blond.vercel.app/api/books/getAllBooks", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const featured = data?.message?.filter((book) => book?.isFeatured);
        setFeaturedBooks(featured);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error Fetching books", err);
        setLoading(false);
      });
  }, []);

  const handleAdd = async (book) => {
    try {
      setAdding(book._id);
      await addToCart(book._id);
      setAdding(null);
      setFeaturedBooks((prev) =>
        prev.map((b) =>
          b._id === book._id ? { ...b, stock: b.stock - 1 } : b,
        ),
      );
      toast.success(`Added ${book.title} to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(null);
    }
  };

  if (loading)
    return (
      <div className="container mx-auto px-4 py-10 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 w-[320px] bg-gray-100 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  return (
    <div id="books" className="mx-4">
      <h3 className="my-6">Featured Product</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 m-3">
        {featuredBooks?.map((book) => {
          return (
            <div
              key={book._id}
              className="relative group flex flex-col mx-auto w-64 bg-gray-50 overflow-hidden gap-3 cursor-pointer border rounded-2xl border-gray-300  p-3 transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-0.5"
            >
              <img
                src={book.coverImage}
                className="w-full h-80 object-cover rounded-xl hover:scale-105 transition-all duration-400"
              />

              <Link to={`/book-details/${book._id}`}>
                <span className="absolute right-5 top-5 bg-white px-4 py-3 rounded-2xl text-black font-bold text-sm opacity-100 translate-x-0 md:opacity-0 md:translate-x-4 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                  <Eye className="w-5 h-5" />
                </span>
              </Link>
              <h6 className="font-bold text-gray-800 truncate">
                {book?.title}
              </h6>
              <span className="text-xs text-gray-500 truncate">
                {book?.author}
              </span>
              <p
                className={`text-[11px] ${book?.stock < 5 ? "text-red-500 font-medium" : "text-gray-400"}`}
              >
                {book?.stock === 0
                  ? `Out Of Stock`
                  : book?.stock < 5
                    ? `Only ${book?.stock} left!`
                    : `In Stock: ${book?.stock}`}
              </p>
              <div className="flex items-center justify-between">
                <strong className="text-lg text-logo-gold">
                  {book?.price} EGP
                </strong>

                <button
                  onClick={() => handleAdd(book)}
                  disabled={book.stock === 0}
                  className={`${book.stock !== 0 ? "bg-black! hover:bg-logo-gold! hover:text-black!" : "bg-gray-500! cursor-not-allowed!"}  px-3! py-2! rounded-lg!  transition-colors! duration-400!`}
                >
                  {adding === book._id ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : book.stock === 0 ? (
                    "Out Stock"
                  ) : (
                    <Plus size={18} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProduct;
