"use client";

import { useEffect, useReducer } from "react";
import { api } from "@/lib/api";
import { toTimeStr } from "@/lib/datetime";
import { Room, Staff } from "@/types";

export type ReservationFormData = {
  title: string;
  room_id: number;
  staff_ids: number[];
  start_time: string;
  end_time: string;
  memo: string;
};

export type ReservationInitialData = {
  title: string;
  roomId: string;
  staffIds: number[];
  startDate: string;
  startHour: string;
  startMin: string;
  endHour: string;
  endMin: string;
  memo: string;
};

export const TEMPLATES = [
  "社内MTG",
  "社外MTG(A社様)",
  "社外MTG(B社様)",
  "社外MTG(C社様)",
  "社外MTG(D社様)",
  "社外MTG(E社様)",
  "社外MTG(F社様)",
];

export const SUMMARY_OPTIONS = [
  "設計書レビュー",
  "コードレビュー",
  "計画表読み合わせ",
];

type State = {
  rooms: Room[];
  staffs: Staff[];
  template: string;
  title: string;
  roomId: string;
  staffIds: number[];
  startDate: string;
  startHour: string;
  startMin: string;
  endHour: string;
  endMin: string;
  memo: string;
  summary: string;
  initialized: boolean;
};

type Action =
  | { type: "SET_ROOMS"; rooms: Room[] }
  | { type: "SET_STAFFS"; staffs: Staff[] }
  | { type: "SET_TEMPLATE"; value: string }
  | { type: "SET_TITLE"; value: string }
  | { type: "SET_ROOM_ID"; value: string }
  | { type: "TOGGLE_STAFF"; id: number }
  | { type: "SET_START_DATE"; value: string }
  | { type: "SET_START_HOUR"; value: string }
  | { type: "SET_START_MIN"; value: string }
  | { type: "SET_END_HOUR"; value: string }
  | { type: "SET_END_MIN"; value: string }
  | { type: "ADD_TO_END"; minutes: number }
  | { type: "SET_MEMO"; value: string }
  | { type: "SET_SUMMARY"; value: string }
  | { type: "INITIALIZE"; data: ReservationInitialData };

const initialState: State = {
  rooms: [],
  staffs: [],
  template: "",
  title: "",
  roomId: "",
  staffIds: [],
  startDate: "",
  startHour: "",
  startMin: "",
  endHour: "",
  endMin: "",
  memo: "参加者：\n概要：",
  summary: "",
  initialized: false,
};

// メモ内の「参加者：」行を指定の名前で置換
function replaceParticipants(memo: string, names: string[]): string {
  return memo.replace(/参加者：.*/, `参加者：${names.join(", ")}`);
}

// メモ内の「概要：」行を指定の概要で置換
function replaceSummary(memo: string, summary: string): string {
  return memo.replace(/概要：.*/, `概要：${summary}`);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ROOMS":
      return { ...state, rooms: action.rooms };
    case "SET_STAFFS":
      return { ...state, staffs: action.staffs };
    case "SET_TEMPLATE":
      return { ...state, template: action.value, title: action.value };
    case "SET_TITLE":
      return { ...state, title: action.value };
    case "SET_ROOM_ID":
      return { ...state, roomId: action.value };
    case "TOGGLE_STAFF": {
      const nextIds = state.staffIds.includes(action.id)
        ? state.staffIds.filter((id) => id !== action.id)
        : [...state.staffIds, action.id];
      const names = state.staffs
        .filter((s) => nextIds.includes(s.id))
        .map((s) => s.name);
      return {
        ...state,
        staffIds: nextIds,
        memo: replaceParticipants(state.memo, names),
      };
    }
    case "SET_START_DATE":
      return { ...state, startDate: action.value };
    case "SET_START_HOUR":
      return { ...state, startHour: action.value };
    case "SET_START_MIN":
      return { ...state, startMin: action.value };
    case "SET_END_HOUR":
      return { ...state, endHour: action.value };
    case "SET_END_MIN":
      return { ...state, endMin: action.value };
    case "ADD_TO_END": {
      if (!state.startHour || !state.startMin) return state;
      const d = new Date(
        2000,
        0,
        1,
        Number(state.startHour),
        Number(state.startMin) + action.minutes
      );
      const [h, m] = toTimeStr(d).split(":");
      return { ...state, endHour: h, endMin: m };
    }
    case "SET_MEMO":
      return { ...state, memo: action.value };
    case "SET_SUMMARY":
      return {
        ...state,
        summary: action.value,
        memo: replaceSummary(state.memo, action.value),
      };
    case "INITIALIZE": {
      const { data } = action;
      const template = TEMPLATES.includes(data.title) ? data.title : "";
      const match = data.memo.match(/概要：(.+)/);
      const summary =
        match && SUMMARY_OPTIONS.includes(match[1]) ? match[1] : "";
      return {
        ...state,
        title: data.title,
        roomId: data.roomId,
        staffIds: data.staffIds,
        startDate: data.startDate,
        startHour: data.startHour,
        startMin: data.startMin,
        endHour: data.endHour,
        endMin: data.endMin,
        memo: data.memo,
        template,
        summary,
        initialized: true,
      };
    }
    default:
      return state;
  }
}

export function useReservationForm(initialData?: ReservationInitialData) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 会議室・スタッフ一覧の取得
  useEffect(() => {
    Promise.all([api.get<Room[]>("/rooms"), api.get<Staff[]>("/staffs")])
      .then(([rooms, staffs]) => {
        dispatch({ type: "SET_ROOMS", rooms });
        dispatch({ type: "SET_STAFFS", staffs });
      })
      .catch(() => {});
  }, []);

  // 編集時の初期値プリフィル（初回のみ）
  useEffect(() => {
    if (initialData && !state.initialized) {
      dispatch({ type: "INITIALIZE", data: initialData });
    }
  }, [initialData, state.initialized]);

  const getFormData = (): ReservationFormData => ({
    title: state.title,
    room_id: Number(state.roomId),
    staff_ids: state.staffIds,
    start_time: `${state.startDate}T${state.startHour.padStart(2, "0")}:${state.startMin.padStart(2, "0")}`,
    end_time: `${state.startDate}T${state.endHour.padStart(2, "0")}:${state.endMin.padStart(2, "0")}`,
    memo: state.memo,
  });

  return {
    rooms: state.rooms,
    staffs: state.staffs,
    template: state.template,
    title: state.title,
    roomId: state.roomId,
    staffIds: state.staffIds,
    startDate: state.startDate,
    startHour: state.startHour,
    startMin: state.startMin,
    endHour: state.endHour,
    endMin: state.endMin,
    memo: state.memo,
    summary: state.summary,
    setTemplate: (value: string) => dispatch({ type: "SET_TEMPLATE", value }),
    setTitle: (value: string) => dispatch({ type: "SET_TITLE", value }),
    setRoomId: (value: string) => dispatch({ type: "SET_ROOM_ID", value }),
    toggleStaff: (id: number) => dispatch({ type: "TOGGLE_STAFF", id }),
    setStartDate: (value: string) => dispatch({ type: "SET_START_DATE", value }),
    setStartHour: (value: string) => dispatch({ type: "SET_START_HOUR", value }),
    setStartMin: (value: string) => dispatch({ type: "SET_START_MIN", value }),
    setEndHour: (value: string) => dispatch({ type: "SET_END_HOUR", value }),
    setEndMin: (value: string) => dispatch({ type: "SET_END_MIN", value }),
    addToEnd: (minutes: number) => dispatch({ type: "ADD_TO_END", minutes }),
    setMemo: (value: string) => dispatch({ type: "SET_MEMO", value }),
    setSummary: (value: string) => dispatch({ type: "SET_SUMMARY", value }),
    getFormData,
  };
}
