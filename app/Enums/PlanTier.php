<?php

namespace App\Enums;

enum PlanTier: string
{
    case LAUNCH = 'launch';
    case GROWTH = 'growth';
    case LEGACY = 'legacy';

    public function price(): float
    {
        return match ($this) {
            self::LAUNCH => 49.00,
            self::GROWTH => 149.00,
            self::LEGACY => 299.00,
        };
    }

    public function directBonus(): float
    {
        return match ($this) {
            self::LAUNCH => 20.00,
            self::GROWTH => 60.00,
            self::LEGACY => 100.00,
        };
    }

    public function binaryVolume(): float
    {
        return match ($this) {
            self::LAUNCH => 50.00,
            self::GROWTH => 150.00,
            self::LEGACY => 300.00,
        };
    }
}
