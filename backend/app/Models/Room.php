<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 会議室モデル
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Room extends Model
{
    use HasFactory;

    /**
     * マスアサインメント許可カラム
     */
    protected $fillable = [
        'name',
    ];

    /**
     * この会議室に紐づく予約
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
