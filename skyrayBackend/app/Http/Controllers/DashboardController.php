<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quotation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Quotation Counts
        $totalQuotations = Quotation::count();
        $pendingQuotations = Quotation::where('status', 'pending')->count();
        $approvedQuotations = Quotation::where('status', 'approved')->count();
        $rejectedQuotations = Quotation::where('status', 'rejected')->count();

        // 2. Total Customers
        $totalCustomers = User::count();

        // 3. Total Revenue (Sum of 'prices' from approved quotations)
        // Since 'prices' is a JSON column, we'll fetch all approved quotations and sum it up in PHP
        // Assumption: 'prices' is a keyed array like {'item1': 100, 'item2': 200} or similar structure where values are numeric.
        // Based on previous knowledge, it might be a simple key-value pair of prices.
        $approvedQuotationModels = Quotation::where('status', 'approved')->get();
        $totalRevenue = 0;

        foreach ($approvedQuotationModels as $quotation) {
            if ($quotation->prices && is_array($quotation->prices)) {
                // Sum all values in the prices array
                // We cast values to float/int to be safe
                foreach ($quotation->prices as $price) {
                    $totalRevenue += (float) $price;
                }
            }
        }

        // 4. Recent Quotations (formatted for frontend)
        $recentQuotations = Quotation::latest()
            ->take(5)
            ->get()
            ->map(function ($q) {
                $amount = 0;
                if ($q->prices && is_array($q->prices)) {
                    foreach ($q->prices as $price) {
                        $amount += (float) $price;
                    }
                }
                
                // Determine service name from item_details if possible, typically item_details is JSON.
                // We'll just take the first key or value as a 'Service' placeholder or join them.
                // Let's assume item_details keys act as service names or items.
                $service = 'N/A';
                if ($q->item_details && is_array($q->item_details)) {
                    // Just taking the first key as the main service for display
                    $keys = array_keys($q->item_details);
                    if (!empty($keys)) {
                       $service = $keys[0]; 
                       if (count($keys) > 1) {
                           $service .= ' + ' . (count($keys) - 1) . ' more';
                       }
                    }
                }

                return [
                    'id' => $q->id,
                    'customerName' => $q->customer_name,
                    'email' => $q->customer_email,
                    'service' => $service, 
                    'status' => $q->status,
                    'amount' => $amount, // Calculated total for this quotation
                    'createdAt' => $q->created_at->toIso8601String(),
                ];
            });

        // 5. Monthly Data (Last 6 months)
        $monthlyData = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->format('M');
            $monthNum = $date->month;
            $year = $date->year;

            $count = Quotation::whereYear('created_at', $year)
                ->whereMonth('created_at', $monthNum)
                ->count();

            $monthlyData->push([
                'month' => $monthName,
                'quotations' => $count
            ]);
        }

        return response()->json([
            'totalQuotations' => $totalQuotations,
            'pendingQuotations' => $pendingQuotations,
            'approvedQuotations' => $approvedQuotations,
            'rejectedQuotations' => $rejectedQuotations,
            'totalCustomers' => $totalCustomers,
            'totalRevenue' => $totalRevenue,
            'recentQuotations' => $recentQuotations,
            'monthlyData' => $monthlyData
        ]);
    }
}
