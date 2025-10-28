<?php

namespace App\Models\SourceBans;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $connection = 'sourcebans';

    protected $table = 'chat_log';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $guarded = [];

    protected $casts = [
        'date' => 'datetime',
    ];
}
