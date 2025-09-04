"use client";

import { Header } from "@/components/header";
import Cart from "@/components/pos/Cart";
import ItemHeader from "@/components/pos/ItemHeader";
import Items from "@/components/pos/Items";
import Transaction from "@/components/pos/Transaction";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Pos = () => {
  const [amount, setAmount] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [searchItem, setSearchItem] = useState([]);
  const [search, setSearch] = useState("");
  const [isCartActive, setIsCartActive] = useState(false);

  useEffect(() => {
    setIsCartActive(search.length === 0);
    setSearchItem([]);
  }, [search]);

  return (
    <div>
      <div className="grid grid-cols-4 w-screen min-h-screen">
        <div className="col-span-2 flex flex-col items-center p-12 mt-20">
          <div className="w-full max-w-xl">
            <ItemHeader
              search={search}
              setSearch={setSearch}
              setSearchItem={setSearchItem}
            />
            <div className="mt-8">
              <motion.div
                key={isCartActive ? "cart" : "items"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
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
            </div>
          </div>
        </div>
        <div className="col-span-2 flex justify-center p-8 mt-20 bg-[#8BB2B2]">
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
