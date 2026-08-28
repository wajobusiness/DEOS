<?php

namespace App\Services;

use App\Actions\Marketplace\ExecuteProductPurchaseAction;
use App\Models\MarketplaceOrder;
use App\Models\Member;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class MarketplaceService
{
    public function __construct(protected ExecuteProductPurchaseAction $purchaseAction) {}

    public function getProducts(?string $category = null): Collection
    {
        $query = Product::with('seller:id,name,member_code,avatar_url')->where('is_active', true);
        if ($category && $category !== 'All') {
            $query->where('category', $category);
        }
        return $query->orderBy('sales_count', 'desc')->get();
    }

    public function getProductBySlug(string $slug): Product
    {
        return Product::with('seller:id,name,member_code,avatar_url')
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function checkout(array $data, ?Member $buyer = null): MarketplaceOrder
    {
        $product = Product::findOrFail($data['product_id']);
        return $this->purchaseAction->execute($product, $data, $buyer);
    }
}
