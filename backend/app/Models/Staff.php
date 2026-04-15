<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * スタッフモデル
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Staff extends Model
{
    use HasFactory;

    /**
     * テーブル名を明示指定
     * （Laravel の複数形変換では Staff → staves となるため）
     */
    protected $table = 'staffs';

    /**
     * マスアサインメント許可カラム
     */
    protected $fillable = [
        'name',
    ];

    /**
     * このスタッフが参加する予約（多対多）
     */
    public function reservations(): BelongsToMany
    {
        return $this->belongsToMany(Reservation::class, 'reservation_staff');
    }
}
