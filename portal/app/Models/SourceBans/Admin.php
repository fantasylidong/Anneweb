<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_admins';

    protected $primaryKey = 'aid';

    public $timestamps = false;

    protected $guarded = [];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    protected $hidden = [
        'password',
        'srv_password',
    ];

    public function getRouteKeyName(): string
    {
        return 'aid';
    }

    public function getAuthIdentifierName(): string
    {
        return 'user';
    }

    /**
     * Scope: only administrators that are still within the active window.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where(function (Builder $scope): void {
            $scope->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now());
        });
    }

    public function renewals(): HasMany
    {
        return $this->hasMany(AdminRenewal::class, 'admin_id', 'aid')->orderByDesc('new_expires_at');
    }

    public function webGroup(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'gid', 'gid');
    }

    public function serverAssignments(): HasMany
    {
        return $this->hasMany(AdminServerGroup::class, 'admin_id', 'aid')->with(['server', 'serverGroup']);
    }

    public function bans(): HasMany
    {
        return $this->hasMany(Ban::class, 'aid', 'aid');
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function remainingDays(): ?int
    {
        return $this->expires_at ? now()->diffInDays($this->expires_at, false) : null;
    }
}
