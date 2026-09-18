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
            self::LAUNCH => 100.00,
            self::GROWTH => 300.00,
            self::LEGACY => 500.00,
        };
    }

    public function directBonus(): float
    {
        return match ($this) {
            self::LAUNCH => 25.00,
            self::GROWTH => 75.00,
            self::LEGACY => 125.00,
        };
    }

    public function binaryVolume(): float
    {
        return match ($this) {
            self::LAUNCH => 100.00,
            self::GROWTH => 300.00,
            self::LEGACY => 500.00,
        };
    }

    public function dailyBinaryCap(): float
    {
        return match ($this) {
            self::LAUNCH => 200.00,
            self::GROWTH => 600.00,
            self::LEGACY => 1500.00,
        };
    }
}
