<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminServerGroup extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_admins_servers_groups';

    public $timestamps = false;

    protected $primaryKey = null;

    public $incrementing = false;

    protected $guarded = [];

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class, 'server_id', 'sid');
    }

    public function serverGroup(): BelongsTo
    {
        return $this->belongsTo(ServerGroup::class, 'srv_group_id', 'id');
    }
}
