import React, { useEffect, useState } from "react";
import { Package, Truck, Clock, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    fetch("https://bookstore-backend-blond.vercel.app/orders/my-orders", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-16 lg:px-32">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-green-500 p-3 rounded-2xl text-white shadow-lg shadow-green-200">
            <Package size={30} />
          </div>
          <h1 className="text-3xl font-black text-slate-900">My Orders</h1>
        </div>
        <Link to="/" className="flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-all">
          <ShoppingBag size={20} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {orders.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
           </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Package size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm md:text-base">Order #{order._id}</h2>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                    {order.status || "Processing"}
                  </span>
                  <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                    Cash
                  </span>
                </div>
              </div>

              <div className="px-6 py-6 border-t border-gray-50 flex flex-col md:flex-row gap-8">
                {/* Items Preview */}
                <div className="flex-1">
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Items Preview</p>
                   <div className="flex -space-x-3 overflow-hidden">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <img 
                          key={idx}
                          src={item.book?.coverImage} 
                          className="w-16 h-20 object-cover rounded-xl border-4 border-white shadow-sm"
                        />
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-16 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border-4 border-white shadow-sm">
                          +{order.items.length - 4}
                        </div>
                      )}
                   </div>
                   <p className="text-xs italic text-gray-500 mt-4">{order.items.length} items in this order</p>
                </div>

                {/* Shipping Info */}
                <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 flex-1 flex gap-4 items-start">
                   <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Truck size={18} className="text-green-500" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Shipping To</p>
                      <p className="text-sm font-bold text-slate-700">{order.shippingAddress.city}, {order.shippingAddress.street}</p>
                      <p className="text-xs text-gray-400 mt-1">Expected Delivery: 2-3 Days</p>
                   </div>
                </div>
              </div>

              {/* Bottom Row: Total & Action */}
              <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-black">{order.totalAmount} <span className="text-sm">EGP</span></p>
                </div>
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-bold transition-all text-sm border border-slate-700">
                  View Details <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;