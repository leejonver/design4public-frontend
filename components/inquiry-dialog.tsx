"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = { label?: string };

export function InquiryDialog({ label = "프로젝트 문의하기" }: Props) {
  const tally = process.env.NEXT_PUBLIC_TALLY_INQUIRY_URL || "https://tally.so/r/w8Vj0L";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-sage-600 hover:bg-sage-700">{label}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>문의하기</DialogTitle>
        </DialogHeader>
        <div className="aspect-[16/10] w-full overflow-hidden rounded-md">
          <iframe src={tally} width="100%" height="100%" className="h-full w-full" title="문의 폼" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

