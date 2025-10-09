"use client";

import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/Pagination";
import SearchInput from "@/components/admin/ui/SearchInput";
import { Category, Language, Product } from "@/types";
import { Edit, Eye, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import ProductFormModal from "@/components/admin/modals/ProductFormModal";
import { useProductStore } from "@/store/useProductStore";
import { fetchAllCategoriesAPI } from "@/lib/api/categories";

const ProductsPage: React.FC = () => {
  const lang = "ar" as Language;

  // Zustand store integration
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  // Fetch initial data from Firebase via the store
  useEffect(() => {
    fetchProducts();
    fetchAllCategoriesAPI().then(setCategories);
  }, [fetchProducts]);

  // Local filtering based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lowercasedFilter = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.ar.toLowerCase().includes(lowercasedFilter) ||
        product.name.fr.toLowerCase().includes(lowercasedFilter) ||
        product.category.name.ar.toLowerCase().includes(lowercasedFilter) ||
        product.category.name.fr.toLowerCase().includes(lowercasedFilter)
    );
  }, [products, searchTerm]);

  // Local pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true); // <-- Loading starts here
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to submit form:", err);
    } finally {
      setIsSubmitting(false); // <-- Loading stops here
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        // Optionally show a success toast/notification
      } catch (err) {
        console.error("Failed to delete product:", err);
        // Optionally show an error toast/notification
      }
    }
  };

  const columns: {
    key: keyof Product;
    label: string;
    sortable: boolean; // Note: Sorting is now handled by the DataTable's internal hook
    render?: (item: Product) => React.ReactNode;
  }[] = [
    {
      key: "name",
      label: "المنتج",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-4">
          <Image
            src={item.image}
            alt={item.name[lang]}
            width={48}
            height={48}
            className="w-12 h-12 rounded-md object-cover bg-gray-100"
          />
          <span className="font-medium text-gray-800">{item.name[lang]}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "الفئة",
      sortable: true,
      render: (item) => item.category.name[lang],
    },
    {
      key: "price",
      label: "السعر",
      sortable: true,
      render: (item) => (
        <span className="font-mono">{item.price.toFixed(2)} د.م.</span>
      ),
    },
  ];

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load products: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 self-start md:self-center">
          إدارة المنتجات ({products.length})
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="...ابحث عن منتج"
          />
          <button
            onClick={handleOpenAddModal}
            className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors w-full md:w-auto justify-center"
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline">منتج جديد</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={paginatedProducts}
        isLoading={isLoading && products.length === 0}
        itemsPerPage={itemsPerPage}
        renderActions={(item: Product) => (
          <div className="flex gap-2">
            <button
              title="View (not implemented)"
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <Eye size={18} />
            </button>
            <button
              title="Edit Product"
              onClick={() => handleOpenEditModal(item)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <Edit size={18} />
            </button>
            <button
              title="Delete Product"
              onClick={() => handleDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          product={editingProduct}
          categories={categories}
          lang={lang}
          isSubmitting={isSubmitting} // <-- State is passed to the modal
        />
      )}
    </div>
  );
};

export default ProductsPage;
