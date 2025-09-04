"use client";
import { useParams } from "next/navigation";
import CartItemCard from "./CartItemCard";
import useCrud from "@/hooks/useCRUD";
import { useEffect, useState } from "react";

const Cart = ({ orderDetails, setOrderDetails }) => {
  const params = useParams();
  const {
    fetchAllData: fetchOrder,
    data: ordersData,
    loading,
  } = useCrud(`orders/${params.id}`);

  const getOrderDetails = async () => {
    try {
      await fetchOrder();
    } catch (err) {}
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  useEffect(() => {
    setOrderDetails(ordersData.order_details || []);
  }, [ordersData]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Your Cart</h1>
        <small>({orderDetails?.length || 0} items)</small>
      </div>

      <div className="h-[55vh] overflow-scroll mt-4">
        {loading
          ? "loading"
          : orderDetails.map((detail, index) => (
              <CartItemCard
                details={detail}
                key={index}
                fetchOrder={fetchOrder}
              />
            ))}
        {orderDetails?.length <= 0 && (
          <div className="w-full flex flex-col justify-center h-96 items-center opacity-60">
            <img src="/images/empty.png" alt="" />
            <p className="mt-3">No item</p>
          </div>
        )}
      </div>
    </>
  );
};
export default Cart;
