"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReservationForm, {
  ReservationFormData,
  ReservationInitialData,
} from "@/components/ReservationForm";
import { ApiError, api } from "@/lib/api";

type ReservationDetail = {
  title: string;
  start_time: string;
  end_time: string;
  memo: string | null;
  room: { id: number } | null;
  staffs: { id: number }[];
};

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
      .get<ReservationDetail>(`/reservations/${id}`)
      .then((reservation) => {
        const start = new Date(reservation.start_time);
        const end = new Date(reservation.end_time);
        const pad = (n: number) => String(n).padStart(2, "0");

        setInitialData({
          title: reservation.title ?? "",
          roomId: String(reservation.room?.id ?? ""),
          staffIds: reservation.staffs?.map((s) => s.id) ?? [],
          startDate: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
          startHour: pad(start.getHours()),
          startMin: pad(start.getMinutes()),
          endHour: pad(end.getHours()),
          endMin: pad(end.getMinutes()),
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
