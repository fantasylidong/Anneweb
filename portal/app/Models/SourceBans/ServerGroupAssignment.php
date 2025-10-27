<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServerGroupAssignment extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_servers_groups';

    public $timestamps = false;

    protected $primaryKey = null;

    public $incrementing = false;

    protected $guarded = [];

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class, 'server_id', 'sid');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(ServerGroup::class, 'group_id', 'id');
    }
}
