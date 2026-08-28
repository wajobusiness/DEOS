<?php

namespace App\Enums;

enum WebinarType: string
{
    case FREE_LIVE = 'free_live';
    case PAID_LIVE = 'paid_live';
    case FREE_EVERGREEN = 'free_evergreen';
    case PAID_EVERGREEN = 'paid_evergreen';
    case PRODUCT_DEMO = 'product_demo';
    case RECRUITMENT = 'recruitment';
    case TRAINING = 'training';
    case MASTERCLASS = 'masterclass';
}
