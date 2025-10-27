<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_groups';

    protected $primaryKey = 'gid';

    public $timestamps = false;

    protected $guarded = [];
}
