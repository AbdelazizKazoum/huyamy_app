import { Transition } from "@headlessui/react";
import {
  Layers,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { siteConfig } from "@/config/site"; // Add this import
import Image from "next/image";

const Sidebar: React.FC<{
  isCollapsed: boolean;
}> = ({ isCollapsed }) => {
  const pathname = usePathname();
  const baseAdminPath = pathname.split("/").slice(0, 3).join("/");

  const navItems = [
    {
      id: "dashboard",
      label: "لوحة التحكم",
      icon: LayoutDashboard,
      href: baseAdminPath,
    },
    {
      id: "orders",
      label: "الطلبات",
      icon: ShoppingCart,
      href: `${baseAdminPath}/orders`,
    },
    {
      id: "products",
      label: "المنتجات",
      icon: Package,
      href: `${baseAdminPath}/products`,
    },
    {
      id: "categories",
      label: "الفئات",
      icon: Tag,
      href: `${baseAdminPath}/categories`,
    },
    {
      id: "sections",
      label: "الأقسام",
      icon: Layers,
      href: `${baseAdminPath}/sections`,
    },
  ];

  const isActive = (href: string) => {
    // Exact match for the dashboard/base route.
    if (href === baseAdminPath) {
      return pathname === baseAdminPath;
    }
    // For all other routes, use startsWith.
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`bg-white border-l border-neutral-200 rtl:border-l-0 rtl:border-r rtl:border-neutral-200 flex-col fixed inset-y-0 hidden md:flex transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-center h-16 border-b border-neutral-200 px-4">
        <Link
          href={baseAdminPath}
          className="flex flex-col items-center leading-none"
        >
          {siteConfig.logo ? (
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={50}
              height={50}
              priority
            />
          ) : (
            <span
              className={`font-bold text-amber-500 transition-all duration-300 ${
                isCollapsed ? "text-2xl" : "text-3xl"
              }`}
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {isCollapsed ? siteConfig.name[0] : siteConfig.name}
            </span>
          )}
          {!isCollapsed && (
            <span className="text-xs text-primary-800 font-semibold tracking-wider">
              لوحة التحكم
            </span>
          )}
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isActive(item.href)
                    ? "bg-primary-100 text-primary-800 font-bold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const MobileSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const baseAdminPath = pathname.split("/").slice(0, 3).join("/");

  const navItems = [
    {
      id: "dashboard",
      label: "لوحة التحكم",
      icon: LayoutDashboard,
      href: baseAdminPath,
    },
    {
      id: "orders",
      label: "الطلبات",
      icon: ShoppingCart,
      href: `${baseAdminPath}/orders`,
    },
    {
      id: "products",
      label: "المنتجات",
      icon: Package,
      href: `${baseAdminPath}/products`,
    },
    {
      id: "categories",
      label: "الفئات",
      icon: Tag,
      href: `${baseAdminPath}/categories`,
    },
    {
      id: "sections",
      label: "الأقسام",
      icon: Layers,
      href: `${baseAdminPath}/sections`,
    },
  ];

  const isActive = (href: string) => {
    // Exact match for the dashboard/base route.
    if (href === baseAdminPath) {
      return pathname === baseAdminPath;
    }
    // For all other routes, use startsWith.
    return pathname.startsWith(href);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 md:hidden" dir="rtl">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="relative w-64 bg-white h-full flex flex-col">
            <div className="flex items-center justify-between h-16 border-b border-neutral-200 px-4">
              <Link
                href={baseAdminPath}
                className="flex flex-col items-start leading-none"
              >
                <span
                  className="text-3xl font-bold text-amber-500"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  Huyamy
                </span>
                <span className="text-xs text-green-800 font-semibold tracking-wider">
                  لوحة التحكم
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-primary-100 text-primary-800 font-bold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export { Sidebar, MobileSidebar };
