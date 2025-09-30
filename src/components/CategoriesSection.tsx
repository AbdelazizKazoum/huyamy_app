import { Category, Language } from "@/types";
import SectionTitle from "./SectionTitle";
import Image from "next/image";

interface CategoriesSectionProps {
  categories: Category[];
  lang?: Language;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  lang = "ar",
}) => {
  return (
    <div className="bg-white pt-16 sm:pt-24 pb-16 sm:pb-24">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>تصفح حسب الفئة</SectionTitle>
        <p className="text-center text-neutral-600 max-w-2xl mx-auto -mt-12 mb-12">
          اكتشفي مجموعاتنا المتنوعة التي تلبي كل احتياجات جمالك.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
          {categories.map((category) => (
            <a
              href={`/collections/${category.name.fr
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              key={category.id}
              className="group text-center transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4">
                <Image
                  src={category.image}
                  alt={category.name[lang || "ar"]}
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-cover rounded-full border-2 border-neutral-200 group-hover:border-primary-700 transition-all duration-300 shadow-sm"
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-md font-semibold text-neutral-800 group-hover:text-primary-800 transition-colors duration-300">
                {category.name[lang || "ar"]}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
