<?php

namespace App\Jobs;

use App\Models\AuditLog;
use App\Models\Member;
use App\Services\BinaryEngineService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessBinaryDailyPairingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;

    public function handle(BinaryEngineService $binaryService): void
    {
        Log::info('Initiating background ProcessBinaryDailyPairingJob...');

        $stats = $binaryService->calculateAllDailyPairings();

        AuditLog::create([
            'action' => 'Daily Binary Pairing Run',
            'actor_id' => '00000000-0000-0000-0000-000000000000',
            'actor_role' => 'SYSTEM_CRON',
            'impact_category' => 'Financial Engine',
            'details' => "Processed {$stats['members_matched']} members. Total Volume Matched: {$stats['total_volume_matched']} BV. Total Disbursed: \${$stats['total_disbursed']} EVO.",
        ]);

        Log::info("ProcessBinaryDailyPairingJob completed successfully. Matched: {$stats['members_matched']}, Disbursed: \${$stats['total_disbursed']} EVO");
    }
}
