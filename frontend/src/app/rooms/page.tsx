"use client";

import { Fragment, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Room } from "@/types";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchRooms = () => {
    api
      .get<Room[]>("/rooms")
      .then(setRooms)
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await api.post("/rooms", { name: newName.trim() }).catch(() => {});
    setNewName("");
    setShowForm(false);
    fetchRooms();
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    await api.put(`/rooms/${id}`, { name: editName.trim() }).catch(() => {});
    setEditId(null);
    setSelectedId(null);
    fetchRooms();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("この会議室を削除しますか？")) return;
    await api.delete(`/rooms/${id}`).catch(() => {});
    setSelectedId(null);
    fetchRooms();
  };

  return (
    <div>
      <div className="flex items-center gap-10">
        <h1 className="text-2xl font-bold">会議室作成</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          新規作成
        </button>
      </div>

      {showForm && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="会議室名"
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            追加
          </button>
          <button
            onClick={() => { setShowForm(false); setNewName(""); }}
            className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:underline"
          >
            キャンセル
          </button>
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-gray-500 dark:text-gray-400">読み込み中...</p>
      ) : rooms.length === 0 ? (
        <p className="mt-4 text-gray-500 dark:text-gray-400">会議室がありません</p>
      ) : (
        <div className="mt-4 flex flex-wrap items-start gap-3">
          {rooms.map((room, index) => (
            <Fragment key={room.id}>
              {index === 7 && <div className="w-full" />}
              <div
                className="w-40 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded"
            >
              {editId === room.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleUpdate(room.id)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => { setEditId(null); setSelectedId(null); }}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      戻る
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedId(selectedId === room.id ? null : room.id)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {room.name}
                  </button>
                  {selectedId === room.id && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => { setEditId(room.id); setEditName(room.name); }}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="px-3 py-1 text-sm border border-red-400 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        削除
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
