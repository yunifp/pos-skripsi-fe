import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useCrud from "@/hooks/useCRUD";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const SearchItemCard = ({ item, setSearchItem, setSearch }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    item_id: null,
    quantity: 1,
  });
  const params = useParams();

  const { create, loading, error } = useCrud(`orders/${params.id}/detail`);

  const addOrderDetail = async () => {
    try {
      await create(form);
      setSearchItem([]);
      setSearch("");
    } catch (error) {}
  };

  useEffect(() => {
    if (!error) return;
    toast({
      title: error?.quantity || "Insufficient stock",
      description: "",
      variant: "destructive",
      className: "",
    });
  }, [error]);

  useEffect(() => {
    if (!item) return;

    setForm((prev) => {
      return {
        ...prev,
        item_id: item.id,
      };
    });
  }, [item]);

  return (
    <div className="flex justify-between items-center p-4 bg-white border-[1px] border-slate-300 rounded-lg mb-3">
      <div>
        <p className="font-semibold">{item?.name}</p>
        <p className="text-sm text-slate-600">Price : {item?.price}</p>
        <p className="text-[.75rem] text-slate-600 mt-2">
          Stock : {item?.stock}
        </p>
      </div>
      <div>
        <Button
          type="button"
          disabled={loading || item?.stock <= 0}
          variant="success"
          onClick={addOrderDetail}
          className="rounded-lg"
        >
          Add To Cart
        </Button>
      </div>
    </div>
  );
};
export default SearchItemCard;
