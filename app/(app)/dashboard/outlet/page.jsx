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
import useCrud from "@/hooks/useCRUD";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faTrash,
  faPlus,
  faSearch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/Pagination";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const itemsPerPage = 10;

  // useCrud hook berisi fetchAllData, create, update, remove, pagination support
  const {
    data: outlets,
    token,
    loading,
    error,
    errorReset,
    fetchAllData,
    create,
    update,
    remove,
    totalPages,
  } = useCrud("outlets");

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors }, // Renamed to avoid conflict with `error` from useCrud
    reset,
  } = useForm();

  // Fetch data saat komponen mount atau terjadi perubahan pada currentPage dan search
  useEffect(() => {
    if (!token) return;
    loadData();
  }, [currentPage, search, token]);

  // Kembali ke halaman pertama saat search query berubah
  useEffect(() => {
    if (!token) return;
    setCurrentPage(1);
    loadData();
  }, [search]);


  // Reset form ketika selectedData berubah
  useEffect(() => {
    reset(
      selectedData || { id: "", name: "", address: "", phone: "", email: "" }
    );
  }, [selectedData, reset]);

  // Handle submit untuk create dan update
  const onSubmit = async (data) => {
    try {
      if (selectedData) {
        await update(selectedData.id, data);
        toast({
          title: "Update Successful!",
          description: "Outlet data has been updated.",
          variant: "success",
        });
      } else {
        await create(data);
        toast({
          title: "Creation Successful!",
          description: "A new outlet has been added.",
          variant: "success",
        });
      }
      reset();
      errorReset();
      loadData();
      setIsOpen(false);
    } catch (err) {
      toast({
        title: "Operation Failed!",
        description: "Something went wrong. Please check the form and try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete data
  const handleDelete = async () => {
    try {
      if (dataToDelete) {
        await remove(dataToDelete.id);
        setDeleteWarningOpen(false);
        setDataToDelete(null);
      }
      toast({
        title: "Deletion Successful!",
        description: "The outlet has been permanently removed.",
        variant: "success",
      });
      loadData();
    } catch (error) {
       toast({
        title: "Deletion Failed!",
        description: "Could not delete the outlet. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Handle page change untuk pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle edit data
  const handleEdit = (outlet) => {
    setSelectedData(outlet);
    errorReset();
    setIsOpen(true);
  };

  function loadData() {
    fetchAllData({
      page: currentPage,
      search,
      perPage: itemsPerPage,
    });
  }

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
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="mr-2 transform transition-transform duration-300 group-hover:-translate-x-1"
                />
                Back
              </Button>
              <h1 className="text-4xl font-bold tracking-tight text-slate-800">
                Outlets Management
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="h-11 px-5 inline-flex items-center justify-center rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-all font-semibold gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-px"
                onClick={() => {
                  setSelectedData(null);
                  reset({});
                  errorReset();
                  setIsOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Outlet
              </Button>
            </div>
          </div>

          <div className="mb-6 relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              className="w-full max-w-sm bg-slate-100 border-transparent rounded-lg h-11 text-base pl-11 pr-4 focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-sky-500 transition"
              placeholder="Search by name, address, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-100/80">
                <TableRow>
                  <TableHead className="w-[60px] p-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    No.
                  </TableHead>
                  <TableHead className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    ID
                  </TableHead>
                  <TableHead className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Address
                  </TableHead>
                  <TableHead className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Phone
                  </TableHead>
                  <TableHead className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Email
                  </TableHead>
                  <TableHead className="p-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outlets?.map((outlet, index) => (
                  <TableRow
                    key={outlet.id}
                    className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors [&:nth-child(even)]:bg-slate-50/50"
                  >
                    <TableCell className="p-4 text-center font-medium text-slate-700">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="p-4 text-slate-500 font-mono text-xs">
                      {outlet.id}
                    </TableCell>
                    <TableCell className="p-4 text-slate-800 font-medium">
                      {outlet.name}
                    </TableCell>
                    <TableCell className="p-4 text-slate-600 max-w-xs truncate">
                      {outlet.address}
                    </TableCell>
                    <TableCell className="p-4 text-slate-600">
                      {outlet.phone}
                    </TableCell>
                    <TableCell className="p-4 text-slate-600">
                      {outlet.email}
                    </TableCell>
                    <TableCell className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          className="h-9 w-9 p-0 flex items-center justify-center rounded-md bg-sky-100 text-sky-600 hover:bg-sky-200 hover:text-sky-700 transition-all"
                          onClick={() => handleEdit(outlet)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-9 w-9 p-0 flex items-center justify-center rounded-md bg-rose-100 text-rose-600 hover:bg-rose-200 hover:text-rose-700 transition-all"
                          onClick={() => {
                            setDataToDelete(outlet);
                            setDeleteWarningOpen(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {outlets?.length <= 0 && (
              <div className="w-full flex flex-col justify-center h-96 items-center text-slate-500 bg-slate-50/30">
                 <img
                  src="/images/empty.png"
                  alt="No data"
                  className="w-40 h-40 opacity-60 mb-4"
                />
                <p className="text-xl font-semibold">No Outlets Found</p>
                <p className="text-sm text-slate-400">
                   Try adjusting your search to find what you're looking for.
                </p>
              </div>
            )}
          </div>
          
          {outlets?.length > 0 && (
            <div className="mt-6">
               <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={10}
                totalItemsInCurrentPage={outlets.length}
              />
            </div>
          )}
        </div>
      </div>

      <Dialog open={deleteWarningOpen} onOpenChange={setDeleteWarningOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              Are you sure you want to delete this outlet? This action is
              irreversible and will permanently remove the data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteWarningOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              {selectedData ? "Edit Outlet Details" : "Add a New Outlet"}
            </DialogTitle>
            <DialogDescription>
              Please fill in the form below. All fields are optional.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 pt-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-left font-medium text-slate-700">
                Outlet Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Apotek Sehat Sentosa"
                className="h-11"
                {...register("name", { required: false })}
              />
              {error?.name && (
                <small className="text-red-500">{error.name}</small>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address" className="text-left font-medium text-slate-700">
                Address
              </Label>
              <Input
                id="address"
                placeholder="e.g., Jl. Merdeka No. 123"
                className="h-11"
                {...register("address", { required: false })}
              />
              {error?.address && (
                <small className="text-red-500">{error.address}</small>
              )}
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="phone" className="text-left font-medium text-slate-700">
                        Phone
                    </Label>
                    <Input
                        id="phone"
                        placeholder="e.g., 081234567890"
                        className="h-11"
                        {...register("phone", { required: false })}
                    />
                    {error?.phone && (
                        <small className="text-red-500">{error.phone}</small>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-left font-medium text-slate-700">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="e.g., info@apotek.com"
                        className="h-11"
                        {...register("email", { required: false })}
                    />
                    {error?.email && (
                        <small className="text-red-500">{error.email}</small>
                    )}
                </div>
             </div>
           
            <DialogFooter className="mt-4 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  reset();
                  setIsOpen(false);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 min-w-[120px]"
                disabled={loading}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : selectedData ? (
                  "Update Changes"
                ) : (
                  "Save Outlet"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}