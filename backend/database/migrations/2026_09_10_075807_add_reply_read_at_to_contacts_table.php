<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('contacts', 'reply_read_at')) {
            Schema::table('contacts', function (Blueprint $table) {
                $table->timestamp('reply_read_at')
                    ->nullable()
                    ->after('replied_at');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('contacts', 'reply_read_at')) {
            Schema::table('contacts', function (Blueprint $table) {
                $table->dropColumn('reply_read_at');
            });
        }
    }
};