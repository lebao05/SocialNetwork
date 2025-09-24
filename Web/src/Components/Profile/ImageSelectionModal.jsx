import { useRef } from "react";
import { Upload, Trash2, X } from "lucide-react";

const ImageSelectionModal = ({
  isOpen,
  onClose,
  onSelectImage,
  onUpload,
  onDelete,
  title,
  showDelete = false,
}) => {
  const fileInputRef = useRef(null);
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpload(e.target.result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleImages = [
    "https://images.unsplash.com/photo-1494790108755-2616c6f027e4?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Upload className="h-5 w-5" />
            Upload from device
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <h3 className="text-lg font-medium mb-3">Choose from gallery</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {sampleImages.map((img, i) => (
            <div
              key={i}
              onClick={() => {
                onSelectImage(img);
                onClose();
              }}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            >
              <img
                src={img}
                alt={`Sample ${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {showDelete && (
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full p-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2"
          >
            <Trash2 className="h-5 w-5" />
            Delete current picture
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageSelectionModal;
