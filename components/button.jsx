//button.tsx
export default function Button({ children, variant = "primary", onClick }) {
  const styles = "px-4 py-2 rounded-md font-medium transition-all";
  const variants = {
    primary: "bg-[#6766FC] text-white hover:bg-[#6766FC] w-30",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    tertiary: "bg-red-500 text-white hover:bg-red-600",
  };

  // const handleClick =()=>{}

  return (
    <button onClick={onClick} className={`${styles} ${variants[variant]}`}>
      {children}
    </button>
  );
}
