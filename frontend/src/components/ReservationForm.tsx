"use client";

import { useRef } from "react";
import { todayStr, tomorrowStr } from "@/lib/datetime";
import {
  useReservationForm,
  TEMPLATES,
  SUMMARY_OPTIONS,
  ReservationFormData,
  ReservationInitialData,
} from "@/hooks/useReservationForm";
import { Staff } from "@/types";

type Props = {
  initialData?: ReservationInitialData;
  onSubmit: (data: ReservationFormData) => Promise<void>;
  submitLabel: string;
  submitting: boolean;
  error: string;
};

export default function ReservationForm({
  initialData,
  onSubmit,
  submitLabel,
  submitting,
  error,
}: Props) {
  const form = useReservationForm(initialData);
  const startMinRef = useRef<HTMLInputElement>(null);
  const endMinRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form.getFormData());
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-10">
        <div className="space-y-4 w-80">
          <div>
            <label className="block text-sm mb-1">テンプレート</label>
            <select
              value={form.template}
              onChange={(e) => form.setTemplate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            >
              <option value="">選択してください</option>
              {TEMPLATES.map((t) => (
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
              value={form.title}
              onChange={(e) => form.setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">会議室</label>
            <select
              value={form.roomId}
              onChange={(e) => form.setRoomId(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            >
              <option value="">選択してください</option>
              {form.rooms.map((room) => (
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
                onClick={() => form.setStartDate(todayStr())}
                className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                今日
              </button>
              <button
                type="button"
                onClick={() => form.setStartDate(tomorrowStr())}
                className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                明日
              </button>
            </div>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => form.setStartDate(e.target.value)}
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
                value={form.startHour}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                  form.setStartHour(v);
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
                value={form.startMin}
                onChange={(e) =>
                  form.setStartMin(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
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
                onClick={() => form.addToEnd(30)}
                className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                +30分
              </button>
              <button
                type="button"
                onClick={() => form.addToEnd(60)}
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
                value={form.endHour}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                  form.setEndHour(v);
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
                value={form.endMin}
                onChange={(e) =>
                  form.setEndMin(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
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
              value={form.summary}
              onChange={(e) => form.setSummary(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            >
              <option value="">選択してください</option>
              {SUMMARY_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">メモ</label>
            <textarea
              value={form.memo}
              onChange={(e) => form.setMemo(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        <div className="w-60 space-y-3">
          <label className="block text-sm font-bold">参加者</label>
          {Object.entries(
            form.staffs.reduce<Record<string, Staff[]>>((groups, staff) => {
              const dept = staff.department ?? "未所属";
              (groups[dept] ??= []).push(staff);
              return groups;
            }, {})
          ).map(([dept, members]) => (
            <div key={dept}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {dept}
              </p>
              <div className="flex flex-wrap gap-2">
                {members.map((staff) => (
                  <label
                    key={staff.id}
                    className="flex items-center gap-1 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.staffIds.includes(staff.id)}
                      onChange={() => form.toggleStaff(staff.id)}
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
        {submitting ? "処理中..." : submitLabel}
      </button>
    </form>
  );
}
