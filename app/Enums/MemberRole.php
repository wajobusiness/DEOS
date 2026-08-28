<?php

namespace App\Enums;

enum MemberRole: string
{
    case MEMBER = 'member';
    case ADMIN = 'admin';
    case SUPER_ADMIN = 'super_admin';
    case FINANCE = 'finance';
    case SUPPORT = 'support';

    public function isAdministrative(): bool
    {
        return in_array($this, [self::ADMIN, self::SUPER_ADMIN, self::FINANCE]);
    }
}
