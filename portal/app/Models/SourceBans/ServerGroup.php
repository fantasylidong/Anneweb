<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;

class ServerGroup extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_srvgroups';

    public $timestamps = false;

    protected $guarded = [];
}
