<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')
                ->constrained('rooms')
                ->cascadeOnDelete()
                ->comment('会議室ID');
            $table->string('title')->comment('予約タイトル');
            $table->dateTime('start_time')->comment('開始日時');
            $table->dateTime('end_time')->comment('終了日時');
            $table->timestamps();

            // 会議室×開始時刻での検索を高速化（重複チェック・一覧表示で多用）
            $table->index(['room_id', 'start_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
