"use client";

import { useState } from "react";
import { Order } from "@/store/useOrderStore";
import { Language } from "@/types";
import { 
  X, 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  CreditCard,
  Edit2,
  Check,
  Truck,
  PackageCheck,
  XCircle
} from "lucide-react";
import Image from "next/image";

interface OrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  lang: Language;
  onStatusUpdate: (orderId: string, status: Order["status"]) => Promise<void>;
  isUpdating?: boolean;
}

const OrderViewModal: React.FC<OrderViewModalProps> = ({
  isOpen,
  onClose,
  order,
  lang,
  onStatusUpdate,
  isUpdating = false,
}) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Order["status"]>("pending");

  if (!isOpen || !order) return null;

  // Status configuration
  const statusConfig = {
    pending: {
      label: "قيد الانتظار",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    shipped: {
      label: "تم الشحن",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Truck,
    },
    delivered: {
      label: "تم التوصيل",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: PackageCheck,
    },
    cancelled: {
      label: "ملغي",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    },
  };

  const handleStatusUpdate = async () => {
    try {
      await onStatusUpdate(order.id, selectedStatus);
      setIsEditingStatus(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "غير محدد";
    return new Intl.DateTimeFormat("ar-MA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} د.م.`;
  };

  const StatusIcon = statusConfig[order.status].icon;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">تفاصيل الطلب</h2>
              <p className="text-sm text-gray-600 font-mono">#{order.id.slice(0, 12)}...</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="p-2 rounded-full text-gray-500 hover:bg-white/50 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Order Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <StatusIcon className="w-5 h-5" />
                حالة الطلب
              </h3>
              {!isEditingStatus && (
                <button
                  onClick={() => {
                    setSelectedStatus(order.status);
                    setIsEditingStatus(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  disabled={isUpdating}
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>

            {isEditingStatus ? (
              <div className="flex items-center gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Order["status"])}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isUpdating}
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="shipped">تم الشحن</option>
                  <option value="delivered">تم التوصيل</option>
                  <option value="cancelled">ملغي</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || selectedStatus === order.status}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check size={16} />
                  حفظ
                </button>
                <button
                  onClick={() => setIsEditingStatus(false)}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border font-medium ${statusConfig[order.status].color}`}>
                <StatusIcon size={16} />
                {statusConfig[order.status].label}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                معلومات الطلب
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ الطلب:</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">آخر تحديث:</span>
                  <span className="font-medium">{formatDate(order.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">اللغة:</span>
                  <span className="font-medium">{order.locale === "ar" ? "العربية" : "الفرنسية"}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">الإجمالي:</span>
                  <span className="font-bold text-green-600">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                معلومات العميل
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">{order.shippingInfo.fullName}</p>
                    <p className="text-sm text-gray-600">اسم العميل</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800" dir="ltr">{order.shippingInfo.phone}</p>
                    <p className="text-sm text-gray-600">رقم الهاتف</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">{order.shippingInfo.address}</p>
                    <p className="text-sm text-gray-600">عنوان التوصيل</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              المنتجات ({order.products.length})
            </h3>
            <div className="space-y-4">
              {order.products.map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden border">
                    <Image
                      src={product.image}
                      alt={product.name[lang]}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{product.name[lang]}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">الكمية: {product.quantity}</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(product.price * product.quantity)}
                    </p>
                    <p className="text-xs text-gray-500">المجموع</p>
                  </div>
                </div>
              ))}
              
              {/* Total */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">المجموع الإجمالي:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

// Clock icon component (missing from lucide-react import)
const Clock = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

export default OrderViewModal;