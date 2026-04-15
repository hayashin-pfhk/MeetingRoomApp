<?php

namespace App\Models;

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
}
