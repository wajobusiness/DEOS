<?php

return [
    'name' => env('APP_NAME', 'DEOS Sovereign Business OS'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost:8000'),
    'base_domain' => env('BASE_DOMAIN', 'evionaecosystem.com'),
    'timezone' => 'UTC',
    'locale' => 'en',
    'fallback_locale' => 'en',
    'cipher' => 'AES-256-CBC',
    'key' => env('APP_KEY', 'base64:cGFzc3dvcmRmb3JkZW9zc2Fhc3N5c3RlbTIwMjYhISE='),
];
