// 予約メモのデフォルト初期値
export const DEFAULT_MEMO = "参加者：\n概要：";

// メモから「概要：」行の内容を抽出
export function extractSummary(memo: string | null | undefined): string | null {
  if (!memo) return null;
  return memo.match(/概要：(.+)/)?.[1] ?? null;
}

// メモ内の「参加者：」行を指定の名前で置換
export function replaceParticipants(memo: string, names: string[]): string {
  return memo.replace(/参加者：.*/, `参加者：${names.join(", ")}`);
}

// メモ内の「概要：」行を指定の概要で置換
export function replaceSummary(memo: string, summary: string): string {
  return memo.replace(/概要：.*/, `概要：${summary}`);
}
