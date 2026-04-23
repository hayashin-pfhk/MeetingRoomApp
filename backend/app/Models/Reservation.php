<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * 予約モデル
 *
 * @property int $id
 * @property int $room_id
 * @property string $title
 * @property \Illuminate\Support\Carbon $start_time
 * @property \Illuminate\Support\Carbon $end_time
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Reservation extends Model
{
    use HasFactory;

    /**
     * マスアサインメント許可カラム
     */
    protected $fillable = [
        'room_id',
        'title',
        'start_time',
        'end_time',
        'memo',
    ];

    /**
     * 属性の型変換
     */
    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
    ];

    /**
     * 予約対象の会議室
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * この予約に参加するスタッフ（多対多）
     */
    public function staffs(): BelongsToMany
    {
        return $this->belongsToMany(Staff::class, 'reservation_staff');
    }

    /**
     * 指定時間帯と重複する予約に絞り込む Query Scope
     *
     * 重複判定は パターンB（end_time 排他）:
     *   既存.start_time < 新規.end_time AND 既存.end_time > 新規.start_time
     *
     * @param Builder $query
     * @param string $startTime 判定対象の開始時刻
     * @param string $endTime   判定対象の終了時刻
     * @param int|null $excludeId 除外する予約 ID（更新時の自己除外用）
     */
    public function scopeOverlapping(Builder $query, string $startTime, string $endTime, ?int $excludeId = null): void
    {
        $query->where('start_time', '<', $endTime)
              ->where('end_time', '>', $startTime);

        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }
    }
}
