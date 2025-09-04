"use client";
import React, { useEffect, useState, useRef } from "react";
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
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MdFilterListAlt, MdPassword, MdTune } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import useCrud from "@/hooks/useCRUD";
import { useForm, useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SheetDescription } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTrash,
  faPlus,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/Pagination";
import nookies from "nookies";
import {jwtDecode} from "jwt-decode";
import Select from 'react-select';
import logoReception from "../../../../public/images/logo.png";
import Image from "next/image";
import html2pdf from 'html2pdf.js';
import moment from "moment";
import { useToast } from "@/hooks/use-toast";

export default function Page({}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [outletid, setOutletid] = useState("");
  const [role, setRole] = useState("");
  const [outletId, setOutletId] = useState("");
  const [name, setName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const { toast } = useToast();
  const dialogRef = useRef(null);
  const itemsPerPage = 10;

  const {
    data: receptions,
    loading,
    error,
    token,
    fetchAllData,
    create,
    update,
    totalPages,
  } = useCrud("receptions");

  const { data: outlets, fetchAllData: getOutlets } = useCrud("outlets");

  const { data: items, fetchAllData: getItems } = useCrud("items");

  const outletOptions = outlets?.map((row) => ({
    value: row.id,
    label: row.name,
  }));

  useEffect(() => {
    if(!outletid){
      return;
    }
    getItems({outlet_id : outletid});
    setSelectedItems([]);
  }, [outletid]);

  const itemOptions = items?.map((row) => ({
    value: row.id,
    label: row.name,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue, 
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const removeDetail = (index) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems.splice(index, 1); 
    setSelectedItems(newSelectedItems);
    remove(index); 
  };
  

  useEffect(() => {
    const token = nookies.get("token");

    if (token) {
      const decoded = jwtDecode(token.token);
      setRole(decoded.role);
      setOutletid(decoded.outlet_id);
      setName(decoded.name);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    loadData();
    getOutlets();
    getItems();
  }, [currentPage, search, outletId, token]);

  useEffect(() => {
    if (!token) return;
    setCurrentPage(1);
    loadData();
  }, [search]);

  useEffect(() => {
    reset(selectedData || {});
  }, [selectedData, reset]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        // Abaikan klik di luar dialog, dialog tidak akan tertutup
        event.stopPropagation();
      }
    };

    // Menambahkan event listener untuk klik di luar dialog
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Membersihkan event listener ketika komponen unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const onSubmit = async (data) => {
    if (fields.length === 0) {
      toast.error("Details must have at least one item.");
      return;
    }

    try {
      const newData = {
        outlet_id: data?.outlet_id,
        kode_po: data?.kode_po,
        date_po: new Date(data.date_po).toISOString(),
        items: data?.details.map(detail => ({
          item_id: detail?.item_id,
          quantity: parseInt(detail?.qty, 10)
        }))
      };

      if (selectedData) {
        await update(selectedData.id, newData);
        toast({
          title: "Data successfully updated!",
          description: "",
          variant: "success",
        });
        } else {
        await create(newData);
        toast({
          title: "Data successfully created!",
          description: "",
          variant: "success",
        });
      }
      reset();
      setIsOpen(false);
    } catch (err) {
    }finally {
      loadData();
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  useEffect(() => {
    if (!token) return;
    fetchAllData({ page: currentPage, search });
    getOutlets();
  }, [token, currentPage, search]);

  const handleViewDetails = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  }

  function loadData() {
    fetchAllData({
      page: currentPage,
      search,
      perPage: itemsPerPage,
      outlet_id: outletId,
    });
  }

  const addDetail = (e) => {
    if (!outletid) {
      toast({
        title: "please select outlet first",
          description: "",
          variant: "destructive",
      });
      return;
    }
    e.preventDefault(); 
    append({ item_id: "", qty: 0 });
  };

  const downloadPDF = () => {
    const element = document.getElementById('receptions-details');
    const opt = {
      margin:       0.5,
      filename:     'receptions-invoice.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
  
    html2pdf().from(element).set(opt).save();
  };

  const handleCancel = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    reset();
    setIsConfirmOpen(false);
    setIsOpen(false);
    reset();
  };

  
  return (
    <div>
      <div className="bg-slate-100 w-screen min-h-screen py-12 px-4 lg:px-32 pb-32">
        <div className="bg-white p-12 rounded-xl shadow mt-20">
          <div className="flex justify-between items-center">
            <h1 className="font-bold mb-8 w-full">List of Item Receptions</h1>
            <div className="flex items-center justify-end gap-4 w-full">
              <Input
                className="max-w-lg bg-gray-50 rounded-full h-16 text-lg px-4"
                placeholder="Search by Receipt Number"
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
              Add Item Reception +
            </Button>
            <div className="items-center gap-4">
            {role == "ADMIN" && (
                  <select
                    id="outlet_id"
                    className="col-span-5 border rounded-full min-w-40 text-sm py-1 px-2 h-[36px] bg-transparent border-none focus:outline-none focus:ring-0 focus:ring-transparent active:ring-0 active:ring-transparent hover:ring-0"
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
                    Receipt Number
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    No. Order Letter
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Date
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    User
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Outlet
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-left text-white">
                    Date Order
                  </TableHead>
                  <TableHead className="p-2 bg-[#8BB2B2] text-center text-white">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receptions?.map((data, index) => (
                  <TableRow
                    key={data.id}
                    className="border-b hover:bg-gray-100 transition-colors"
                  >
                    <TableCell className="p-2 text-center font-bold">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="p-2">{data.id}</TableCell>
                    <TableCell className="p-2">{data.kode_po}</TableCell>
                    <TableCell className="p-2">{moment(data.created_at).format("DD MMM YYYY - HH:mm:ss")}
                    </TableCell>
                    <TableCell className="p-2">{data.user?.name}</TableCell>
                    <TableCell className="p-2">{data.outlet?.name}</TableCell>
                    <TableCell className="p-2">{moment(data.date_po).format("DD MMM YYYY")}</TableCell>
                    <TableCell className="p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="success"
                          className="bg-[#4f6e6e] text-white px-4 py-2 rounded hover:bg-[#253b3b] transition-colors"
                          onClick={() => handleViewDetails(data)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {receptions?.length <= 0 && (
          <div className="w-full flex flex-col justify-center h-96 items-center opacity-60">
            <img src="/images/empty.png" alt="" />
            <p className="mt-3">No item</p>
          </div>
        )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={10}
              totalItemsInCurrentPage={receptions?.length}
            />
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent 
          hideCloseButton={true} 
          onInteractOutside={(event) => event.preventDefault()}          
          className="w-full max-w-[90vw] sm:max-w-[80vw] lg:max-w-[60vw] py-8 px-4 sm:px-8 lg:px-12 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl lg:text-2xl">
                {selectedData ? "Update Item Reception" : "Add Item Reception"}
              </DialogTitle>
              <SheetDescription></SheetDescription>
            </DialogHeader>
            <div className="">
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Left side */}
                  <div>
                    <div className="mb-4">
                      <Label className="block text-sm font-medium text-gray-700 py-2">Users</Label>
                      <p className="text-lg font-semibold">{name}</p>
                    </div>
                    
                    <div className="mb-4">
                      <Label className="block text-sm font-medium text-gray-700 py-2" htmlFor="kode_po">Order Number</Label>
                      <Input
                        id="kode_po"
                        className="w-full"
                        {...register("kode_po", { required: "Kode PO is required" })}
                      />
                      {errors.kode_po && (
                        <small className="text-rose-500 text-right">{errors.kode_po.message}</small>
                      )}
                    </div>

                    <div className="">
                      <input
                        type="hidden"
                        {...register("user_id")}
                        value={jwtDecode(nookies.get("token").token).user_id}
                      />
                      {role === "ADMIN" ? (
                        <div className="">
                          <Label className="block text-sm font-medium text-gray-700 py-2" htmlFor="outlet_id">Outlet</Label>
                          <Select
                            id="outlet_id"
                            className="col-span-5 items-center rounded-md text-sm py-2 w-full sm:w-[500px]"
                            options={outletOptions}
                            // value={outletOptions.find(option => option.value === outletid)} 
                            onChange={(selectedOption) => {
                              setValue("outlet_id", selectedOption.value);
                              setOutletid(selectedOption.value);
                            }}
                            placeholder="Select Outlet"
                            required
                          />
                        </div>
                      ) : (
                        <input
                          type="hidden"
                          {...register("outlet_id")}
                          value={outletid}
                        />
                      )}
                      {errors.outlet_id && (
                        <small className="text-rose-500">{errors.outlet_id.message}</small>
                      )}
                    </div>
                  </div>

                  {/* Right side */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 py-2">Goods Receipt Date</label>
                      <p className="text-lg font-semibold">{moment(Date.now()).format("DD MMM YYYY - HH:mm:ss")}</p>
                    </div>
                    <div className="mb-4">
                      <Label className="block text-sm font-medium text-gray-700 py-2" htmlFor="date_po">Order Date</Label>
                      <Input
                        id="date_po"
                        type="date"
                        className="w-full"
                        {...register("date_po", { required: "Date PO is required" })}
                      />
                      {errors.date_po && (
                        <small className="text-rose-500 text-right">{errors.date_po.message}</small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="">
                  <Label className="text-right font-bold text-lg tracking-wide">Detail Items</Label>
                  <div>
                    <Button variant="button2" onClick={addDetail} className="mt-2 mb-4">
                      <FontAwesomeIcon icon={faPlus} /> Add Item
                    </Button>
                  </div>
                  <div className={`border p-4 rounded-md ${fields.length > 5 ? 'max-h-[200px] overflow-y-scroll' : ''}`}>
                    <table className="w-full text-sm bg-white rounded-lg shadow border border-gray-300">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="p-2 text-left">No.</th>
                          <th className="p-2 text-left">Item</th>
                          <th className="p-2 text-left">Quantity</th>
                          <th className="p-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field, index) => (
                          <tr key={field.id} className="border-b">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">
                            <Select
                              id={`details.${index}.item_id`}
                              className="col-span-5 rounded-md text-sm py-2 w-full sm:w-[500px]"
                              options={itemOptions.filter(
                                (option) => !selectedItems.includes(option.value) 
                              )}
                              onChange={(selectedOption) => {
                                const newSelectedItems = [...selectedItems];
                                newSelectedItems[index] = selectedOption.value;
                                setSelectedItems(newSelectedItems);
                                setValue(`details.${index}.item_id`, selectedOption.value);
                              }}
                              // value={selectedItems[index] ? { value: selectedItems[index], label: itemOptions.find(opt => opt.value === selectedItems[index])?.label } : null}
                              placeholder="Select Item"
                              required
                            />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                className="w-full border rounded-md text-sm p-2"
                                {...register(`details.${index}.qty`, {
                                  required: "Quantity is required",
                                  min: { value: 1, message: "Qty not 0" },
                                })}
                              />
                              {errors.details?.[index]?.qty && (
                                <small className="text-rose-500 text-left">{errors.details[index].qty.message}</small>
                              )}
                            </td>
                            <td className="p-2">
                              <Button
                                variant="destructive"
                                onClick={() => removeDetail(index)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {!loading ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="buttonCancel"
                      className="w-32"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="btn-submit w-32"
                      variant="button2"
                      type="submit"
                    >
                      {selectedData ? "Update" : "Save"}{" "}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end w-full">
                    <img className="w-12" src="/images/loader.gif" alt="" />
                  </div>
                )}
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="max-w-md p-8 border border-[#638B8B] rounded-lg shadow-lg bg-gradient-to-r transform transition-transform duration-300 ease-in-out">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl lg:text-2xl">
                Confirm Exit
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to exit? Your data will not be saved.</p>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="buttonCancel" onClick={() => setIsConfirmOpen(false)}>
                No
              </Button>
              <Button variant="button2" onClick={handleConfirmCancel}>
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  
      {selectedRow && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-full sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] p-8 border border-[#638B8B] rounded-lg shadow-lg bg-gradient-to-r  transform transition-transform duration-300 ease-in-out">
              <div id="receptions-details">

                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-[#4F6A6A]">Goods receipt</h2>
                    <p className="text-lg font-semibold text-[#638B8B]">Receipt number : {selectedRow.id}</p>
                    <p className="text-lg font-semibold text-[#638B8B]">Receipt date : {moment(selectedRow.created_at).format("DD MMM YYYY - HH:mm:ss")}</p>
                  </div>
                  <div className="flex items-center">
                    <Image src={logoReception} alt="Fisika Farma Logo" className="w-24 h-auto object-contain" />
                  </div>
                </div>

                <div className="mb-8 bg-white p-4 rounded-lg shadow-inner border border-[#8BB2B2]">
                  <p><strong>No. Order : </strong> {selectedRow.kode_po}</p>
                  <p><strong>Order date : </strong> {moment(selectedRow.date_po).format("DD MMM YYYY")}</p>
                  <p><strong>Cashier Name : </strong> {selectedRow.user?.name}</p>
                  <p><strong>Outlet : </strong> {selectedRow.outlet?.name}</p>
                </div>

                <hr className="my-6 border-[#638B8B]" />

                <div className="mb-8">
                  <table className="w-full text-sm bg-white rounded-lg shadow border border-[#638B8B]">
                    <thead className="bg-[#8BB2B2]">
                      <tr className="border-b">
                      <th className="text-left p-2 text-white">No.</th>
                        <th className="text-left p-2 text-white">Item</th>
                        <th className="text-left p-2 text-white">Unit</th>
                        <th className="text-left p-2 text-white">Quantity Requested</th>
                        <th className="text-left p-2 text-white">Quantity Received</th>
                        <th className="text-left p-2 text-white">Unit Price</th>
                        <th className="text-right p-2 text-white">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRow.item_reception_details.map((item, index) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2"> {(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="p-2">{item.item?.name}</td>
                          <td className="p-2">{item.item?.unit}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">Rp {Number(item.item?.price).toLocaleString('id-ID')}</td>
                          <td className="p-2 text-right">Rp {(item.quantity * item.item?.price).toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
                <DialogFooter className="flex justify-center mt-4">    
                  <Button onClick={downloadPDF} className="bg-[#638B8B] text-white hover:bg-[#4F6A6A] py-2 px-4 rounded-sm shadow-md transition duration-300 transform hover:scale-105">Download PDF</Button>
                  </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}