'use client';

import { FiArrowLeft, FiX } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import CreateSectionModal from "@/app/auth/sections/components/CreateSectionModal"
import { useState } from 'react';

export default function SectionHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
    });


    // const user = { image: '/path/to/your-avatar.jpg' }; // → thay bằng real user sau



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Gọi API để tạo section mới
        console.log('Creating section:', formData);
        // Sau khi tạo thành công → đóng modal + refresh danh sách
        setIsOpen(false);
        // setFormData({ code: '', name: '', description: '' }); // reset nếu cần
    };

    const router = useRouter();
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <button
                onClick={() => router.push('/auth/home')}
                className="flex items-center gap-2 cu text-gray-700 hover:text-black cursor-pointer text-xl transition"
            >
                <FiArrowLeft />
            </button>

            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#09637E] hover:bg-[#085a70] cursor-pointer text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md flex items-center gap-2"
            >
                + Create Section
            </button>

            {/* Modal Create Section */}
            <CreateSectionModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    )

}