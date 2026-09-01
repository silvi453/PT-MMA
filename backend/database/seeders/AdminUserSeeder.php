<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin PT MMA',
            'email' => 'admin@pt-mma.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);
    }
}