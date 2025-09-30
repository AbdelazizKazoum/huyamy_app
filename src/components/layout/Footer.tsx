const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 text-neutral-800 border-t border-neutral-200">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
          <div className="md:col-span-1">
            <a href="#" className="flex flex-col items-start leading-none">
              <span
                className="text-4xl font-bold text-secondary-500"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                Huyamy
              </span>
              <span className="text-sm text-neutral-600 font-semibold -mt-1 tracking-wider">
                Coopérative
              </span>
            </a>
            <p className="text-neutral-600 mt-4">
              متجرك الأول لمنتجات التجميل الطبيعية والعناية بالبشرة. نؤمن بقوة
              الطبيعة لتعزيز جمالك.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-800">
              خدمة العملاء
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  عن المتجر
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  الشحن والتسليم
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  تواصل معنا
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-800">
              معلومات هامة
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  الأسئلة المتكررة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  ثقة و ضمان
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  شروط الاستخدام
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-primary-800 transition-colors"
                >
                  سياسة الخصوصية
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-300 mt-12 pt-8 text-center text-neutral-500">
          <p className="mb-4">
            &copy; {new Date().getFullYear()} Huyamy. جميع الحقوق محفوظة.
          </p>
          <div className="flex justify-center space-x-6 rtl:space-x-reverse">
            <a
              href="#"
              aria-label="Facebook"
              className="text-neutral-500 hover:text-primary-800 transition-transform hover:scale-110"
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-neutral-500 hover:text-primary-800 transition-transform hover:scale-110"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
