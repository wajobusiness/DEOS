<?php

namespace App\Console\Commands;

use App\Jobs\ProcessBinaryDailyPairingJob;
use App\Models\AuditLog;
use App\Services\BinaryEngineService;
use Illuminate\Console\Command;

class RunBinaryDailyPairingCommand extends Command
{
    protected $signature = 'deos:binary-pairing {--async : Queue the calculation as a background job} {--limit=100000 : Global payout limit ceiling in EVO}';
    protected $description = 'Process daily binary matching volume and disburse 10% commission overrides to qualified members with solvency caps';

    public function handle(BinaryEngineService $binaryService): int
    {
        $this->info('Starting DEOS Binary Pairing Engine calculation...');

        if ($this->option('async')) {
            ProcessBinaryDailyPairingJob::dispatch();
            $this->info('Dispatched ProcessBinaryDailyPairingJob to queue.');
            return Command::SUCCESS;
        }

        $limit = (float) $this->option('limit');
        $result = $binaryService->calculateAllDailyPairings($limit);

        $this->table(
            ['Metric', 'Value'],
            [
                ['Members Matched', $result['members_matched']],
                ['Total Volume Matched', number_format($result['total_volume_matched'], 2) . ' BV'],
                ['Total Commissions Disbursed', '$' . number_format($result['total_disbursed'], 2) . ' EVO'],
            ]
        );

        AuditLog::create([
            'action' => 'Daily Binary Pairing Command',
            'actor_id' => '00000000-0000-0000-0000-000000000000',
            'actor_role' => 'SYSTEM_CLI',
            'impact_category' => 'Financial Engine',
            'details' => "CLI run processed {$result['members_matched']} members. Total Disbursed: \${$result['total_disbursed']} EVO",
        ]);

        $this->info('Binary pairing calculations finished successfully.');
        return Command::SUCCESS;
    }
}
