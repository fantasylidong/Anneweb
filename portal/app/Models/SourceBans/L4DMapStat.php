<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;

class L4DMapStat extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'maps';

    protected $primaryKey = 'name';

    public $incrementing = false;

    public $timestamps = false;

    protected $guarded = [];
}
