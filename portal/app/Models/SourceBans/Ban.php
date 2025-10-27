<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Ban extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_bans';

    protected $primaryKey = 'bid';

    public $timestamps = false;

    protected $guarded = [];

    protected $casts = [
        'created' => 'int',
        'ends' => 'int',
        'length' => 'int',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'aid', 'aid');
    }

    public function isPermanent(): bool
    {
        return (int) $this->length === 0;
    }

    public function createdAt(): ?Carbon
    {
        return $this->created ? Carbon::createFromTimestamp($this->created) : null;
    }

    public function endsAt(): ?Carbon
    {
        if ($this->isPermanent()) {
            return null;
        }

        return $this->ends ? Carbon::createFromTimestamp($this->ends) : null;
    }

    public function isExpired(): bool
    {
        if ($this->isPermanent()) {
            return false;
        }

        return $this->ends !== 0 && $this->ends < time();
    }
}
