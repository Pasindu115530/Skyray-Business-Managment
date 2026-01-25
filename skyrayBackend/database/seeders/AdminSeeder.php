<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin already exists to avoid duplicates
        $email = 'adminpasindu@skyrays.lk';
        
        $exists = DB::table('admins')->where('email', $email)->exists();

        if (!$exists) {
            DB::table('admins')->insert([
                'name' => 'pasindu',
                'email' => $email,
                'password' => Hash::make('sky@1234'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->command->info("Admin user '{$email}' created successfully.");
        } else {
            $this->command->info("Admin user '{$email}' already exists.");
        }
    }
}
