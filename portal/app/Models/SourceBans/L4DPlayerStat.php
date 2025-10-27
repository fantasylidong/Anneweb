<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;

class L4DPlayerStat extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'players';

    protected $primaryKey = 'steamid';

    public $incrementing = false;

    public $timestamps = false;

    protected $guarded = [];
}
