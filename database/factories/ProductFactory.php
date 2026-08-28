<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);
        return [
            'slug' => Str::slug($title) . '-' . Str::random(4),
            'title' => $title,
            'category' => 'Software & Scripts',
            'description' => fake()->paragraph(),
            'price' => 49.00,
            'affiliate_commission_rate' => 0.40,
            'seller_id' => Member::factory(),
            'image_url' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
            'is_active' => true,
        ];
    }
}
