<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * rooms.name にユニーク制約を追加
     * 同名の会議室が作成されるのを防ぐ
     */
    public function up(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->unique('name');
        });
    }

    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropUnique(['name']);
        });
    }
};
