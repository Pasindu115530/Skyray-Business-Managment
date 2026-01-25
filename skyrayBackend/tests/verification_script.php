<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\User;

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tables = ['admins', 'users', 'customers', 'orders', 'order_items', 'settings', 'notifications', 'products', 'projects', 'galleries', 'quotations'];
$missing = [];

echo "Checking tables...\n";
foreach ($tables as $table) {
    if (Schema::hasTable($table)) {
        echo "[OK] Table '$table' exists.\n";
    } else {
        echo "[FAIL] Table '$table' MISSING.\n";
        $missing[] = $table;
    }
}

echo "\nChecking Admin User...\n";
$admin = DB::table('admins')->where('email', 'adminpasindu@skyrays.lk')->first();
if ($admin) {
    echo "[OK] Admin user 'pasindu' (adminpasindu@skyrays.lk) found.\n";
} else {
    echo "[FAIL] Admin user NOT found.\n";
}

if (empty($missing) && $admin) {
    echo "\nVERIFICATION SUCCESSFUL.\n";
    exit(0);
} else {
    echo "\nVERIFICATION FAILED.\n";
    exit(1);
}
