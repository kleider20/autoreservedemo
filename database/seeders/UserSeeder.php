<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin AutoReserve',
                'email' => 'admin@autoreserve.test',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Cliente Demo',
                'email' => 'cliente@autoreserve.test',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Usuario Sin Verificar',
                'email' => 'pendiente@autoreserve.test',
                'password' => 'password',
                'email_verified_at' => null,
            ],
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($userData['password']),
                    'email_verified_at' => $userData['email_verified_at'],
                ]
            );
        }

        $count = User::count();
        $this->command->info("{$count} usuarios creados/verificados.");
        $this->command->warn('Contraseña para todos: password');
    }
}
