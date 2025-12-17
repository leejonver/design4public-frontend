"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

type Props = {
    projectSlug?: string;
    onSuccess?: () => void;
};

export function InquiryForm({ projectSlug, onSuccess }: Props) {
    const [formState, setFormState] = useState<FormState>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState("submitting");
        setErrorMessage("");

        try {
            const response = await fetch("/api/inquiry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    project_slug: projectSlug,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "문의 전송에 실패했습니다.");
            }

            setFormState("success");
            setFormData({
                name: "",
                email: "",
                phone: "",
                company: "",
                message: "",
            });
            onSuccess?.();
        } catch (error) {
            setFormState("error");
            setErrorMessage(error instanceof Error ? error.message : "문의 전송에 실패했습니다.");
        }
    };

    if (formState === "success") {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="w-12 h-12 text-sage-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">문의가 접수되었습니다</h3>
                <p className="text-muted-foreground mb-4">
                    빠른 시일 내에 답변 드리겠습니다.
                </p>
                <Button
                    variant="outline"
                    onClick={() => setFormState("idle")}
                >
                    새 문의 작성
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                        이름 <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="홍길동"
                        disabled={formState === "submitting"}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        이메일 <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="example@company.com"
                        disabled={formState === "submitting"}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                        연락처
                    </label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="010-0000-0000"
                        disabled={formState === "submitting"}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                        회사/기관명
                    </label>
                    <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="회사명"
                        disabled={formState === "submitting"}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                    문의 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="문의하실 내용을 자세히 적어주세요."
                    disabled={formState === "submitting"}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
            </div>

            {formState === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="bg-sage-600 hover:bg-sage-700 min-w-32"
                >
                    {formState === "submitting" ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            전송 중...
                        </>
                    ) : (
                        "문의하기"
                    )}
                </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
                문의 내용은 d4p@design4public.com으로 전송되며,<br />
                입력하신 연락처로 답변 드립니다.
            </p>
        </form>
    );
}
