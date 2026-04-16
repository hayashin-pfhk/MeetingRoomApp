<?php

namespace Database\Seeders;

use App\Models\Reservation;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $reservations = [
            ['title' => '社内MTG',           'room_id' => 4,  'staff_ids' => [84, 87, 88],     'start' => '2026-04-17 10:00', 'end' => '2026-04-17 11:00', 'memo' => "参加者：田中, 鈴木, 高橋\n概要：設計書レビュー"],
            ['title' => '社外MTG(A社様)',     'room_id' => 5,  'staff_ids' => [85, 89],         'start' => '2026-04-17 13:00', 'end' => '2026-04-17 14:00', 'memo' => "参加者：佐藤(花), 渡辺\n概要：コードレビュー"],
            ['title' => '社内MTG',           'room_id' => 6,  'staff_ids' => [84, 86, 90],     'start' => '2026-04-17 15:00', 'end' => '2026-04-17 16:00', 'memo' => "参加者：田中, 佐藤(菜), 山本(凛)\n概要：計画表読み合わせ"],
            ['title' => '社外MTG(B社様)',     'room_id' => 7,  'staff_ids' => [91, 92],         'start' => '2026-04-17 11:00', 'end' => '2026-04-17 12:00', 'memo' => "参加者：中村, 小林\n概要：設計書レビュー"],
            ['title' => '社内MTG',           'room_id' => 8,  'staff_ids' => [93, 87],         'start' => '2026-04-17 14:00', 'end' => '2026-04-17 15:00', 'memo' => "参加者：加藤, 鈴木\n概要：コードレビュー"],
            ['title' => '社外MTG(C社様)',     'room_id' => 9,  'staff_ids' => [84, 88, 89],     'start' => '2026-04-18 10:00', 'end' => '2026-04-18 11:30', 'memo' => "参加者：田中, 伊藤, 渡辺\n概要：設計書レビュー"],
            ['title' => '社内MTG',           'room_id' => 10, 'staff_ids' => [85, 90],         'start' => '2026-04-18 13:00', 'end' => '2026-04-18 13:30', 'memo' => "参加者：佐藤(花), 山本(凛)\n概要：計画表読み合わせ"],
            ['title' => '社外MTG(D社様)',     'room_id' => 11, 'staff_ids' => [86, 91, 92],     'start' => '2026-04-18 15:00', 'end' => '2026-04-18 16:00', 'memo' => "参加者：佐藤(菜), 中村, 小林\n概要：コードレビュー"],
            ['title' => '社内MTG',           'room_id' => 12, 'staff_ids' => [93],             'start' => '2026-04-18 11:00', 'end' => '2026-04-18 12:00', 'memo' => "参加者：加藤\n概要：設計書レビュー"],
            ['title' => '社外MTG(E社様)',     'room_id' => 13, 'staff_ids' => [84, 85],         'start' => '2026-04-18 16:30', 'end' => '2026-04-18 17:30', 'memo' => "参加者：田中, 佐藤(花)\n概要：計画表読み合わせ"],
            ['title' => '社内MTG',           'room_id' => 4,  'staff_ids' => [87, 88, 93],     'start' => '2026-04-19 10:00', 'end' => '2026-04-19 10:30', 'memo' => "参加者：鈴木, 伊藤, 加藤\n概要：コードレビュー"],
            ['title' => '社外MTG(F社様)',     'room_id' => 5,  'staff_ids' => [89, 90],         'start' => '2026-04-19 14:00', 'end' => '2026-04-19 15:00', 'memo' => "参加者：渡辺, 山本(凛)\n概要：設計書レビュー"],
            ['title' => '社内MTG',           'room_id' => 6,  'staff_ids' => [86, 91],         'start' => '2026-04-19 11:00', 'end' => '2026-04-19 12:00', 'memo' => "参加者：佐藤(菜), 中村\n概要：計画表読み合わせ"],
            ['title' => '社外MTG(A社様)',     'room_id' => 7,  'staff_ids' => [84, 92],         'start' => '2026-04-19 16:00', 'end' => '2026-04-19 17:00', 'memo' => "参加者：田中, 小林\n概要：コードレビュー"],
            ['title' => '社内MTG',           'room_id' => 8,  'staff_ids' => [85, 86, 88],     'start' => '2026-04-19 13:00', 'end' => '2026-04-19 14:00', 'memo' => "参加者：佐藤(花), 佐藤(菜), 伊藤\n概要：設計書レビュー"],
        ];

        foreach ($reservations as $data) {
            $reservation = Reservation::create([
                'title'      => $data['title'],
                'room_id'    => $data['room_id'],
                'start_time' => $data['start'],
                'end_time'   => $data['end'],
                'memo'       => $data['memo'],
            ]);
            $reservation->staffs()->sync($data['staff_ids']);
        }
    }
}
