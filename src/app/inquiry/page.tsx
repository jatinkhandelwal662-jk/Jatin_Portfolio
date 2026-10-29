import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry/InquiryForm";

export const metadata: Metadata = {
  title: "Start a Conversation — Jatin Khandelwal",
  description:
    "Tell Jatin about your project, opportunity, or collaboration idea.",
};

export default function InquiryPage() {
  return <InquiryForm />;
}
