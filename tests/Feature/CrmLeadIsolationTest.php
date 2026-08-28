<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\Member;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CrmLeadIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_can_only_see_their_own_leads(): void
    {
        $tenantA = Member::factory()->create();
        $tenantB = Member::factory()->create();

        Lead::create([
            'member_id' => $tenantA->id,
            'name' => 'Lead for Tenant A',
            'email' => 'leadA@client.com',
            'source' => 'Manual',
            'stage' => 'Lead In',
        ]);

        Lead::create([
            'member_id' => $tenantB->id,
            'name' => 'Lead for Tenant B',
            'email' => 'leadB@client.com',
            'source' => 'Manual',
            'stage' => 'Lead In',
        ]);

        Sanctum::actingAs($tenantA);

        $response = $this->getJson('/api/v1/crm/leads');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Lead for Tenant A', $data[0]['name']);
    }
}
