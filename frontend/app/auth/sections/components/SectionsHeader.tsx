'use client';

import axios from 'axios';
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import CreateSectionModal from "@/app/auth/sections/components/CreateSectionModal";
import { useState } from 'react';
import { createSection } from '@/services/section.api';

export default function SectionHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
    });

    const router = useRouter();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const teacherUserId = localStorage.getItem('user_id');

            if (!teacherUserId) {
                throw new Error('Teacher user id not found');
            }

            await createSection(teacherUserId, {
                code: formData.code,
                name: formData.name,
                description: formData.description,
            });

            setIsOpen(false);
            setFormData({
                code: '',
                name: '',
                description: '',
            });

            window.location.reload();
        } catch (error) {
            console.error('Create section failed:', error);

            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    'Create section failed';

                alert(message);
            } else if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Create section failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
                onClick={() => router.push('/auth/home')}
                className="cu flex cursor-pointer items-center gap-2 text-xl text-gray-700 transition hover:text-black"
            >
                <FiArrowLeft />
            </button>

            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-[#09637E] px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-[#085a70] cursor-pointer"
            >
                + Create Section
            </button>

            <CreateSectionModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}