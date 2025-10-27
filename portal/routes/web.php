<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\BanController;
use App\Http\Controllers\Admin\CommController;
use App\Http\Controllers\Admin\DonationController as AdminDonationController;
use App\Http\Controllers\Admin\SubmissionController;
use App\Http\Controllers\Admin\ProtestController;
use App\Http\Controllers\Admin\ServerController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\SourceBans\AdminExpiryController;
use App\Http\Controllers\Web\AdminDashboardController;
use App\Http\Controllers\Web\BanListController;
use App\Http\Controllers\Web\BanProtestController;
use App\Http\Controllers\Web\BanSubmissionController;
use App\Http\Controllers\Web\CommListController;
use App\Http\Controllers\Web\DonationController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\L4DStatsController;
use App\Http\Controllers\Web\ServerIndexController;
use App\Models\SourceBans\Admin;
use App\Models\SourceBans\Ban;
use App\Models\SourceBans\Comm;
use Illuminate\Support\Facades\Route;

Route::model('admin', Admin::class);
Route::model('ban', Ban::class);
Route::model('comm', Comm::class);

Route::get('/', HomeController::class)->name('home');
Route::get('/bans', BanListController::class)->name('bans.index');
Route::get('/comms', CommListController::class)->name('comms.index');
Route::get('/servers', ServerIndexController::class)->name('servers.index');
Route::get('/submit', [BanSubmissionController::class, 'create'])->name('submit.create');
Route::post('/submit', [BanSubmissionController::class, 'store'])->name('submit.store');
Route::get('/protest', [BanProtestController::class, 'create'])->name('protest.create');
Route::post('/protest', [BanProtestController::class, 'store'])->name('protest.store');
Route::get('/donate', [DonationController::class, 'create'])->name('donate.create');
Route::post('/donate', [DonationController::class, 'store'])->name('donate.store');
Route::get('/stats/l4d2', L4DStatsController::class)->name('stats.l4d2');

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function (): void {
    Route::get('/admin', AdminDashboardController::class)->name('admin.dashboard');
    Route::get('/admin/admins', [AdminController::class, 'index'])->name('admin.admins.index');
    Route::get('/admin/admins/{admin}', [AdminController::class, 'show'])->name('admin.admins.show');
    Route::get('/admin/servers', [ServerController::class, 'index'])->name('admin.servers.index');
    Route::get('/admin/bans', [BanController::class, 'index'])->name('admin.bans.index');
    Route::get('/admin/bans/{ban}', [BanController::class, 'show'])->name('admin.bans.show');
    Route::post('/admin/bans/{ban}/unban', [BanController::class, 'unban'])->name('admin.bans.unban');
    Route::get('/admin/comms', [CommController::class, 'index'])->name('admin.comms.index');
    Route::get('/admin/comms/{comm}', [CommController::class, 'show'])->name('admin.comms.show');
    Route::post('/admin/comms/{comm}/lift', [CommController::class, 'lift'])->name('admin.comms.lift');
    Route::get('/admin/submissions', [SubmissionController::class, 'index'])->name('admin.submissions.index');
    Route::post('/admin/submissions/{submission}', [SubmissionController::class, 'update'])->name('admin.submissions.update');
    Route::get('/admin/protests', [ProtestController::class, 'index'])->name('admin.protests.index');
    Route::post('/admin/protests/{protest}', [ProtestController::class, 'update'])->name('admin.protests.update');
    Route::get('/admin/donations', [AdminDonationController::class, 'index'])->name('admin.donations.index');
    Route::post('/admin/donations/{donation}', [AdminDonationController::class, 'update'])->name('admin.donations.update');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::post('/api/sourcebans/admins/{admin}/extend', [AdminExpiryController::class, 'extend'])
        ->name('api.sourcebans.admins.extend');
});
