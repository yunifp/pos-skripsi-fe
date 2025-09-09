"use client";

import Cart from "@/components/pos/Cart";
import ItemHeader from "@/components/pos/ItemHeader";
import Items from "@/components/pos/Items";
import Transaction from "@/components/pos/Transaction";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Pos = () => {
  const [amount, setAmount] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [searchItem, setSearchItem] = useState([]);
  const [search, setSearch] = useState("");
  const [isCartActive, setIsCartActive] = useState(false);

  useEffect(() => {
    setIsCartActive(search.length === 0);
    if (search.length > 0) {
        setSearchItem([]); 
    }
  }, [search]);

  return (
    <div className="bg-slate-100 w-full min-h-screen antialiased">
      <div className="grid grid-cols-1 lg:grid-cols-5 w-full min-h-screen gap-4 sm:gap-6 lg:gap-8 p-6 sm:p-6 lg:p-8">
        
        <div className="lg:col-span-3 flex flex-col lg:mt-16">
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
            <ItemHeader
              search={search}
              setSearch={setSearch}
              setSearchItem={setSearchItem}
            />
            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isCartActive ? "cart" : "items"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isCartActive ? (
                    <Cart
                      search={search}
                      orderDetails={orderDetails}
                      setOrderDetails={setOrderDetails}
                    />
                  ) : (
                    <Items
                      setSearchItem={setSearchItem}
                      searchItem={searchItem}
                      setSearch={setSearch}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 lg:mt-16">
          <Transaction
            orderDetails={orderDetails}
            amount={amount}
            setAmount={setAmount}
          />
        </div>

      </div>
    </div>
  );
};

export default Pos;