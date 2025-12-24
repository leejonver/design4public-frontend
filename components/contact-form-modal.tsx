"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ContactFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create mailto link with form data
        const subject = encodeURIComponent(`[문의] ${formData.name}님의 문의`);
        const body = encodeURIComponent(
            `이름: ${formData.name}\n연락처: ${formData.phone}\n이메일: ${formData.email}\n\n문의내용:\n${formData.message}`
        );

        window.location.href = `mailto:d4p@design4public.com?subject=${subject}&body=${body}`;

        setIsSubmitting(false);
        setSubmitted(true);

        // Reset form after a delay
        setTimeout(() => {
            setFormData({ name: "", phone: "", email: "", message: "" });
            setSubmitted(false);
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-900">문의하기</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors rounded-md hover:bg-neutral-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {submitted ? (
                        <div className="py-8 text-center">
                            <p className="text-sage-700 font-medium">이메일 앱이 열렸습니다!</p>
                            <p className="mt-2 text-sm text-neutral-500">
                                이메일을 전송해 주세요.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    이름 <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="홍길동"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    연락처 <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="010-1234-5678"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    이메일 <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    문의내용 <span className="text-destructive">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="문의하실 내용을 입력해 주세요."
                                    rows={4}
                                    className={cn(
                                        "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm",
                                        "placeholder:text-neutral-400",
                                        "focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent",
                                        "resize-none"
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                            >
                                {isSubmitting ? "전송 중..." : "문의 보내기"}
                            </Button>

                            <p className="text-xs text-neutral-500 text-center">
                                문의 내용은 d4p@design4public.com 으로 전송됩니다.
                            </p>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
