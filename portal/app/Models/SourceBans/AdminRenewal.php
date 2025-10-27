<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminRenewal extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_admin_renewals';

    protected $guarded = [];

    protected $casts = [
        'previous_expires_at' => 'datetime',
        'new_expires_at' => 'datetime',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'aid');
    }
}
