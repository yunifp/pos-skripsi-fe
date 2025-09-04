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
  faTrash,
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
    totalPages
  } = useCrud("outlets");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch data saat komponen mount atau terjadi perubahan pada currentPage dan search
  useEffect(() => {
    if (!token) return;
    loadData();
  }, [currentPage, search, token]);

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
          title: "Data updated successfully!",
          description: "",
          variant: "success",
        });
      } else {
        await create(data);
        toast({
          title: "Data updated successfully!",
          description: "",
          variant: "success",
        });
      }
      reset();
      errorReset();
      loadData();
      setIsOpen(false);
    } catch (err) {}
  };

  // Handle delete data
  const handleDelete = () => {
    try {
      if (dataToDelete) {
        remove(dataToDelete.id);
        setDeleteWarningOpen(false);
      }
      toast({
        title: "Data deleted successfully!",
        description: "",
        variant: "success",
      });
      loadData();
    } catch (error) {}
  };

  // Handle page change untuk pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle edit data
  const handleEdit = (outlet) => {
    setSelectedData(outlet);
    setIsOpen(true);
  };

  function loadData() {
    fetchAllData({
      page: currentPage,
      search,
      perPage: itemsPerPage
    });
  }

  return (
    <div>
      <div className="bg-slate-100 w-screen min-h-screen py-12 px-4 lg:px-32 pb-32">
        <div className="bg-white p-12 rounded-xl shadow lg:mt-20 md:mt-16 mt-10">
          <div className="flex justify-between items-center">
            <h1 className="font-bold mb-8 w-full">List of Outlets</h1>
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
            <Button
              variant="button1"
              onClick={() => {
                setSelectedData(null);
                setIsOpen(true);
              }}
            >
              Add Outlet +
            </Button>
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
                    Name
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Address
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Phone
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Email
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-center text-white">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outlets?.map((outlet, index) => (
                  <TableRow
                    key={outlet.id}
                    className="border-b hover:bg-gray-100 transition-colors"
                  >
                    <TableCell className="p-2 text-center font-bold">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="p-2">{outlet.id}</TableCell>
                    <TableCell className="p-2">{outlet.name}</TableCell>
                    <TableCell className="p-2">{outlet.address}</TableCell>
                    <TableCell className="p-2">{outlet.phone}</TableCell>
                    <TableCell className="p-2">{outlet.email}</TableCell>
                    <TableCell className="p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="success"
                          className="bg-[#4f6e6e] text-white px-4 py-2 rounded hover:bg-[#253b3b] transition-colors"
                          onClick={() => handleEdit(outlet)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
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
          <div className="w-full flex flex-col justify-center h-96 items-center opacity-60">
            <img src="/images/empty.png" alt="" />
            <p className="mt-3">No item</p>
          </div>
        )}

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={10}
              totalItemsInCurrentPage={outlets.length}
            />
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteWarningOpen} onOpenChange={setDeleteWarningOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <SheetDescription></SheetDescription>
            </DialogHeader>
            <p>
              This action cannot be undone. This will permanently delete the
              outlet.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="buttonCancel"
                onClick={() => setDeleteWarningOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="btn-error"
                variant="button2"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create & Update Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedData ? "Update Outlet" : "Add Outlet"}
              </DialogTitle>
              <SheetDescription></SheetDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 py-4 text-right"
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  {...register("name", { required: false })}
                />
              </div>
              {error?.name && (
                <small className="text-rose-500">{error.name}</small>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  className="col-span-3"
                  {...register("address", { required: false })}
                />
              </div>
              {error?.address && (
                <small className="text-rose-500">{error.address}</small>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  className="col-span-3"
                  {...register("phone", { required: false })}
                />
              </div>
              {error?.phone && (
                <small className="text-rose-500">{error.phone}</small>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  className="col-span-3"
                  {...register("email", { required: false })}
                />
              </div>
              {error?.email && (
                <small className="text-rose-500">{error.email}</small>
              )}
              {/* {error} */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="buttonCancel"
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button className="btn-submit" variant="button2" type="submit">
                  {selectedData ? "Update" : "Save"}{" "}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
