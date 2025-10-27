<?php

namespace App\Http\Controllers\Web;

use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard');
    }
}
