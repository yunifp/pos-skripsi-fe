"use client";

import useCrud from "@/hooks/useCRUD";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Pos = () => {
  const { create, token } = useCrud("orders");
  const router = useRouter();
  const [userInformation, setUserInformation] = useState({
    user_id: null,
    outlet_id: null,
  });

  const createOrder = async () => {
    try {
      const response = await create(userInformation);
      router.push(`/dashboard/pos/${response.data?.id}`);
    } catch (error) {
      console.error("error create order");
    }
  };

  useEffect(() => {
    if (!token) return;
    const decoded = jwtDecode(token);
    setUserInformation((prev) => {
      return {
        ...prev,
        user_id: decoded.userToken,
        outlet_id: decoded.outlet_id,
      };
    });
  }, [token]);

  useEffect(() => {
    if (!userInformation.outlet_id && !userInformation.user_id) return;
    createOrder();
  }, [userInformation]);

  return (
    <div className="flex h-screen w-screen items-center justify-center flex-col gap-8">
      <h1>Creating new order</h1>
      <img src="/images/loader.gif" alt="" className="w-20 opacity-50" />
    </div>
  );
};
export default Pos;
