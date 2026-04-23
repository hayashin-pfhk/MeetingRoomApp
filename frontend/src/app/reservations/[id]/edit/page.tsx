"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReservationForm from "@/components/ReservationForm";
import {
  ReservationFormData,
  ReservationInitialData,
} from "@/hooks/useReservationForm";
import { ApiError, api } from "@/lib/api";
import { splitDateTime } from "@/lib/datetime";
import { Reservation } from "@/types";

export default function EditReservationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [initialData, setInitialData] = useState<ReservationInitialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Reservation>(`/reservations/${id}`)
      .then((reservation) => {
        const start = splitDateTime(reservation.start_time);
        const end = splitDateTime(reservation.end_time);

        setInitialData({
          title: reservation.title ?? "",
          roomId: String(reservation.room?.id ?? ""),
          staffIds: reservation.staffs?.map((s) => s.id) ?? [],
          startDate: start.date,
          startHour: start.hour,
          startMin: start.min,
          endHour: end.hour,
          endMin: end.min,
          memo: reservation.memo ?? "参加者：\n概要：",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: ReservationFormData) => {
    setError("");
    setSubmitting(true);

    try {
      await api.put(`/reservations/${id}`, data);
      router.push(`/reservations/${id}`);
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "";
      setError(message || "更新に失敗しました");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">読み込み中...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">予約編集</h1>
      <ReservationForm
        initialData={initialData ?? undefined}
        onSubmit={handleSubmit}
        submitLabel="更新"
        submitting={submitting}
        error={error}
      />
    </div>
  );
}
