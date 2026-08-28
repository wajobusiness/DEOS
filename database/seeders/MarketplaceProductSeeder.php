<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MarketplaceProductSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Member::first();
        if (!$admin) return;

        $products = [
            [
                'title' => 'AI Prompts Mastery Kit — 10,000+ Production Prompts',
                'category' => 'AI & Prompts',
                'description' => 'Comprehensive enterprise prompt engineering library covering marketing, software architecture, sales funnels, and copywriting.',
                'price' => 49.00,
                'affiliate_commission_rate' => 0.40,
                'image_url' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
                'digital_file_url' => 'https://storage.evionaecosystem.com/downloads/ai-prompts-mastery.zip',
            ],
            [
                'title' => 'High-Ticket CRM Sales Funnel Templates',
                'category' => 'Templates',
                'description' => 'Ready-to-deploy high-converting sales funnel templates optimized for agency clients, coaches, and SaaS businesses.',
                'price' => 79.00,
                'affiliate_commission_rate' => 0.40,
                'image_url' => 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
                'digital_file_url' => 'https://storage.evionaecosystem.com/downloads/crm-sales-funnel-templates.zip',
            ],
            [
                'title' => 'DEOS SaaS Starter Boilerplate (Laravel 11 + React)',
                'category' => 'Software & Scripts',
                'description' => 'Production-ready fullstack SaaS architecture with double-entry wallet, multi-tenancy, and Redis queue workers.',
                'price' => 199.00,
                'affiliate_commission_rate' => 0.40,
                'image_url' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
                'digital_file_url' => 'https://storage.evionaecosystem.com/downloads/deos-saas-starter.zip',
            ],
        ];

        foreach ($products as $p) {
            Product::firstOrCreate(
                ['slug' => Str::slug($p['title'])],
                array_merge($p, ['seller_id' => $admin->id])
            );
        }
    }
}
