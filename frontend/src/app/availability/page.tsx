"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { todayStr, tomorrowStr, toTimeStr } from "@/lib/datetime";
import { Reservation, Staff } from "@/types";

const baseTimeSlots = [
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00",
];

function buildTimeSlots(reservations: Reservation[], date: string): string[] {
  const extra = new Set<string>();

  for (const r of reservations) {
    const rStart = new Date(r.start_time);
    const rEnd = new Date(r.end_time);

    // 30分刻みでスロットを生成
    const cursor = new Date(rStart);
    while (cursor < rEnd) {
      const slot = toTimeStr(cursor);
      if (!baseTimeSlots.includes(slot)) {
        extra.add(slot);
      }
      cursor.setMinutes(cursor.getMinutes() + 30);
    }
  }

  return [...baseTimeSlots, ...extra].sort();
}

function getBookingForSlot(slot: string, date: string, staffId: number, reservations: Reservation[]) {
  const slotStart = new Date(`${date}T${slot}:00`);
  const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

  return reservations.find((r) => {
    if (!r.staffs.some((s) => s.id === staffId)) return false;
    const rStart = new Date(r.start_time);
    const rEnd = new Date(r.end_time);
    return rStart < slotEnd && rEnd > slotStart;
  });
}

export default function AvailabilityPage() {
  const [date, setDate] = useState("");
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [staffSearch, setStaffSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    api
      .get<Staff[]>("/staffs")
      .then(setStaffs)
      .catch(() => setStaffs([]));
  }, []);

  const toggleStaff = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSearch = async () => {
    if (!date) return;
    setLoading(true);
    setSelectedIds([]);
    try {
      const all = await api.get<Reservation[]>("/reservations");
      const filtered = all.filter((r) => {
        const rDate = new Date(r.start_time).toISOString().split("T")[0];
        return rDate === date;
      });
      setReservations(filtered);
      setSearched(true);
    } catch {
      setReservations([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const selectedStaffs = staffs.filter((s) => selectedIds.includes(s.id));
  const timeSlots = buildTimeSlots(reservations, date);

  return (
    <div>
      <h1 className="text-2xl font-bold">空き状況確認</h1>

      <div className="mt-4 flex items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <label className="text-sm">日付</label>
            <button
              type="button"
              onClick={() => setDate(todayStr())}
              className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              今日
            </button>
            <button
              type="button"
              onClick={() => setDate(tomorrowStr())}
              className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              明日
            </button>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? "検索中..." : "検索"}
        </button>
      </div>

      {searched && (
        <div className="mt-6 flex gap-8">
          <div className="w-48 shrink-0 space-y-1">
            <p className="text-sm font-bold mb-2">スタッフ（複数選択可）</p>
            <input
              type="text"
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
              placeholder="氏名で検索"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 mb-2"
            />
            {staffs.filter((s) => s.name.includes(staffSearch)).map((staff) => (
              <label
                key={staff.id}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(staff.id)}
                  onChange={() => toggleStaff(staff.id)}
                />
                {staff.name}
              </label>
            ))}
          </div>

          {selectedStaffs.length > 0 && (
            <div className="flex-1 overflow-x-auto">
              <table className="text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="py-1 pr-2 text-left text-sm">名前</th>
                    {timeSlots.map((slot) => (
                      <th key={slot} className="px-1 py-1 font-normal text-gray-500 dark:text-gray-400">
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedStaffs.map((staff) => (
                    <tr key={staff.id}>
                      <td className="py-1 pr-2 text-sm whitespace-nowrap">{staff.name}</td>
                      {timeSlots.map((slot) => {
                        const booking = getBookingForSlot(slot, date, staff.id, reservations);
                        return (
                          <td key={slot} className="px-0.5 py-1">
                            <div
                              className={`w-10 h-6 rounded ${
                                booking
                                  ? "bg-red-400/80"
                                  : "bg-green-400/80"
                              }`}
                              title={booking ? `${booking.title}（${booking.room?.name ?? "-"}）` : "空き"}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded bg-green-400/80" /> 空き
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded bg-red-400/80" /> 予約あり
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
