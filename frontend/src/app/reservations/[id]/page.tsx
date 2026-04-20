"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Reservation } from "@/types";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get<Reservation>(`/reservations/${id}`)
      .then(setReservation)
      .catch(() => setReservation(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("この予約を削除しますか？")) return;
    setDeleting(true);
    try {
      await api.delete(`/reservations/${id}`);
      router.push("/reservations");
    } catch {
      alert("削除に失敗しました");
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">読み込み中...</p>;
  }

  if (!reservation) {
    return <p className="text-gray-500 dark:text-gray-400">予約が見つかりません</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">予約詳細</h1>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex">
          <dt className="w-24 text-gray-500 dark:text-gray-400">タイトル</dt>
          <dd>{reservation.title}</dd>
        </div>
        <div className="flex">
          <dt className="w-24 text-gray-500 dark:text-gray-400">会議室</dt>
          <dd>{reservation.room?.name ?? "-"}</dd>
        </div>
        <div className="flex">
          <dt className="w-24 text-gray-500 dark:text-gray-400">参加者</dt>
          <dd>{reservation.staffs.map((s) => s.name).join(", ") || "-"}</dd>
        </div>
        <div className="flex">
          <dt className="w-24 text-gray-500 dark:text-gray-400">開始</dt>
          <dd>{formatDateTime(reservation.start_time)}</dd>
        </div>
        <div className="flex">
          <dt className="w-24 text-gray-500 dark:text-gray-400">終了</dt>
          <dd>{formatDateTime(reservation.end_time)}</dd>
        </div>
        <div className="flex">
          <dt className="w-24 text-gray-500 dark:text-gray-400">メモ</dt>
          <dd className="whitespace-pre-wrap">{reservation.memo || "-"}</dd>
        </div>
      </dl>

      <div className="mt-6 flex gap-3">
        <Link
          href={`/reservations/${id}/edit`}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          編集
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 text-sm border border-red-400 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
        >
          {deleting ? "削除中..." : "削除"}
        </button>
      </div>

      <div className="mt-4">
        <Link
          href="/reservations"
          className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
        >
          ← 予約一覧に戻る
        </Link>
      </div>
    </div>
  );
}
