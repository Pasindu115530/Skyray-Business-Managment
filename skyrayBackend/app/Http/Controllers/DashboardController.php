<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Quotation;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $quotations = Quotation::count();
        $completedOrders = Order::where('status', 'completed')->count();

        // Fetch recent orders as "recent requests"
        $recentRequests = Order::with('customer')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer' => $order->customer ? $order->customer->name : 'Guest',
                    'email' => $order->customer ? $order->customer->email : 'N/A',
                    'date' => $order->created_at->format('Y-m-d'),
                    'status' => $order->status,
                    'amount' => number_format($order->total_amount, 2),
                ];
            });

        return response()->json([
            'stats' => [
                'total' => $totalOrders,
                'pending' => $pendingOrders,
                'quoted' => $quotations,
                'reviewed' => $completedOrders,
            ],
            'recent_requests' => $recentRequests
        ]);
    }
}
