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
    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج؟")) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        console.error("Failed to delete product:", err);
      }
    }
  };

  const columns: {
    key: keyof Product;
    label: string;
    sortable: boolean;
    render?: (item: Product) => React.ReactNode;
  }[] = [
    {
      key: "name",
      label: "المنتج",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Image
            src={item.image}
            alt={item.name[lang]}
            width={48}
            height={48}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-md object-cover bg-gray-100 flex-shrink-0"
          />
          <span
            className="font-medium text-gray-800 text-sm sm:text-base truncate min-w-0"
            title={item.name[lang]}
          >
            {item.name[lang]}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      label: "الفئة",
      sortable: true,
      render: (item) => (
        <span
          className="text-sm sm:text-base text-gray-600 truncate block max-w-[100px] sm:max-w-[150px]"
          title={item.category.name[lang]}
        >
          {item.category.name[lang]}
        </span>
      ),
    },
    {
      key: "price",
      label: "السعر",
      sortable: true,
      render: (item) => (
        <span className="font-mono text-sm sm:text-base">
          {item.price.toFixed(2)} د.م.
        </span>
      ),
    },
  ];

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 px-4">
        Failed to load products: {error}
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 self-start md:self-center">
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
            // className="w-full md:w-auto"
          />
          <button
            onClick={handleOpenAddModal}
            className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors w-full md:w-auto justify-center text-sm sm:text-base"
          >
            <PlusCircle size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">منتج جديد</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3 mb-6">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start gap-3">
              <Image
                src={product.image}
                alt={product.name[lang]}
                width={60}
                height={60}
                className="w-15 h-15 rounded-md object-cover bg-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                {/* Product Name with Label */}
                <div className="mb-2">
                  <span className="text-xs text-gray-500 font-medium block mb-1">
                    اسم المنتج:
                  </span>
                  <h3 className="font-medium text-gray-800 text-base truncate">
                    {product.name[lang]}
                  </h3>
                </div>

                {/* Category with Label */}
                <div className="mb-2">
                  <span className="text-xs text-gray-500 font-medium block mb-1">
                    الفئة:
                  </span>
                  <p className="text-sm text-gray-600 truncate">
                    {product.category.name[lang]}
                  </p>
                </div>

                {/* Price with Label */}
                <div className="mb-3">
                  <span className="text-xs text-gray-500 font-medium block mb-1">
                    السعر:
                  </span>
                  <p className="text-lg font-bold text-green-600">
                    {product.price.toFixed(2)} د.م.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md text-sm transition-colors flex-1 justify-center"
                  >
                    <Edit size={14} />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md text-sm transition-colors flex-1 justify-center"
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && products.length === 0 && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-15 h-15 bg-gray-200 rounded-md animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Name skeleton with label */}
                    <div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                    {/* Category skeleton with label */}
                    <div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-12 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                    {/* Price skeleton with label */}
                    <div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-10 mb-1"></div>
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    </div>
                    {/* Buttons skeleton */}
                    <div className="flex gap-2 mt-3">
                      <div className="h-8 bg-gray-200 rounded animate-pulse flex-1"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse flex-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {paginatedProducts.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "لا توجد منتجات مطابقة للبحث" : "لا توجد منتجات"}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={paginatedProducts}
            isLoading={isLoading && products.length === 0}
            itemsPerPage={itemsPerPage}
            renderActions={(item: Product) => (
              <div className="flex gap-1 sm:gap-2">
                <button
                  title="عرض المنتج"
                  className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  title="تعديل المنتج"
                  onClick={() => handleOpenEditModal(item)}
                  className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  title="حذف المنتج"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            )}
            emptyMessage="لا توجد منتجات"
          />
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          product={editingProduct}
          categories={categories}
          lang={lang}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ProductsPage;
