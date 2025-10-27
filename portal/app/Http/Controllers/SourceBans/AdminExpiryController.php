<?php

namespace App\Http\Controllers\SourceBans;

use App\Http\Requests\SourceBans\AdminExtendRequest;
use App\Models\SourceBans\Admin;
use App\Services\SourceBans\AdminExpiryService;
use Illuminate\Http\JsonResponse;

class AdminExpiryController
{
    public function __construct(private readonly AdminExpiryService $expiryService)
    {
    }

    public function extend(AdminExtendRequest $request, Admin $admin): JsonResponse
    {
        $validated = $request->validated();

        $renewal = $this->expiryService->extendByDays(
            admin: $admin,
            days: $validated['duration_days'],
            operatorId: $validated['operator_id'] ?? null,
            note: $validated['note'] ?? null,
        );

        return response()->json([
            'message' => '管理员有效期已延长',
            'admin' => [
                'aid' => $admin->aid,
                'user' => $admin->user,
                'expires_at' => optional($admin->expires_at)->toIso8601String(),
                'is_expired' => $admin->isExpired(),
                'remaining_days' => $admin->remainingDays(),
            ],
            'renewal' => [
                'id' => $renewal->id,
                'previous_expires_at' => optional($renewal->previous_expires_at)->toIso8601String(),
                'new_expires_at' => $renewal->new_expires_at->toIso8601String(),
                'note' => $renewal->note,
            ],
        ]);
    }
}
