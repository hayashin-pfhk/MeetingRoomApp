"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReservationForm, {
  ReservationFormData,
  ReservationInitialData,
} from "@/components/ReservationForm";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function EditReservationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [initialData, setInitialData] = useState<ReservationInitialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/reservations/${id}`)
      .then((r) => r.json())
      .then((resData) => {
        const reservation = resData.data ?? resData;
        const start = new Date(reservation.start_time);
        const end = new Date(reservation.end_time);
        const pad = (n: number) => String(n).padStart(2, "0");

        setInitialData({
          title: reservation.title ?? "",
          roomId: String(reservation.room?.id ?? ""),
          staffIds: reservation.staffs?.map((s: { id: number }) => s.id) ?? [],
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
      const res = await fetch(`${API}/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.message || "更新に失敗しました");
        setSubmitting(false);
        return;
      }

      router.push(`/reservations/${id}`);
    } catch {
      setError("更新に失敗しました");
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
