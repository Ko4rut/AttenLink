"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";

interface FormData {
  code: string;
  name: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  loading?: boolean;
}

export default function CreateSectionModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  loading = false,
}: Props) {
  //  Close bằng ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  //  Handle change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //  Reset form khi đóng
  const handleClose = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose} // click outside
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // prevent close when click inside
      >
        {/* Header */}
        <div className="bg-[#09637E] text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create a new Section</h3>
          <button
            onClick={handleClose}
            className="hover:text-gray-400 cursor-pointer transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter section code"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#09637E]"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter section name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#09637E]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter a description"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#09637E]"
            />
          </div>

          {/* Button */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#09637E] cursor-pointer hover:bg-[#0e3e4c] text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Creating..." : "+ Create Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}