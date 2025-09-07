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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import useCrud from "@/hooks/useCRUD";
import { faArrowLeft, faEye, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import logoReception from "../../../../public/images/logo.png";
import Image from "next/image";
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
  
  const {
    data: histories,
    token,
    fetchAllData,
    totalPages,
  } = useCrud("histories");

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [currentPage, search, statusFilter, token]);

  useEffect(() => {
    if (!token) return;
    setCurrentPage(1);
    loadData();
  }, [search, statusFilter]);
  
  function loadData() {
    fetchAllData({
      page: currentPage,
      search,
      status: statusFilter !== "All" ? statusFilter : "",
      perPage: itemsPerPage,
    });
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "on_process":
        return "On Process";
      case "success":
        return "Success";
      case "rejected":
        return "Rejected";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "on_process":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-slate-100 text-slate-800";
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
    <div className="bg-slate-50 w-full min-h-screen py-24 antialiased">
      <div className="container mx-auto px-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg shadow-slate-200/70 border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <Button
                variant="ghost"
                className="group mb-2 text-slate-700 hover:text-sky-600 bg-slate-100 hover:bg-slate-300 h-9 rounded-2xl flex items-center"
                onClick={() => router.push("/dashboard")}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2 transform transition-transform duration-300 group-hover:-translate-x-1" />
                Back
              </Button>
              <h1 className="text-4xl font-bold tracking-tight text-slate-800">
                Transaction History
              </h1>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                className="w-full bg-slate-100 border-transparent rounded-lg h-11 text-base pl-11 pr-4 focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-sky-500 transition"
                placeholder="Search by Transaction ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex border-b border-slate-200">
              {["All", "success", "on_process", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 text-sm sm:text-base font-medium transition-colors duration-200 ease-in-out focus:outline-none ${
                    statusFilter === status
                      ? "border-b-2 border-sky-500 text-sky-600 font-semibold"
                      : "text-slate-500 hover:text-slate-700 border-b-2 border-transparent"
                  }`}
                >
                  {getStatusText(status)}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-100/80">
                <TableRow>
                  <TableHead className="w-[60px] p-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    No.
                  </TableHead>
                  <TableHead className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Transaction ID
                  </TableHead>
                  <TableHead className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Cashier Name
                  </TableHead>
                  <TableHead className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Total Payment
                  </TableHead>
                  <TableHead className="p-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="p-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {histories?.map((history, index) => (
                  <TableRow
                    key={history.id}
                    className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors [&:nth-child(even)]:bg-slate-50/50"
                  >
                    <TableCell className="p-4 text-center font-medium text-slate-700">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="p-4 text-slate-600 font-mono text-xs">{history.public_id}</TableCell>
                    <TableCell className="p-4 text-slate-600">
                      {moment(history.created_at).format("DD MMM YYYY - HH:mm")}
                    </TableCell>
                    <TableCell className="p-4 text-slate-800 font-medium">{history.user?.name}</TableCell>
                    <TableCell className="p-4 font-semibold text-sky-700">Rp {numeral(history.total_payment).format("0,0")}</TableCell>
                    <TableCell className="p-4 text-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles(history.status)}`}>
                            {getStatusText(history.status)}
                        </span>
                    </TableCell>
                    <TableCell className="p-4 text-center">
                      {history.status === "success" ? (
                        <Button
                          variant="ghost"
                          className="h-9 w-9 p-0 flex items-center justify-center rounded-md bg-sky-100 text-sky-600 hover:bg-sky-200 hover:text-sky-700 transition-all"
                          onClick={() => handleViewDetails(history)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {histories?.length <= 0 && (
              <div className="w-full flex flex-col justify-center h-96 items-center text-slate-500 bg-slate-50/30">
                <img
                  src="/images/empty.png"
                  alt="No data"
                  className="w-40 h-40 opacity-60 mb-4"
                />
                <p className="text-xl font-semibold">No Transactions Found</p>
                <p className="text-sm text-slate-400">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
          {histories?.length > 0 && (
            <div className="mt-6">
                <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItemsInCurrentPage={histories?.length || 0}
                />
            </div>
          )}
        </div>

        {selectedRow && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-3xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                        Invoice Details
                    </DialogTitle>
                    <DialogDescription>
                        Transaction ID: {selectedRow.public_id}
                    </DialogDescription>
                </DialogHeader>
                <div id="transaction-details" className="mt-4">
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-sm text-slate-600">
                            <p><strong>Date:</strong> {moment(selectedRow.created_at).format("DD MMMM YYYY")}</p>
                            <p><strong>Cashier:</strong> {selectedRow.user?.name}</p>
                            <p><strong>Outlet:</strong> {selectedRow.outlet?.name}</p>
                        </div>
                        <div className="flex items-center">
                            <Image src={logoReception} alt="Fisika Farma Logo" className="w-24 h-auto object-contain" />
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 overflow-hidden mb-6">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100/80">
                        <tr className="border-b border-slate-200">
                            <th className="p-3 text-left font-semibold text-slate-600 uppercase">Item</th>
                            <th className="p-3 text-right font-semibold text-slate-600 uppercase">Price</th>
                            <th className="p-3 text-center font-semibold text-slate-600 uppercase">Qty</th>
                            <th className="p-3 text-right font-semibold text-slate-600 uppercase">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedRow.order_details.map((item) => (
                            <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                            <td className="p-3 font-medium text-slate-800">{item.items.name}</td>
                            <td className="p-3 text-right text-slate-600">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                            <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                            <td className="p-3 text-right font-medium text-slate-800">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                    <div className="flex justify-end mb-6">
                        <div className="w-full max-w-xs text-sm">
                            <div className="flex justify-between py-1 text-slate-600">
                                <span>Subtotal:</span>
                                <span>Rp {Number(selectedRow.total_payment).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between py-1 text-slate-600">
                                <span>VAT (5%):</span>
                                <span>Rp {(selectedRow.total_payment * 0.05).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between py-2 mt-2 border-t-2 border-slate-200 text-base font-bold text-slate-800">
                                <span>Total Payment:</span>
                                <span>Rp {(selectedRow.total_payment * 1.05).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                </div>
              <DialogFooter>
                <Button onClick={downloadPDF} className="bg-sky-600 text-white hover:bg-sky-700 h-10 px-6 rounded-lg font-semibold">Download PDF</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}