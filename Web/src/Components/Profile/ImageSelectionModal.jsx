import { useRef, useState } from "react";
import { Upload, Trash2, X } from "lucide-react";

const ImageSelectionModal = ({
  isOpen,
  onClose,
  onUpload,
  onDelete,
  title,
  showDelete = false,
  type = "avatar",
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ store File object

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // save actual file
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result); // show preview
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onUpload(selectedFile); // send the File, not Base64
      setSelectedFile(null);
      setPreview(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!preview && (
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
        )}

        {preview && (
          <div className="flex flex-col items-center mb-6">
            {type === "avatar" ? (
              <div className="relative w-48 h-48 rounded-full overflow-hidden">
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-white rounded-full shadow-inner pointer-events-none"></div>
              </div>
            ) : (
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={preview}
                  alt="Cover preview"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!preview && showDelete && (
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
