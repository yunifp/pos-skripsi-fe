"use client";

import useCrud from "@/hooks/useCRUD";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import numeral from "numeral";
import Lottie from "react-lottie-player";
import successLottie from "@/public/images/success.json";
import cancelLottie from "@/public/images/cancel.json";
import moment from "moment";

const Transaction = ({ orderDetails, amount, setAmount }) => {
  const audioRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [selectedOrder, setSetselectedOrder] = useState(orderDetails.id || "");
  const params = useParams();
  const router = useRouter();
  const { fetchAllData: getOrderData, data: orderData } = useCrud(
    `orders/${params.id}`
  );
  const { update: cancelOrder, data: cancelResponse } = useCrud(
    `orders/${params.id}/cancel`
  );
  const { update: holdOrder, data: holdResponse } = useCrud(
    `orders/${params.id}/hold`
  );
  const { update: successOrder, data: successResponse } = useCrud(
    `orders/${params.id}/success`
  );
  const {
    fetchAllData: getOrderOnHold,
    data: orderOnHold,
    outletId,
  } = useCrud(`orders/hold`);

  useEffect(() => {
    getOrderData();
  }, [orderDetails]);

  useEffect(() => {
    if (!outletId) return;
    getOrderOnHold({
      outlet_id: outletId,
    });
  }, [isCancel]);

  useEffect(() => {
    selectedOrder && router.push(`/dashboard/pos/${selectedOrder}`);
  }, [selectedOrder]);

  const amountHandler = (e) => {
    const { value } = e.target;
    const prevAmount = amount.replace(/,/g, "");
    const newAmount = prevAmount + value;

    setAmount(new Intl.NumberFormat().format(newAmount));
  };

  const amountTypingHandler = (e) => {
    const { value } = e.target;
    const newAmount = value.replace(/,/g, "");
    setAmount(new Intl.NumberFormat().format(newAmount));
  };

  const deleteAmountHandler = () => {
    if (amount === "") return;
    setAmount((prev) => {
      const prevAmount = prev.replace(/,/g, "").slice(0, -1);
      return new Intl.NumberFormat().format(prevAmount);
    });
  };

  const clearAmountHandler = () => {
    setAmount((prev) => (prev = ""));
  };

  const addCompleteAmount = (e) => {
    const { value } = e.target;

    if (amount !== "") {
      const prevAmount = amount.replace(/,/g, "");
      const newAmount = parseInt(prevAmount) + parseInt(value);
      setAmount(new Intl.NumberFormat().format(newAmount));
    } else {
      setAmount(new Intl.NumberFormat().format(value));
    }
  };

  const cancelOrderHandler = async () => {
    try {
      const res = await cancelOrder("", { items: orderDetails });
      setIsCancel(true);
    } catch (error) {
      console.log(error);
    }
  };

  const holdOrderHandler = async () => {
    try {
      const res = await holdOrder("", { items: orderDetails });
      router.push(`/dashboard/pos`);
    } catch (error) {}
  };

  const successOrderHandler = async () => {
    try {
      const res = await successOrder("", {
        amount: parseInt(amount.replace(/,/g, "")),
      });
      setIsOpen(true);
    } catch (error) {}
  };

  return (
    <>
      <div className="relative flex flex-col justify-between h-full bg-white rounded-xl">
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-lg font-semibold">Payment</h1>
            <select
              name="transasction_id"
              id=""
              className="rounded-lg w-min h-[2.5rem] text-sm capitalize"
              onChange={(e) => {}}
            >
              <option>Cash</option>
            </select>{" "}
          </div>
          <div className="grid grid-cols-4 bg-[#8bb2b281] p-8 gap-4">
            <Input
              className={"col-span-4 h-[3rem] w-full bg-white text-right"}
              onChange={amountTypingHandler}
              value={amount}
              type="text"
            />
            <div className="grid grid-cols-2 col-span-2 gap-2 mt-3">
              <Button
                value={"1000"}
                onClick={addCompleteAmount}
                variant={"button3"}
                className="h-16 hover:bg-emerald-50"
              >
                Rp. 1000
              </Button>
              <Button
                onClick={addCompleteAmount}
                value={"2000"}
                variant={"button3"}
                className="h-16 hover:bg-emerald-50"
              >
                Rp. 2000
              </Button>
              <Button
                onClick={addCompleteAmount}
                value={"5000"}
                variant={"button3"}
                className="h-16 hover:bg-emerald-50"
              >
                Rp. 5000
              </Button>
              <Button
                onClick={addCompleteAmount}
                value={"10000"}
                variant={"button3"}
                className="h-16 hover:bg-emerald-50"
              >
                Rp.10.000
              </Button>
              <Button
                onClick={addCompleteAmount}
                value={"20000"}
                variant={"button3"}
                className="h-16 hover:bg-emerald-50"
              >
                Rp.20.000
              </Button>
              <Button
                onClick={addCompleteAmount}
                value={"50000"}
                variant={"button3"}
                className="h-16 hover:bg-emerald-50"
              >
                Rp.50.000
              </Button>
              <Button
                onClick={addCompleteAmount}
                value={"100000"}
                variant={"button3"}
                className="h-16 hover:bg-emerald-50"
              >
                Rp.100.000
              </Button>
              <Button
                variant={"button3"}
                className="h-16 hover:bg-emerald-50"
                onClick={() =>
                  setAmount(() => {
                    return new Intl.NumberFormat().format(
                      orderData.total_payment
                    );
                  })
                }
              >
                Pay All
              </Button>
            </div>
            <div className="grid grid-cols-3 col-span-2 gap-2 mt-3">
              <Button
                onClick={amountHandler}
                value={"1"}
                className={
                  "rounded-lg bg-[#8BB2b2] border border-slate-300 text-white h-16 text-xl hover:bg-emerald-400"
                }
              >
                1
              </Button>
              <Button
                onClick={amountHandler}
                value={"2"}
                className={
                  "rounded-lg bg-[#8BB2b2] border border-slate-300 text-white h-16 text-xl hover:bg-emerald-400"
                }
              >
                2
              </Button>
              <Button
                onClick={amountHandler}
                value={"3"}
                className={
                  "rounded-lg bg-[#8BB2b2] border border-slate-300 text-white h-16 text-xl hover:bg-emerald-400"
                }
              >
                3
              </Button>
              <Button
                onClick={amountHandler}
                value={"4"}
                className={
                  "rounded-lg bg-[#8BB2B2] border border-slate-300 text-white h-16 text-xl hover:bg-emerald-400"
                }
              >
                4
              </Button>
              <Button
                onClick={amountHandler}
                value={"5"}
                className={
                  "rounded-lg bg-[#8BB2B2] border border-slate-300 text-white h-16 text-xl hover:bg-emerald-400"
                }
              >
                5
              </Button>
              <Button
                onClick={amountHandler}
                value={"6"}
                className={
                  "rounded-lg bg-[#8BB2B2] border border-slate-300 text-white h-16 text-xl hover:bg-emerald-400"
                }
              >
                6
              </Button>
              <Button
                onClick={amountHandler}
                value={"7"}
                className={
                  "rounded-lg bg-[#8BB2B2] border border-slate-300 text-white h-16 text-xl hover:bg-emerald-400"
                }
              >
                7
              </Button>
              <Button
                onClick={amountHandler}
                value={"8"}
                className={
                  "rounded-lg bg-[#8BB2B2] border border-slate-300 text-white h-16 text-xl hover:bg-emerald-400"
                }
              >
                8
              </Button>
              <Button
                onClick={amountHandler}
                value={"9"}
                className={
                  "rounded-lg bg-[#8BB2B2] border border-slate-300 text-white h-16 text-xl hover:bg-emerald-400"
                }
              >
                9
              </Button>
              <Button
                onClick={clearAmountHandler}
                value={"00"}
                className={
                  "rounded-lg bg-[#E87373] border border-slate-300 text-white h-16 text-xl hover:bg-rose-500"
                }
              >
                C
              </Button>
              <Button
                onClick={amountHandler}
                value={"0"}
                className={
                  "rounded-lg bg-[#8BB2B2] border border-slate-300 text-white h-16 text-xl hover:bg-emerald-400"
                }
              >
                0
              </Button>
              <Button
                onClick={deleteAmountHandler}
                className={
                  "rounded-lg bg-[#E87373] border border-slate-300 text-white h-16 text-xl hover:bg-rose-500"
                }
              >
                Del
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center p-8">
          <span className="text-[.6rem] text-slate-500">Payment Summary</span>
          <div className="text-[1rem] font-semibold mt-2 flex justify-between">
            <span>Amount Due</span>
            <span>Rp {numeral(orderData.total_payment).format()}</span>
          </div>
          <div className="text-sm font-semibold mt-2 flex justify-between">
            <span>Payment Received</span>
            <span>Rp {numeral(amount).format()}</span>
          </div>
          <div className="text-sm font-semibold mt-2 flex justify-between">
            <span>Change</span>
            <span>
              Rp{" "}
              {numeral(
                (parseInt(orderData.total_payment) -
                  parseInt(amount.replace(/,/g, ""))) *
                  -1
              ).format()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-8 text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant={"buttonCancel"}>
                  Cancel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Confirm Cancellation
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="mt-4">
                      <p className="my-4 text-center">
                        Are you sure you want to cancel this transaction? This
                        action will undo all changes and you will not be able to
                        retrieve this transaction.
                      </p>
                      <div className="flex gap-3 mt-3">
                        <DialogClose className="w-full" asChild>
                          <Button className="w-full" variant={"button2"}>
                            Go Back
                          </Button>
                        </DialogClose>
                        <Button
                          onClick={cancelOrderHandler}
                          className="w-full"
                          variant={"buttonCancel"}
                        >
                          Yes, Cancel Transaction
                        </Button>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full border border-slate-400"
                  variant={"button3"}
                >
                  Hold
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Confirm Hold
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="mt-4">
                      <p className="py-4 text-center">
                        Are you sure you want to hold this transaction? You can
                        resume later, but please remember that this action might
                        affect your current orders.
                      </p>
                      <div className="flex gap-3 mt-3">
                        <DialogClose className="w-full" asChild>
                          <Button className="w-full" variant={"button2"}>
                            Go Back
                          </Button>
                        </DialogClose>
                        <Button
                          onClick={holdOrderHandler}
                          className="w-full"
                          variant={"buttonCancel"}
                        >
                          Yes, Hold Transaction
                        </Button>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={
                    amount?.replace(/,/g, "") < orderData.total_payment ||
                    orderDetails.length <= 0
                  }
                  className="rounded-md transition-all duration-500"
                  variant={
                    amount?.replace(/,/g, "") < orderData.total_payment ||
                    orderDetails.length <= 0
                      ? "button1"
                      : "success"
                  }
                >
                  Pay
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Confirm Payment
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="mt-4">
                      <p className="py-4 text-center">
                        Are you ready to complete your payment? Please ensure
                        that all details are correct, as this action will
                        finalize your transaction.
                      </p>
                      <div className="flex gap-3 mt-3">
                        <DialogClose className="w-full" asChild>
                          <Button className="w-full" variant={"button2"}>
                            Go Back
                          </Button>
                        </DialogClose>
                        <Button
                          onClick={successOrderHandler}
                          className="w-full"
                          variant={"success"}
                        >
                          Yes, Complete Payment
                        </Button>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog open={isCancel} onOpenChange={() => {}}>
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent hideCloseButton={true}>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Transaction Canceled
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="mt-4">
                      <div className="flex w-full justify-center my-8">
                        <Lottie
                          loop={false}
                          animationData={cancelLottie}
                          renderer="svg"
                          play
                          style={{ width: 240, height: 240 }}
                        />
                      </div>

                      {orderOnHold?.length > 0 && (
                        <div className="">
                          <select
                            name="transasction_id"
                            id=""
                            className="border p-2 rounded-lg mt-2 mb-4 w-full h-[2.5rem] focus:ring-0 text-sm capitalize"
                            value={selectedOrder}
                            onChange={(e) =>
                              setSetselectedOrder(e.target.value)
                            }
                          >
                            <option value="">
                              Continue Previous Transaction
                            </option>
                            {orderOnHold?.map((row) => {
                              return (
                                <option value={row.id} key={row.id}>
                                  {row.public_id} -{" "}
                                  {moment(row.created_at).fromNow()}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                      <div className="flex gap-3 mt-3">
                        <Button
                          onClick={() => router.push("/dashboard")}
                          className="w-full border-none bg-slate-100 text-black hover:bg-slate-300"
                          variant={"ghost"}
                        >
                          Dashboard
                        </Button>
                        <Button
                          onClick={() => router.push("/dashboard/pos")}
                          className="w-full"
                          variant={"success"}
                        >
                          Create New Order
                        </Button>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog open={isOpen} onOpenChange={() => {}}>
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent hideCloseButton={true}>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Transaction Complete
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="mt-4">
                      <div className="flex w-full justify-center my-8">
                        <Lottie
                          loop
                          animationData={successLottie}
                          renderer="svg"
                          play
                          speed={0.6}
                          style={{ width: 320, height: 320 }}
                        />
                      </div>

                      <audio ref={audioRef} autoPlay>
                        <source src="/success.mp3" type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                      <div className="flex gap-3 mt-3">
                        <Button
                          onClick={() => router.push("/dashboard")}
                          className="w-full border-none bg-slate-100 text-black hover:bg-slate-300"
                          variant={"ghost"}
                        >
                          Dashboard
                        </Button>
                        <Button
                          onClick={() => router.push("/dashboard/pos")}
                          className="w-full"
                          variant={"success"}
                        >
                          Next Order
                        </Button>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};
export default Transaction;
