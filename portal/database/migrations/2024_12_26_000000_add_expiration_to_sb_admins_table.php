<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $connection = Schema::connection('sourcebans');

        if (! $connection->hasColumn('sb_admins', 'expires_at')) {
            $connection->table('sb_admins', function (Blueprint $table): void {
                $table->timestamp('expires_at')->nullable()->after('lastvisit')->comment('管理员有效期，为空表示永久');
            });
        }

        if (! $connection->hasTable('sb_admin_renewals')) {
            $connection->create('sb_admin_renewals', function (Blueprint $table): void {
                $table->bigIncrements('id');
                $table->unsignedInteger('admin_id');
                $table->timestamp('previous_expires_at')->nullable();
                $table->timestamp('new_expires_at');
                $table->unsignedBigInteger('extended_by')->nullable()->comment('操作源，例如后台用户 ID');
                $table->string('note', 255)->nullable();
                $table->timestampsTz();

                $table->index('admin_id');
            });
        }
    }

    public function down(): void
    {
        $connection = Schema::connection('sourcebans');

        if ($connection->hasTable('sb_admin_renewals')) {
            $connection->dropIfExists('sb_admin_renewals');
        }

        if ($connection->hasColumn('sb_admins', 'expires_at')) {
            $connection->table('sb_admins', function (Blueprint $table): void {
                $table->dropColumn('expires_at');
            });
        }
    }
};
