<?php

use App\Http\Controllers\Api\RoomController;
use Illuminate\Support\Facades\Route;

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
