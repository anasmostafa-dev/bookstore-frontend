import React from "react";
import { useCart } from "../auth/CartContext"; // تأكد من المسار
import { ArrowLeft, Truck, ShieldCheck, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState({ city: "", phone: "", street: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isInvalid =
    !address.city ||
    !address.phone ||
    !address.street ||
    cart.items.length === 0;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://bookstore-backend-blond.vercel.app/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            book: item.book._id,
            quantity: item.quantity,
            price: item.book.price,
          })),
          shippingAddress: address,
          totalAmount: cart.totalAmount,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Order Placed Successfully!");
        await clearCart();
        navigate("/order-success", { replace: true });
      } else {
        toast.error(data.error || "Failed to place order");
      }
    }catch(err){
      toast.error("Network error, try again.");
      console.log(err)
    }finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-16 lg:px-32">
      <div className="max-w-7xl mx-auto mb-10">
        <Link
          to="/cart"
          className="flex items-center gap-2 text-green-600 font-bold hover:underline mb-4"
        >
          <ArrowLeft size={20} /> Back to Cart
        </Link>
        <div className="border-l-4 border-green-500 pl-4">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            Complete Your Order
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review your items and complete your purchase
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Shipping Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-green-500 p-4 flex items-center gap-3 text-white font-bold">
              <Truck size={22} />
              <h2>Shipping Details</h2>
            </div>

            <form className="p-8 space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3 text-blue-700 text-sm">
                <ShieldCheck size={18} />
                Please verify your delivery information carefully.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm text-slate-700">
                    City *
                  </label>
                  <input
                    value={address.city}
                    type="text"
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    placeholder="e.g. Cairo"
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm text-slate-700">
                    Phone Number *
                  </label>
                  <input
                    value={address.phone}
                    type="text"
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                    placeholder="01xxxxxxxxx"
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-slate-700">
                  Street Address *
                </label>
                <textarea
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  value={address.street}
                  rows="3"
                  placeholder="Building, Street, Landmark..."
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                />
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isInvalid || loading}
                className={`w-full! py-4! rounded-xl! mt-6! transition-all uppercase! tracking-widest! font-black! text-white
    ${isInvalid || loading ? "bg-gray-400! cursor-not-allowed!" : "bg-green-500! hover:bg-green-600! shadow-lg! shadow-green-200!"}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Place Order"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden sticky top-24">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h2 className="font-bold">Order Summary</h2>
              <span className="bg-red-600 text-xs px-2 py-1 rounded-md">
                {cart?.totalItems || 0} items
              </span>
            </div>

            <div className="p-6">
              {/* Items List */}
              <div className="space-y-4 max-h-75 overflow-y-auto pr-2 mb-6 scrollbar-hide">
                {cart?.items
                  ?.filter((item) => item.book)
                  .map((item) => (
                    <div
                      key={item.book._id}
                      className="flex gap-4 items-center"
                    >
                      <img
                        src={item.book.coverImage}
                        alt=""
                        className="w-16 h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <h2 className="text-sm font-bold text-slate-800 line-clamp-1">
                          {item.book.title}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {item.book.price} EGP
                        </p>
                      </div>
                      <span className="font-bold text-slate-900">
                        {(item?.book?.price * item?.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">
                    {cart?.totalAmount?.toFixed(2) || "0.00"} EGP
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase">
                    Free
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                  <span className="text-lg font-black text-slate-900">
                    Total
                  </span>
                  <span className="text-2xl font-black text-green-600">
                    {cart?.totalAmount?.toFixed(2)}{" "}
                    <sub className="text-[15px]  text-green-600">EGP</sub>
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isInvalid || loading}
                className={`w-full! py-4! rounded-xl! mt-6! transition-all uppercase! tracking-widest! font-black! text-white
    ${isInvalid || loading ? "bg-gray-400! cursor-not-allowed!" : "bg-green-500! hover:bg-green-600! shadow-lg! shadow-green-200!"}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Confirm & Pay"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
