"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Room = { id: number; name: string };

type Reservation = {
  id: number;
  title: string;
  memo: string | null;
  room: { id: number; name: string } | null;
  staffs: { id: number; name: string }[];
  start_time: string;
  end_time: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReservationsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<Room[]>("/rooms"),
      api.get<Reservation[]>("/reservations"),
    ])
      .then(([roomsData, resData]) => {
        setRooms(roomsData);
        setReservations(resData);
      })
      .catch(() => {
        setRooms([]);
        setReservations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedRoomId
    ? reservations.filter((r) => r.room?.id === selectedRoomId)
    : reservations;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  return (
    <div>
      <h1 className="text-2xl font-bold">予約一覧</h1>

      {loading ? (
        <p className="mt-4 text-gray-500 dark:text-gray-400">読み込み中...</p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-start gap-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`w-40 px-4 py-3 border rounded cursor-pointer ${
                  selectedRoomId === room.id
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                onClick={() =>
                  setSelectedRoomId(selectedRoomId === room.id ? null : room.id)
                }
              >
                <span
                  className={`text-sm ${
                    selectedRoomId === room.id
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-blue-600 dark:text-blue-400"
                  } hover:underline`}
                >
                  {room.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold">
              {selectedRoom ? `${selectedRoom.name} の予約` : "全予約"}
            </h2>

            {filtered.length === 0 ? (
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                予約がありません
              </p>
            ) : (
              <table className="mt-2 w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                    <th className="py-2 pr-2 w-44">タイトル</th>
                    <th className="py-2 pr-2 w-44">概要</th>
                    <th className="py-2 pr-2 w-20">会議室</th>
                    <th className="py-2 pr-2">参加者</th>
                    <th className="py-2 pr-2 w-16">日付</th>
                    <th className="py-2 pr-2 w-28">時間</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="py-2 pr-2">{r.title}</td>
                      <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">
                        {r.memo?.match(/概要：(.+)/)?.[1] ?? "-"}
                      </td>
                      <td className="py-2 pr-2">{r.room?.name ?? "-"}</td>
                      <td className="py-2 pr-2">
                        {r.staffs.map((s) => s.name).join(", ") || "-"}
                      </td>
                      <td className="py-2 pr-2">{formatDate(r.start_time)}</td>
                      <td className="py-2 pr-2">{formatTime(r.start_time)}〜{formatTime(r.end_time)}</td>
                      <td className="py-2">
                        <Link
                          href={`/reservations/${r.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
