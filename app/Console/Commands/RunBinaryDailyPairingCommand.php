<?php

namespace App\Console\Commands;

use App\Models\Member;
use App\Services\BinaryEngineService;
use Illuminate\Console\Command;

class RunBinaryDailyPairingCommand extends Command
{
    protected $signature = 'deos:binary-pairing';
    protected $description = 'Process daily binary matching volume and disburse 10% commission overrides to qualified members';

    public function handle(BinaryEngineService $binaryService): int
    {
        $this->info('Starting DEOS Daily Binary Pairing calculation...');

        $activeMembers = Member::where('status', 'active')
            ->where(function ($q) {
                $q->where('binary_left_volume', '>', 0)
                  ->where('binary_right_volume', '>', 0);
            })
            ->get();

        $processed = 0;
        $totalPaid = 0.0;

        foreach ($activeMembers as $member) {
            $result = $binaryService->calculatePairing($member);
            if ($result) {
                $processed++;
                $totalPaid += $result['bonus_amount'];
                $this->line("  [✓] {$member->name} ({$member->member_code}): Matched {$result['matched_volume']} BV -> Paid \${$result['bonus_amount']}");
            }
        }

        $this->info("Completed: Processed {$processed} binary commissions. Total Distributed: \${$totalPaid} EVO");

        return Command::SUCCESS;
    }
}
