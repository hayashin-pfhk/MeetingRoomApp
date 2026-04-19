"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ReservationForm, { ReservationFormData } from "@/components/ReservationForm";
import { ApiError, api } from "@/lib/api";

export default function NewReservationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: ReservationFormData) => {
    setError("");
    setSubmitting(true);

    try {
      await api.post("/reservations", data);
      router.push("/reservations");
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "";
      setError(message || "作成に失敗しました");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">会議室予約</h1>
      <ReservationForm
        onSubmit={handleSubmit}
        submitLabel="予約を作成"
        submitting={submitting}
        error={error}
      />
    </div>
  );
}
