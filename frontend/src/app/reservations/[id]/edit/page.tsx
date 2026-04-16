"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

type Room = { id: number; name: string };
type Staff = { id: number; name: string };

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditReservationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [title, setTitle] = useState("");
  const [roomId, setRoomId] = useState("");
  const [staffIds, setStaffIds] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API}/rooms`).then((r) => r.json()),
      fetch(`${API}/staffs`).then((r) => r.json()),
      fetch(`${API}/reservations/${id}`).then((r) => r.json()),
    ])
      .then(([roomsData, staffsData, resData]) => {
        setRooms(roomsData.data ?? roomsData);
        setStaffs(staffsData.data ?? staffsData);
        const reservation = resData.data ?? resData;
        setTitle(reservation.title ?? "");
        setRoomId(String(reservation.room?.id ?? ""));
        setStaffIds(reservation.staffs?.map((s: Staff) => s.id) ?? []);
        setStartTime(reservation.start_time ? toLocalInput(reservation.start_time) : "");
        setEndTime(reservation.end_time ? toLocalInput(reservation.end_time) : "");
        setMemo(reservation.memo ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const toggleStaff = (staffId: number) => {
    setStaffIds((prev) =>
      prev.includes(staffId) ? prev.filter((s) => s !== staffId) : [...prev, staffId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API}/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          room_id: Number(roomId),
          staff_ids: staffIds,
          start_time: startTime,
          end_time: endTime,
          memo,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "更新に失敗しました");
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

      <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-1">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">会議室</label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          >
            <option value="">選択してください</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">参加者</label>
          <div className="flex flex-wrap gap-2">
            {staffs.map((staff) => (
              <label key={staff.id} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={staffIds.includes(staff.id)}
                  onChange={() => toggleStaff(staff.id)}
                />
                {staff.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">開始日時</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">終了日時</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">メモ</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {submitting ? "更新中..." : "更新"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/reservations/${id}`)}
            className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:underline"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
