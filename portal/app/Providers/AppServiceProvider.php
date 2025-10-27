<?php

namespace App\Providers;

use App\Auth\SourceBansUserProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Auth::provider('sourcebans', function ($app, array $config) {
            return new SourceBansUserProvider($app['hash'], $config['model']);
        });
    }
}
