const NewsletterSection: React.FC = () => {
  return (
    <div className="bg-amber-50/70 py-16 sm:py-24">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          انضمي إلى قائمتنا البريدية
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          اشتركي الآن لتكوني أول من يعرف عن أحدث منتجاتنا، العروض الحصرية،
          ونصائح الجمال.
        </p>
        <form
          className="max-w-md mx-auto flex"
          //   onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="أدخلي بريدك الإلكتروني"
            className="w-full px-5 py-3 text-lg rounded-r-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-700 border-2 border-transparent"
            required
          />
          <button
            type="submit"
            className="bg-green-800 text-white font-bold px-6 py-3 rounded-l-full hover:bg-green-900 transition-all duration-300 whitespace-nowrap"
          >
            اشتراك
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSection;
