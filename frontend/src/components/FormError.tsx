interface FormErrorProps {
  message?: string;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="relative inline-block group cursor-help">
      <span className="text-red-500 text-xl font-bold leading-none flex items-center justify-center w-6 h-6">!</span>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 hidden group-hover:block z-50">
        <div className="bg-gray-700 text-white text-sm px-4 py-2 rounded-md whitespace-normal max-w-xs shadow-lg break-words">
          {message}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
