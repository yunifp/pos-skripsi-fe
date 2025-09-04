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
import { MdFilterListAlt, MdPassword, MdTune } from "react-icons/md";
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
  const [sortBy, setSortBy] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Tambahkan state ini
  const [selectedData, setSelectedData] = useState(null);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const {
    data: users,
    error: usersError,
    fetchAllData: fetchAllUserData,
    create: createUserData,
    update: updateUserData,
    remove: removeUserData,
    pagination: usersPagination,
    token,
    totalPages,
  } = useCrud("users");

  const { data: outlets, fetchAllData: fetchAllOutletsData } =
    useCrud("outlets");

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      if (!selectedData) {
        await createUserData(data);
        toast({
          title: "Data successfully created!",
          description: "",
          variant: "success",
        });
      } else {
        await updateUserData(selectedData.id, data);
        toast({
          title: "Data successfully updated!",
          description: "",
          variant: "success",
        });
      }
      setIsOpen(false);
    } catch (error) {
    } finally {
      loadData();
    }
  };

  const handleDelete = async () => {
    try {
      await removeUserData(dataToDelete.id);
      toast({
        title: "Data deleted successfully!",
        description: "",
        variant: "success",
      });
      setDeleteWarningOpen(false);
    } catch (error) {
    } finally {
      loadData();
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    reset(
      selectedData || { id: "", name: "", address: "", phone: "", email: "" }
    );
  }, [selectedData, reset]);

  useEffect(() => {
    if (selectedData) {
      reset({
        name: selectedData.name,
        email: selectedData.email,
        password: selectedData.password,
        role: selectedData.role,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: "",
      });
    }
  }, [selectedData, reset]);

  function loadData() {
    fetchAllUserData({
      page: currentPage,
      search,
      sortBy,
    });
  }
  const appylyFilterHandle = () => {
    fetchAllUserData({ page: currentPage, search, sortBy });
    setIsFilterOpen(false);
  };
  useEffect(() => {
    if (!token) return;
    fetchAllUserData({ page: currentPage, search, sortBy });
    fetchAllOutletsData();
  }, [token, currentPage, search]);

  return (
    <div>
      <div className="bg-slate-100 w-screen min-h-screen py-12 px-4 lg:px-32 pb-32 ">
        <div className="bg-white p-12 rounded-xl shadow lg:mt-20 md:mt-16 mt-10">
          <div className="flex justify-between items-center">
            <h1 className="font-bold mb-8 w-full">List of Users</h1>
            <div className="flex items-center justify-end gap-4 w-full">
              <Input
                className="max-w-lg bg-gray-50 rounded-full h-16 text-lg px-4"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
              <div
                className="bg-[#8BB2B2] hover:bg-[#638B8B] text-white p-4 text-3xl w-16 h-16 rounded-sm cursor-pointer transition-colors duration-100"
                onClick={() => {
                  setIsFilterOpen(true);
                }}>
                <MdFilterListAlt />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="button1"
              onClick={() => {
                router.push("/dashboard");
              }}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Button
              variant="button1"
              onClick={() => {
                setSelectedData(null);
                setIsOpen(true);
                reset();
              }}>
              Add User +
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
                    Outlet
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Name
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Email
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Role
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-center text-white">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className="border-b hover:bg-gray-100 transition-colors">
                    <TableCell className="p-2 text-center font-bold">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="p-2">{row.outlet?.name}</TableCell>
                    <TableCell className="p-2">{row.name}</TableCell>
                    <TableCell className="p-2">{row.email}</TableCell>
                    <TableCell className="p-2">{row.role}</TableCell>
                    <TableCell className="p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="success"
                          className="bg-[#4f6e6e] text-white px-4 py-2 rounded hover:bg-[#253b3b] transition-colors"
                          onClick={() => {
                            setSelectedData(row);
                            setIsOpen(true);
                          }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                          onClick={() => {
                            setDataToDelete(row);
                            setDeleteWarningOpen(true);
                          }}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {users?.length <= 0 && (
          <div className="w-full flex flex-col justify-center h-96 items-center opacity-60">
            <img src="/images/empty.png" alt="" />
            <p className="mt-3">No item</p>
          </div>
        )}
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              itemsPerPage={10}
              totalItemsInCurrentPage={users.length}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteWarningOpen} onOpenChange={setDeleteWarningOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <SheetDescription> </SheetDescription>
            </DialogHeader>
            <p>
              This action cannot be undone. This will permanently delete the
              user.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="buttonCancel"
                className="btn-secondary"
                onClick={() => setDeleteWarningOpen(false)}>
                Cancel
              </Button>
              <Button
                className="btn-error"
                variant="button2"
                onClick={handleDelete}>
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
                {selectedData ? "Update User" : "Add User"}
              </DialogTitle>

              <SheetDescription> </SheetDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 py-4 text-right">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className={"text-right"}>Role</Label>
                <select {...register("role")}>
                  <option value="">Role</option>
                  <option value="KASIR">KASIR</option>
                  <option value="STAFF">STAFF</option>
                </select>
              </div>
              {usersError?.role && (
                <small className="text-red-500 text-sm">
                  {usersError?.role}
                </small>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className={"text-right"}>Outlets</Label>
                <select {...register("outlet_id")}>
                  {!selectedData ? (
                    <option value="">Outlet</option>
                  ) : (
                    <option value={selectedData.outlet_id}>
                      {selectedData.outlet?.name}
                    </option>
                  )}
                  {outlets.map((outlet, index) => (
                    <>
                      <option key={index} value={outlet.id}>
                        {outlet.name}
                      </option>
                    </>
                  ))}
                </select>
              </div>
              {usersError?.name && (
                <small className="text-red-500 text-sm">
                  {usersError?.name}
                </small>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  defaultValue={selectedData ? selectedData.name : ""}
                  {...register("name")}
                />
              </div>
              {usersError?.name && (
                <small className="text-red-500 text-sm">
                  {usersError?.name}
                </small>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  className="col-span-3"
                  defaultValue={selectedData ? selectedData.email : ""}
                  {...register("email")}
                />
              </div>
              {usersError?.email && (
                <small className="text-red-500 text-sm">
                  {usersError?.email}
                </small>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  className="col-span-3"
                  defaultValue={selectedData ? selectedData.password : ""}
                  {...register("password")}
                />
              </div>
              {usersError?.password && (
                <small className="text-red-500 text-sm">
                  {usersError?.password}
                </small>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="buttonCancel"
                  onClick={() => {
                    setIsOpen(false);
                  }}>
                  Cancel
                </Button>
                <Button type="submit" variant="button2">
                  {selectedData ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* dialog filter */}
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filter Users</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(() => {})}
              className="grid gap-4 py-4 text-right">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="filter-options" className="text-right">
                  Filter By
                </Label>
                <select
                  onClick={(e) => setSortBy(e.target.value)}
                  id="filter-options"
                  className="col-span-3 border rounded p-2"
                  {...register("filterOptions")}>
                  <option value="">Sort</option>
                  <option value="created_at:asc">Oldest To Newest</option>
                  <option value="created_at:desc">Newest To oldest</option>
                </select>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="button2"
                  onClick={appylyFilterHandle}>
                  Apply Filter
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
