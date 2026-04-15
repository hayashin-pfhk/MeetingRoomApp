<?php

use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\StaffController;
use Illuminate\Support\Facades\Route;

// ============================================================
// 注: `/staffs/availability` は `apiResource` の show ルート
// （`/staffs/{staff}`）より前に定義する必要がある。
// 後ろに置くと {staff} = "availability" として解釈され 404 になる。
// ============================================================

// ============================================================
// API Routes
// ------------------------------------------------------------
// ここに定義したルートは bootstrap/app.php の設定により
// 自動的に /api プレフィックスが付与される。
// ============================================================

// 疎通確認用
Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

// 会議室 CRUD
Route::apiResource('rooms', RoomController::class);

// スタッフ 空き状況（apiResource より前に定義すること）
Route::get('staffs/availability', [StaffController::class, 'availability']);

// スタッフ CRUD
Route::apiResource('staffs', StaffController::class);

// 予約 CRUD
Route::apiResource('reservations', ReservationController::class);
