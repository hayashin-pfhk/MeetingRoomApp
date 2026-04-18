"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

type Room = { id: number; name: string };
type Staff = { id: number; name: string; department: string | null };

const summaryOptions = [
  "設計書レビュー",
  "コードレビュー",
  "計画表読み合わせ",
];

const templates = [
  "社内MTG",
  "社外MTG(A社様)",
  "社外MTG(B社様)",
  "社外MTG(C社様)",
  "社外MTG(D社様)",
  "社外MTG(E社様)",
  "社外MTG(F社様)",
];


export default function NewReservationPage() {
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [template, setTemplate] = useState("");
  const [title, setTitle] = useState("");
  const [roomId, setRoomId] = useState("");
  const [staffIds, setStaffIds] = useState<number[]>([]);
  const [startDate, setStartDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMin, setStartMin] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMin, setEndMin] = useState("");
  const startMinRef = useRef<HTMLInputElement>(null);
  const endMinRef = useRef<HTMLInputElement>(null);
  const [memo, setMemo] = useState("参加者：\n概要：");
  const [summary, setSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data.data ?? data))
      .catch(() => setRooms([]));

    fetch(`${API}/staffs`)
      .then((res) => res.json())
      .then((data) => setStaffs(data.data ?? data))
      .catch(() => setStaffs([]));
  }, []);

  const updateMemoParticipants = (ids: number[]) => {
    const names = staffs
      .filter((s) => ids.includes(s.id))
      .map((s) => s.name)
      .join(", ");
    setMemo((prev) => prev.replace(/参加者：.*/, `参加者：${names}`));
  };

  const toggleStaff = (id: number) => {
    const next = staffIds.includes(id)
      ? staffIds.filter((s) => s !== id)
      : [...staffIds, id];
    setStaffIds(next);
    updateMemoParticipants(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          room_id: Number(roomId),
          staff_ids: staffIds,
          start_time: `${startDate}T${startHour.padStart(2, "0")}:${startMin.padStart(2, "0")}`,
          end_time: `${startDate}T${endHour.padStart(2, "0")}:${endMin.padStart(2, "0")}`,
          memo,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "作成に失敗しました");
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
      <div className="flex items-center gap-10">
        <h1 className="text-2xl font-bold">会議室予約</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-10">
        <div className="space-y-4 w-80">
        <div>
          <label className="block text-sm mb-1">テンプレート</label>
          <select
            value={template}
            onChange={(e) => {
              setTemplate(e.target.value);
              setTitle(e.target.value);
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          >
            <option value="">選択してください</option>
            {templates.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

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
          <div className="flex items-center gap-3 mb-1">
            <label className="text-sm">開始日</label>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setStartDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`);
              }}
              className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              今日
            </button>
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setStartDate(`${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`);
              }}
              className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              明日
            </button>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">開始時刻</label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="HH"
              value={startHour}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                setStartHour(v);
                if (v.length === 2) startMinRef.current?.focus();
              }}
              required
              className="w-12 px-2 py-2 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
            <span className="text-sm">:</span>
            <input
              ref={startMinRef}
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="MM"
              value={startMin}
              onChange={(e) => {
                setStartMin(e.target.value.replace(/\D/g, "").slice(0, 2));
              }}
              required
              className="w-12 px-2 py-2 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-1">
            <label className="text-sm">終了時刻</label>
            <button
              type="button"
              onClick={() => {
                if (!startHour || !startMin) return;
                const d = new Date(2000, 0, 1, Number(startHour), Number(startMin) + 30);
                setEndHour(String(d.getHours()).padStart(2, "0"));
                setEndMin(String(d.getMinutes()).padStart(2, "0"));
              }}
              className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              +30分
            </button>
            <button
              type="button"
              onClick={() => {
                if (!startHour || !startMin) return;
                const d = new Date(2000, 0, 1, Number(startHour) + 1, Number(startMin));
                setEndHour(String(d.getHours()).padStart(2, "0"));
                setEndMin(String(d.getMinutes()).padStart(2, "0"));
              }}
              className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              +1時間
            </button>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="HH"
              value={endHour}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                setEndHour(v);
                if (v.length === 2) endMinRef.current?.focus();
              }}
              required
              className="w-12 px-2 py-2 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
            <span className="text-sm">:</span>
            <input
              ref={endMinRef}
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="MM"
              value={endMin}
              onChange={(e) => {
                setEndMin(e.target.value.replace(/\D/g, "").slice(0, 2));
              }}
              required
              className="w-12 px-2 py-2 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        </div>

        <div className="space-y-4 w-80">
          <div>
            <label className="block text-sm mb-1">概要</label>
            <select
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setMemo((prev) =>
                  prev.replace(/概要：.*/, `概要：${e.target.value}`)
                );
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            >
              <option value="">選択してください</option>
              {summaryOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
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
        </div>

        <div className="w-60 space-y-3">
          <label className="block text-sm font-bold">参加者</label>
          {Object.entries(
            staffs.reduce<Record<string, Staff[]>>((groups, staff) => {
              const dept = staff.department ?? "未所属";
              (groups[dept] ??= []).push(staff);
              return groups;
            }, {})
          ).map(([dept, members]) => (
            <div key={dept}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{dept}</p>
              <div className="flex flex-wrap gap-2">
                {members.map((staff) => (
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
          ))}
        </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "作成中..." : "予約を作成"}
        </button>
      </form>
    </div>
  );
}
