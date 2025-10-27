<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Protest extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_protests';

    protected $primaryKey = 'pid';

    public $timestamps = false;

    protected $guarded = [];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'archivedby', 'aid');
    }
}
