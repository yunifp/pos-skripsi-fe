"use client";
import { motion, AnimatePresence } from "framer-motion";
import SearchItemCard from "./SearchItemCard";

const Items = ({ searchItem = [], setSearchItem, setSearch }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
      },
    }),
    exit: { opacity: 0, y: 20 },
  };

  return (
    <>
      <div className="relative w-full h-[3rem]">
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Search Result</h1>
            <small>({searchItem?.length || 0} items)</small>
          </div>

          {searchItem?.length <= 0 && (
            <div className="w-full flex flex-col justify-center h-96 items-center opacity-60">
              <img src="/images/empty.png" alt="" />
              <p className="mt-3">No item</p>
            </div>
          )}

          <div className="h-[55vh] overflow-scroll mt-4">
            <AnimatePresence>
              {searchItem.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                >
                  <SearchItemCard
                    setSearchItem={setSearchItem}
                    setSearch={setSearch}
                    item={item}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Items;
