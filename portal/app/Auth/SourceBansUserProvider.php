<?php

namespace App\Auth;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Hashing\Hasher;

class SourceBansUserProvider extends EloquentUserProvider
{
    public function __construct(Hasher $hasher, string $model)
    {
        parent::__construct($hasher, $model);
    }

    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        $plain = (string) ($credentials['password'] ?? '');
        $hash = (string) $user->getAuthPassword();

        if ($hash === '') {
            return false;
        }

        $algo = password_get_info($hash)['algo'] ?? 0;
        if ($algo !== 0 && password_verify($plain, $hash)) {
            return true;
        }

        $salt = (string) config('sourcebans.auth_salt', '$5$');
        if ($salt !== '' && hash_equals((string) @crypt($plain, $salt), $hash)) {
            return true;
        }

        $legacySha1 = sha1(sha1('SourceBans' . $plain));
        if (hash_equals($legacySha1, $hash)) {
            return true;
        }

        return false;
    }

    public function updateRememberToken(Authenticatable $user, $token): void
    {
        // SourceBans 管理员表没有 remember_token 字段，保留空实现即可。
    }
}
