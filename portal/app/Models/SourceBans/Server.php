<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Server extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_servers';

    protected $primaryKey = 'sid';

    public $timestamps = false;

    protected $guarded = [];

    public function mod(): BelongsTo
    {
        return $this->belongsTo(Mod::class, 'modid', 'mid');
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(ServerGroup::class, 'sb_servers_groups', 'server_id', 'group_id');
    }
}
