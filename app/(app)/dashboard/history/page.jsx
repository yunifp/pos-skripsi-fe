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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import Pagination from "@/components/Pagination";
import useCrud from "@/hooks/useCRUD";
import { faArrowLeft, faEye, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import logoReception from "../../../../public/images/logo.png";
import Image from "next/image";
// import html2pdf from 'html2pdf.js';
import numeral from "numeral";
import moment from "moment";
export default function Page() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState("All");
  const [hasRejected, setHasRejected] = useState(true);
  const {
    data: histories,
    token,
    fetchAllData,
    totalPages,
  } = useCrud("histories");

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [currentPage, search, token]);

  function loadData() {
    fetchAllData({
      page: currentPage,
      search,
      perPage: itemsPerPage,
    });
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  useEffect(() => {
    if (!token) return;
    loadData();
  }, [currentPage, search, statusFilter, token]);

  function loadData() {
    fetchAllData({
      page: currentPage,
      search,
      status: statusFilter != "All" ? statusFilter : "",
      perPage: itemsPerPage,
    });
  }

  useEffect(() => {
    if (histories) {
      if (statusFilter === "All") {
        const hasRejectedData = histories.some((history) => history.status === "rejected");
        setHasRejected(hasRejectedData);
      }
    }
  }, [histories, statusFilter]);


  const getStatusText = (status) => {
    switch (status) {
      case "on_process":
        return "On Process";
      case "success":
        return "Success";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "on_process":
        return "On Process";
      case "success":
        return "Success";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "success":
        return "bg-green-200 text-green-800";
      case "on_process":
        return "bg-yellow-200 text-yellow-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleViewDetails = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const downloadPDF = async () => { 
    const element = document.getElementById('transaction-details');
    if (!element) return;

    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 0.5,
      filename: `invoice-${selectedRow.public_id}.pdf`, 
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div>
      <div className="bg-slate-100 w-screen min-h-screen py-12 px-4 lg:px-32 pb-32">
        <div className="bg-white p-12 rounded-xl shadow lg:mt-20 md:mt-16 mt-10">
          <div className="flex justify-between items-center">
            <h1 className="font-bold mb-8 w-full">Transaction History</h1>
            <div className="flex items-center justify-end gap-4 w-full">
              <Input
                className="max-w-lg bg-gray-50 rounded-full h-16 text-lg px-4"
                placeholder="Search by ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex center gap-5">
            <Button variant="button1" onClick={() => router.push("/dashboard")} className="mt-2">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>

            <div className="flex border-b mb-4">
              {["All", "success", "on_process", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-2 focus:outline-none ${statusFilter === status
                    ? "font-bold text-green-700 border-b-4 border-green-700"
                    : "text-gray-500"
                    }`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>


          </div>

          <div className="mt-2 rounded-xl overflow-hidden">
            <Table className="min-w-full table-auto border-collapse">
              <TableHeader>
                <TableRow className="items-center">
                  <TableHead className="w-[50px] p-2 bg-[#8BB2B2] text-center text-white">
                    No.
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-center text-white">
                    Transaction ID
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-center text-white">
                    Date
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-center text-white">
                    Cashier Name
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-center text-white">
                    Total Payment
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-center text-white">
                    Status
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-center text-white">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {histories?.map((history, index) => (
                  <TableRow
                    key={history.id}
                    className="border-b hover:bg-gray-100 transition-colors"
                  >
                    <TableCell className="p-2 text-center font-bold">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="p-2 text-center">{history.public_id}</TableCell>
                    <TableCell className="p-2 text-center">
                      {moment(history.created_at).format("DD MMM YYYY - HH:mm:ss")}
                    </TableCell>
                    <TableCell className="p-2 text-center">{history.user?.name}</TableCell>
                    <TableCell className="p-2 text-center">Rp. {numeral(history.total_payment).format("")}</TableCell>
                    <TableCell className={`p-2 text-center font-bold ${getStatusStyles(history.status)}`}>
                      {getStatusText(history.status)}
                    </TableCell>
                    <TableCell className="p-2 text-center">
                      {history.status === "success" ? (
                        <Button
                          variant="success"
                          className="bg-[#4f6e6e] text-white px-4 py-2 rounded hover:bg-[#253b3b] transition-colors"
                          onClick={() => handleViewDetails(history)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                      ) : (
                        <span className="text-gray-500"></span>
                      )}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {histories?.length <= 0 && (
              <div className="w-full flex flex-col justify-center h-96 items-center opacity-60">
                <img src="/images/empty.png" alt="" />
                <p className="mt-3">No item</p>
              </div>
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItemsInCurrentPage={histories?.length || 0}
            />
          </div>
        </div>

        {selectedRow && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-full sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] p-8 border border-[#638B8B] rounded-lg shadow-lg bg-gradient-to-r from-[#D9E6E6] to-[#A0C0C0] transform transition-transform duration-300 ease-in-out">
              <div id="transaction-details">

                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-[#4F6A6A]">Invoice</h2>
                    <p className="text-lg font-semibold text-[#638B8B]">No: {selectedRow.id}</p>
                  </div>
                  <div className="flex items-center">
                    <Image src={logoReception} alt="Fisika Farma Logo" className="w-24 h-auto object-contain" />
                  </div>
                </div>

                <div className="mb-8 bg-white p-4 rounded-lg shadow-inner border border-[#8BB2B2]">
                  <p><strong>Date:</strong> {new Date(selectedRow.created_at).toLocaleDateString()}</p>
                  <p><strong>Cashier Name:</strong> {selectedRow.user?.name}</p>
                  <p><strong>Outlet:</strong> {selectedRow.outlet?.name}</p>
                </div>

                <hr className="my-6 border-[#638B8B]" />

                <div className="mb-8">
                  <table className="w-full text-sm bg-white rounded-lg shadow border border-[#638B8B]">
                    <thead className="bg-[#8BB2B2]">
                      <tr className="border-b">
                        <th className="text-left p-2 text-white">Item</th>
                        <th className="text-left p-2 text-white">Price</th>
                        <th className="text-left p-2 text-white">Qty</th>
                        <th className="text-right p-2 text-white">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRow.order_details.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-[#A0C0C0]">
                          <td className="p-2">{item.items.name}</td>
                          <td className="p-2">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2 text-right">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-right mb-8">
                  <p><strong>Subtotal:</strong> Rp {Number(selectedRow.total_payment).toLocaleString('id-ID')}</p>
                  <p><strong>VAT (5%):</strong> Rp {(selectedRow.total_payment * 0.05).toLocaleString('id-ID')}</p>
                  <p className="text-xl font-bold text-[#4F6A6A]"><strong>Total Payment:</strong> Rp {(selectedRow.total_payment * 1.05).toLocaleString('id-ID')}</p>
                </div>

                <div className="text-sm">
                  <p><strong>Status:</strong> <span className={`font-bold ${selectedRow.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>{selectedRow.status}</span></p>
                  <p className="italic text-gray-500">Additional Information: the taxes you pay will be used 100% for national development.</p>
                </div>

              </div>
              <DialogFooter className="flex justify-center mt-4">
                <Button onClick={downloadPDF} className="bg-[#638B8B] text-white hover:bg-[#4F6A6A] py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105">Download PDF</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
