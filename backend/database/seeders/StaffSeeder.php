<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Seeder;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $staffs = [
            '田中', '佐藤(花)', '佐藤(菜)', '鈴木', '高橋',
            '伊藤', '渡辺', '山本(大)', '山本(凛)', '中村',
            '小林', '加藤', '吉田', '山田', '佐々木',
            '松本', '井上', '木村', '林', '清水',
            '山口', '阿部', '森田', '池田', '橋本',
            '石川', '前田', '藤田', '後藤', '岡田',
            '村上', '近藤', '坂本', '遠藤', '青木',
            '藤井', '三浦', '岩崎', '福田', '原田',
        ];

        foreach ($staffs as $name) {
            Staff::firstOrCreate(['name' => $name]);
        }
    }
}
