<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;

class Mod extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'sb_mods';

    protected $primaryKey = 'mid';

    public $timestamps = false;

    protected $guarded = [];
}
