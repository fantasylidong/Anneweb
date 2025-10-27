<?php

namespace App\Services\SourceBans;

use App\Models\SourceBans\Admin;
use App\Models\SourceBans\AdminRenewal;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class AdminExpiryService
{
    /**
     * 延长指定管理员的有效期。
     */
    public function extendByDays(Admin $admin, int $days, ?int $operatorId = null, ?string $note = null): AdminRenewal
    {
        if ($days <= 0) {
            throw new InvalidArgumentException('续费天数必须大于 0。');
        }

        return DB::connection($admin->getConnectionName())->transaction(function () use ($admin, $days, $operatorId, $note) {
            $baseDate = $admin->expires_at && $admin->expires_at->isFuture()
                ? $admin->expires_at->copy()
                : now();

            $newExpiry = $baseDate->addDays($days);

            $renewal = $admin->renewals()->create([
                'previous_expires_at' => $admin->expires_at,
                'new_expires_at' => $newExpiry,
                'extended_by' => $operatorId,
                'note' => $note,
            ]);

            $admin->forceFill([
                'expires_at' => $newExpiry,
            ])->save();

            return $renewal;
        });
    }

    /**
     * 将有效期直接设置到指定日期。
     */
    public function setExpiry(Admin $admin, CarbonInterface $expiresAt, ?int $operatorId = null, ?string $note = null): AdminRenewal
    {
        return DB::connection($admin->getConnectionName())->transaction(function () use ($admin, $expiresAt, $operatorId, $note) {
            $renewal = $admin->renewals()->create([
                'previous_expires_at' => $admin->expires_at,
                'new_expires_at' => $expiresAt,
                'extended_by' => $operatorId,
                'note' => $note,
            ]);

            $admin->forceFill([
                'expires_at' => $expiresAt,
            ])->save();

            return $renewal;
        });
    }
}
