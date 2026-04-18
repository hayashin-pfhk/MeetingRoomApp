<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Seeder;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $staffs = [
            // 役員
            ['name' => '田中',      'department' => '役員'],
            ['name' => '佐藤(花)',  'department' => '役員'],
            ['name' => '佐藤(菜)',  'department' => '役員'],
            // 窓口担当
            ['name' => '鈴木',      'department' => '窓口担当'],
            ['name' => '高橋',      'department' => '窓口担当'],
            ['name' => '伊藤',      'department' => '窓口担当'],
            ['name' => '渡辺',      'department' => '窓口担当'],
            ['name' => '山本(大)',  'department' => '窓口担当'],
            ['name' => '山本(凛)',  'department' => '窓口担当'],
            ['name' => '中村',      'department' => '窓口担当'],
            ['name' => '小林',      'department' => '窓口担当'],
            ['name' => '加藤',      'department' => '窓口担当'],
            ['name' => '吉田',      'department' => '窓口担当'],
            ['name' => '山田',      'department' => '窓口担当'],
            ['name' => '佐々木',    'department' => '窓口担当'],
            ['name' => '松本',      'department' => '窓口担当'],
            ['name' => '井上',      'department' => '窓口担当'],
            ['name' => '木村',      'department' => '窓口担当'],
            ['name' => '林',        'department' => '窓口担当'],
            ['name' => '清水',      'department' => '窓口担当'],
            ['name' => '山口',      'department' => '窓口担当'],
            ['name' => '阿部',      'department' => '窓口担当'],
            ['name' => '森田',      'department' => '窓口担当'],
            // C#
            ['name' => '池田',      'department' => 'C#'],
            ['name' => '橋本',      'department' => 'C#'],
            ['name' => '石川',      'department' => 'C#'],
            ['name' => '前田',      'department' => 'C#'],
            ['name' => '藤田',      'department' => 'C#'],
            ['name' => '後藤',      'department' => 'C#'],
            ['name' => '岡田',      'department' => 'C#'],
            ['name' => '村上',      'department' => 'C#'],
            ['name' => '近藤',      'department' => 'C#'],
            ['name' => '坂本',      'department' => 'C#'],
            ['name' => '遠藤',      'department' => 'C#'],
            ['name' => '青木',      'department' => 'C#'],
            // PHP
            ['name' => '藤井',      'department' => 'PHP'],
            ['name' => '三浦',      'department' => 'PHP'],
            ['name' => '岩崎',      'department' => 'PHP'],
            ['name' => '福田',      'department' => 'PHP'],
            ['name' => '原田',      'department' => 'PHP'],
        ];

        foreach ($staffs as $data) {
            Staff::updateOrCreate(
                ['name' => $data['name']],
                ['department' => $data['department']]
            );
        }
    }
}
