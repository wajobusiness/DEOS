<?php

namespace App\Services;

use App\Actions\Wallet\CreditWalletAction;
use App\Enums\LedgerEventType;
use App\Models\Lead;
use App\Models\Member;
use App\Models\Webinar;
use App\Models\WebinarRegistration;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class WebinarService
{
    public function __construct(protected CreditWalletAction $creditAction) {}

    public function getWebinars(?string $category = null): Collection
    {
        $query = Webinar::with('organizer:id,name,member_code,avatar_url');
        if ($category && $category !== 'All') {
            $query->where('category', $category);
        }
        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getWebinarBySlug(string $slug): Webinar
    {
        return Webinar::with('organizer:id,name,member_code,avatar_url')
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function registerAttendee(Webinar $webinar, array $data, ?Member $attendeeMember = null): WebinarRegistration
    {
        $ticketNumber = 'TKT-' . strtoupper(Str::random(8));
        $price = $webinar->is_paid ? (float) $webinar->ticket_price : 0.00;

        $registration = WebinarRegistration::create([
            'webinar_id' => $webinar->id,
            'member_id' => $attendeeMember?->id,
            'ticket_number' => $ticketNumber,
            'attendee_name' => $data['attendee_name'],
            'attendee_email' => strtolower(trim($data['attendee_email'])),
            'attendee_phone' => $data['attendee_phone'] ?? null,
            'price_paid' => $price,
            'status' => 'confirmed',
            'qr_code_url' => "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" . urlencode($ticketNumber),
        ]);

        $webinar->increment('registered_count');

        // Automatically ingest attendee into organizer's CRM pipeline (Book 7 & Book 21)
        Lead::create([
            'member_id' => $webinar->organizer_id,
            'name' => $data['attendee_name'],
            'email' => strtolower(trim($data['attendee_email'])),
            'phone' => $data['attendee_phone'] ?? null,
            'source' => "Webinar: {$webinar->title}",
            'status' => 'New',
            'stage' => 'Lead In',
            'deal_value' => $price > 0 ? $price : null,
            'activity_log' => [
                [
                    'action' => 'Registered for Webinar',
                    'ticket' => $ticketNumber,
                    'timestamp' => now()->toIso8601String(),
                ]
            ]
        ]);

        // If paid webinar, credit organizer's wallet immediately
        if ($price > 0) {
            $organizer = Member::find($webinar->organizer_id);
            if ($organizer) {
                $this->creditAction->execute(
                    $organizer,
                    $price,
                    LedgerEventType::SELLER_PAYOUT,
                    "Ticket Pass Revenue: {$webinar->title} ({$ticketNumber})",
                    $ticketNumber
                );
            }
        }

        return $registration;
    }
}
