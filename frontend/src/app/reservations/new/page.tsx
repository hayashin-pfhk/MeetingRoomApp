"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ReservationForm, { ReservationFormData } from "@/components/ReservationForm";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function NewReservationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: ReservationFormData) => {
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.message || "作成に失敗しました");
        setSubmitting(false);
        return;
      }

      router.push("/reservations");
    } catch {
      setError("作成に失敗しました");
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
