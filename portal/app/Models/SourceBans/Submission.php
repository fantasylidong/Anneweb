<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_submissions';

    protected $primaryKey = 'subid';

    public $timestamps = false;

    protected $guarded = [];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'archivedby', 'aid');
    }
}
