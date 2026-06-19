import { createContext, useState, useEffect, useContext } from "react";
import useAuth from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/carts", {
          credentials: "include",
        });
        const data = await res.json();
        setCart(data.cart || data?.message?.cart || { items: [] });
      } catch (err) {
        console.log("Error fetching cart:", err);
        setCart({ items: [] });
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (bookId) => {
    try {
      const res = await fetch("http://localhost:5000/carts/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      setCart(data.cart || data?.message?.cart || { items: [] });
      return data;
    } catch (err) {
      console.log("Failed to add to cart:", err.message);
      throw err;
    }
  };

  const updateCart = async ({ bookId, quantity }) => {
    try {
      const res = await fetch("http://localhost:5000/carts/update", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message || "Error updating cart");
      }
      setCart(data.cart || data?.message?.cart || { items: [] });
    } catch (err) {
      console.log("Failed to update cart:", err);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:5000/carts/remove/${bookId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data.cart || data?.message?.cart || { items: [] });
      } else {
        console.error("Server error:", data.message);
      }
    } catch (err) {
      console.log("Failed to remove from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      await fetch("http://localhost:5000/carts/clear", {
        method: "DELETE",
        credentials: "include",
      });

      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    }
  };
  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
