interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  return (
    <div className="text-center mb-16">
      <h2
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 inline-block relative"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        {children}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-green-700 rounded-full"></span>
      </h2>
    </div>
  );
};

export default SectionTitle;
