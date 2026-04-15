<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * staffs.name にユニーク制約を追加
     * 同名スタッフの登録を防ぐ（同姓同名の場合はフルネームなどで区別する運用）
     */
    public function up(): void
    {
        Schema::table('staffs', function (Blueprint $table) {
            $table->unique('name');
        });
    }

    public function down(): void
    {
        Schema::table('staffs', function (Blueprint $table) {
            $table->dropUnique(['name']);
        });
    }
};
