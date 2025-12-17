"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InquiryForm } from "@/components/inquiry-form";
import { useState } from "react";

type Props = {
  label?: string;
  projectSlug?: string;
};

export function InquiryDialog({ label = "프로젝트 문의하기", projectSlug }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sage-600 hover:bg-sage-700 w-full">{label}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>문의하기</DialogTitle>
        </DialogHeader>
        <InquiryForm
          projectSlug={projectSlug}
          onSuccess={() => {
            // Keep dialog open to show success message
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
