"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import useCrud from "@/hooks/useCRUD";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SheetDescription } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/Pagination";
import { useToast } from "@/hooks/use-toast";
import numeral from "numeral";
import moment from "moment";
import * as XLSX from "xlsx";
import StockChart from "@/components/dashboard/StockChart";
import { jwtDecode } from "jwt-decode";

export default function Page() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [outletId, setOutletId] = useState("");
  const [role, setRole] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const itemsPerPage = 10;

  // useCrud hook berisi fetchAllData, create, update, remove, pagination support
  const {
    data: cards,
    token,
    fetchAllData: getCards,
    loading: cardsLoading,
  } = useCrud("stock-cards");

  useEffect(() => {
    if (!token) return;
    const decoded = jwtDecode(token);
    setRole(decoded?.role);
  }, [token]);

  const { data: outlets, fetchAllData: getOutlets } = useCrud("outlets");

  const {
    data: items,
    fetchAllData: getItems,
    totalPages: totalPagesItems,
  } = useCrud("items");

  const { reset } = useForm();

  useEffect(() => {
    if (!token) return;
    loadData();
    getOutlets();
  }, [currentPage, search, outletId, token]);
  useEffect(() => {
    if (!token) return;
    setCurrentPage(1);
    loadData();
  }, [search]);
  useEffect(() => {
    if (!token) return;
    setCurrentPage(1);
    loadData();
  }, [outletId]);

  useEffect(() => {
    if (selectedItem) {
      loadCards();
    }
  }, [selectedItem]);

  async function loadCards() {
    try {
      const res = await getCards({
        item_id: selectedItem?.id || "",
        outlet_id: selectedItem?.outlet?.id || "",
        perPage: 9999,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Reset form ketika selectedData berubah
  useEffect(() => {
    reset(selectedData || {});
  }, [selectedData, reset]);

  // Handle page change untuk pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  function loadData() {
    getItems({
      page: currentPage,
      perPage: itemsPerPage,
      outlet_id: outletId,
      search,
    });
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      cards.map((data, index) => ({
        No: (currentPage - 1) * itemsPerPage + index + 1,
        id: data.id,
        Item: data.item?.name,
        Outlet: data.outlet?.name,
        "Stock IN": data.stock_in,
        "Stock OUT": data.stock_out,
        "Current Stock": data.current_stock,
        Type: data.transaction_type,
        Date: moment(data.created_at).format("DD MMM YYYY - HH:mm:ss"),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Data");

    XLSX.writeFile(workbook, "stock_data.xlsx");
  };

  return (
    <div>
      <div className="bg-slate-100 w-screen min-h-screen py-12 px-4 lg:px-32 pb-32">
        <div className="bg-white p-12 rounded-xl shadow mt-20">
          <div className="flex justify-between items-center">
            <h1 className="font-bold mb-8 w-full">Stock Cards</h1>
            <div className="flex items-center justify-end gap-4 w-full">
              <Input
                className="max-w-lg bg-gray-50 rounded-full h-16 text-lg px-4"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="button1" onClick={() => router.push("/dashboard")}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>

            <div className="flex items-center gap-4">
              {role == "ADMIN" && (
                <div className="bg-emerald-50 px-4 rounded-full border border-[#8BB2B2]">
                  <select
                    id="outlet_id"
                    className="col-span-3 border rounded-full min-w-40 text-sm py-1 px-2 h-[36px] bg-transparent border-none focus:outline-none focus:ring-0 focus:ring-transparent active:ring-0 active:ring-transparent hover:ring-0"
                    value={outletId}
                    onChange={(e) => {
                      setOutletId(e.target.value);
                    }}
                  >
                    <option value="">All Outlet</option>
                    {outlets?.map((row) => {
                      return (
                        <option key={row.id} value={row.id}>
                          {row.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-xl overflow-hidden">
            <Table className="min-w-full table-auto border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] p-2 bg-[#8BB2B2] text-center text-white">
                    No.
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    id
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Outlet
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Name
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Description
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Price
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Stock
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-center text-white">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((data, index) => (
                  <TableRow
                    key={data.id}
                    className="border-b hover:bg-gray-100 transition-colors"
                  >
                    <TableCell className="p-2 text-center font-bold">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="p-2">{data.id}</TableCell>
                    <TableCell className="p-2">{data?.outlet?.name}</TableCell>
                    <TableCell className="p-2">{data.name}</TableCell>
                    <TableCell className="p-2">{data.description}</TableCell>
                    <TableCell className="p-2">
                      Rp. {numeral(data.price).format("")}
                    </TableCell>
                    <TableCell className="p-2">{data.stock}</TableCell>
                    <TableCell className="p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="success"
                          className="bg-[#4f6e6e] text-white px-4 py-2 rounded hover:bg-[#253b3b] transition-colors"
                          onClick={() => {
                            setSelectedItem(data);
                            setIsOpen(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {items?.length <= 0 && (
          <div className="w-full flex flex-col justify-center h-96 items-center opacity-60">
            <img src="/images/empty.png" alt="" />
            <p className="mt-3">No item</p>
          </div>
        )}

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPagesItems}
              onPageChange={handlePageChange}
              itemsPerPage={10}
              totalItemsInCurrentPage={items?.length}
            />
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-[80vw] py-12 px-12">
            <DialogHeader>
              <DialogTitle>{selectedItem?.name}</DialogTitle>
              <div className="pt-1">
                <SheetDescription>
                  {selectedItem?.description} <br />
                </SheetDescription>
              </div>
            </DialogHeader>

            {cardsLoading ? (
              <div className="w-full flex items-center justify-center">
                <img src="/images/loader.gif" alt="" className="w-32 my-32" />
              </div>
            ) : (
              <Tabs defaultValue="table" className="mt-2">
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="table" className="min-w-32">
                      Table
                    </TabsTrigger>
                    <TabsTrigger value="charts" className="min-w-32">
                      Charts
                    </TabsTrigger>
                  </TabsList>

                  <div className="w-40">
                    <Button
                      onClick={exportToExcel}
                      variant="info"
                      className="w-full"
                    >
                      Export to Excel
                    </Button>
                  </div>
                </div>
                <TabsContent value="table">
                  <div className="max-h-[55vh] overflow-y-scroll rounded-xl bg-blue-50 bg-opacity-25 mt-4">
                    <Table className="min-w-full table-auto border-collapse">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px] p-2 bg-[#8BB2B2] text-center text-white">
                            No.
                          </TableHead>
                          <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                            id
                          </TableHead>
                          <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                            Item
                          </TableHead>
                          <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                            Outlet
                          </TableHead>
                          <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                            Stock IN
                          </TableHead>
                          <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                            Stock OUT
                          </TableHead>
                          <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                            Current Stock
                          </TableHead>
                          <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                            Type
                          </TableHead>
                          <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cards?.map((data, index) => (
                          <TableRow
                            key={data.id}
                            className="border-b hover:bg-gray-100 transition-colors"
                          >
                            <TableCell className="p-2 text-center font-bold">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </TableCell>
                            <TableCell className="p-2">{data.id}</TableCell>
                            <TableCell className="p-2">
                              {data.item?.name}
                            </TableCell>
                            <TableCell className="p-2">
                              {data.outlet?.name}
                            </TableCell>
                            <TableCell
                              className={`p-4 ${
                                data.stock_in !== 0
                                  ? "text-green-500 bg-green-50 font-bold"
                                  : "text-slate-400"
                              }`}
                            >
                              {data.stock_in}
                            </TableCell>
                            <TableCell
                              className={`p-4 ${
                                data.stock_out !== 0
                                  ? "text-red-500 bg-red-50 font-bold"
                                  : "text-slate-400"
                              }`}
                            >
                              {data.stock_out}
                            </TableCell>
                            <TableCell className="p-2">
                              {data.current_stock}
                            </TableCell>
                            <TableCell className="p-2 capitalize">
                              {data.transaction_type}
                            </TableCell>
                            <TableCell className="p-2">
                              {moment(data.created_at).format(
                                "DD MMM YYYY - HH:mm:ss"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="charts" className="w-full">
                  <div className="h-[55vh] mt-4 rounded-xl bg-blue-50 bg-opacity-25 py-8 px-4">
                    <StockChart cards={cards} />
                  </div>
                </TabsContent>
              </Tabs>
            )}
            <small className="opacity-50 mx-4">
              Outlet: {selectedItem?.outlet?.name}
            </small>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
