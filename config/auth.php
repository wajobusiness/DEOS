<?php

return [
    'defaults' => [
        'guard' => 'sanctum',
        'passwords' => 'members',
    ],
    'guards' => [
        'sanctum' => [
            'driver' => 'sanctum',
            'provider' => 'members',
        ],
    ],
    'providers' => [
        'members' => [
            'driver' => 'eloquent',
            'model' => App\Models\Member::class,
        ],
    ],
];
