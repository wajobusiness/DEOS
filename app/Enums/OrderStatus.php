<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case REFUNDED = 'refunded';
    case DISPUTED = 'disputed';
    case CANCELLED = 'cancelled';
}
