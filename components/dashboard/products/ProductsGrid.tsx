import { ShoppingBag } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/app/hooks/useProducts";

type Props = {
  loading: boolean;
  products: Product[];
  selectedId: string | null;
  productRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export default function ProductsGrid({
  loading,
  products,
  selectedId,
  productRefs,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[380px] bg-slate-200 dark:bg-slate-900 rounded-[2rem]"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
        <ShoppingBag className="text-slate-300 mb-4" size={48} />

        <p className="text-slate-500 font-medium">
          Your inventory is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          selected={selectedId === product._id}
          onEdit={onEdit}
          onDelete={onDelete}
          registerRef={(el) => {
            productRefs.current[product._id] = el;
          }}
        />
      ))}
    </div>
  );
}