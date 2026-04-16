<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            '東京会議室',
            '大阪会議室',
            'エリアA',
            'エリアB',
            'エリアC',
            'エリアD',
            'エリアE',
            'エリアF',
            'エリアF(左)',
            'エリアF(右)',
        ];

        foreach ($rooms as $name) {
            Room::firstOrCreate(['name' => $name]);
        }
    }
}
