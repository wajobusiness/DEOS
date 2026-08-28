<?php

if (!function_exists('mb_split')) {
    function mb_split(string $pattern, string $string, int $limit = -1): array|false {
        $result = @preg_split('/' . $pattern . '/u', $string, $limit);
        return $result !== false ? $result : preg_split('/' . preg_quote($pattern, '/') . '/', $string, $limit);
    }
}

namespace Illuminate\Support {
    if (!function_exists('Illuminate\Support\mb_split')) {
        function mb_split(string $pattern, string $string, int $limit = -1): array|false {
            $result = @preg_split('/' . $pattern . '/u', $string, $limit);
            return $result !== false ? $result : preg_split('/' . preg_quote($pattern, '/') . '/', $string, $limit);
        }
    }
}
