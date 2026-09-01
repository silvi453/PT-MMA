<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // ========================================
    // REGISTER USER
    // ========================================

    public function register(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|string|max:255',

                'email' => [
                    'required',
                    'email',
                    'max:255',
                    'unique:users,email',
                ],

                'password' => [
                    'required',
                    'string',
                    'min:6',
                    'confirmed',
                ],
            ],
            [
                'name.required' =>
                    'Nama wajib diisi.',

                'email.required' =>
                    'Email wajib diisi.',

                'email.email' =>
                    'Format email tidak valid.',

                'email.unique' =>
                    'Email sudah terdaftar.',

                'password.required' =>
                    'Password wajib diisi.',

                'password.min' =>
                    'Password minimal 6 karakter.',

                'password.confirmed' =>
                    'Konfirmasi password tidak cocok.',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' =>
                    'Data yang diberikan tidak valid.',
                'errors' =>
                    $validator->errors(),
            ], 422);
        }

        // ========================================
        // BUAT USER
        // ========================================

        $user = User::create([
            'name' =>
                $request->name,

            'email' =>
                $request->email,

            'password' =>
                Hash::make(
                    $request->password
                ),

            // Register selalu USER
            'role' => 'user',
        ]);

        // ========================================
        // BUAT TOKEN
        // ========================================

        $token = $user->createToken(
            'user-token'
        )->plainTextToken;

        return response()->json([
            'message' =>
                'Registrasi berhasil.',

            'user' =>
                $user,

            'token' =>
                $token,
        ], 201);
    }


    // ========================================
    // LOGIN
    // ========================================

    public function login(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'email' =>
                    'required|email',

                'password' =>
                    'required|string',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' =>
                    'Email dan password wajib diisi.',

                'errors' =>
                    $validator->errors(),
            ], 422);
        }

        // ========================================
        // CARI USER
        // ========================================

        $user = User::where(
            'email',
            $request->email
        )->first();

        // ========================================
        // CEK LOGIN
        // ========================================

        if (
            !$user ||
            !Hash::check(
                $request->password,
                $user->password
            )
        ) {
            return response()->json([
                'message' =>
                    'Email atau password salah.',
            ], 401);
        }

        // ========================================
        // TOKEN
        // ========================================

        $token = $user->createToken(
            'login-token'
        )->plainTextToken;

        return response()->json([
            'message' =>
                'Login berhasil.',

            'user' =>
                $user,

            'token' =>
                $token,
        ]);
    }


    // ========================================
    // LOGOUT
    // ========================================

    public function logout(
        Request $request
    ) {
        // Hapus token yang sedang digunakan

        if (
            $request->user() &&
            $request->user()->currentAccessToken()
        ) {
            $request->user()
                ->currentAccessToken()
                ->delete();
        }

        return response()->json([
            'message' =>
                'Logout berhasil.',
        ]);
    }


    // ========================================
    // USER LOGIN
    // ========================================

    public function user(
        Request $request
    ) {
        return response()->json([
            'data' =>
                $request->user(),
        ]);
    }
}
