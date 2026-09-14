<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | DAFTAR EMAIL ADMIN
    |--------------------------------------------------------------------------
    */

    private function adminEmails()
    {
        return [
            'admin1ptmma@gmail.com',
            'admin2ptmma@gmail.com',
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | REGISTER USER
    |--------------------------------------------------------------------------
    */

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
                'name.required' => 'Nama wajib diisi.',

                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email sudah terdaftar.',

                'password.required' => 'Password wajib diisi.',
                'password.min' => 'Password minimal 6 karakter.',
                'password.confirmed' => 'Konfirmasi password tidak cocok.',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | EMAIL ADMIN TIDAK BOLEH DIGUNAKAN UNTUK REGISTER USER
        |--------------------------------------------------------------------------
        */

        if (in_array(strtolower($request->email), $this->adminEmails())) {
            return response()->json([
                'message' => 'Email ini khusus untuk akun admin.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | BUAT USER
        |--------------------------------------------------------------------------
        */

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),

            // Semua hasil register otomatis USER
            'role' => 'user',
        ]);

        /*
        |--------------------------------------------------------------------------
        | TOKEN USER
        |--------------------------------------------------------------------------
        */

        $token = $user
            ->createToken('user-token')
            ->plainTextToken;

        return response()->json([
            'message' => 'Registrasi berhasil.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | LOGIN USER
    |--------------------------------------------------------------------------
    */

    public function login(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'email' => 'required|email',
                'password' => 'required|string',
            ],
            [
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'password.required' => 'Password wajib diisi.',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Email dan password wajib diisi.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        /*
        |--------------------------------------------------------------------------
        | EMAIL ADMIN TIDAK BOLEH LOGIN MELALUI LOGIN USER
        |--------------------------------------------------------------------------
        */

        if (
            $user &&
            in_array(strtolower($user->email), $this->adminEmails())
        ) {
            return response()->json([
                'message' => 'Akun admin harus login melalui halaman admin.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | CEK EMAIL & PASSWORD
        |--------------------------------------------------------------------------
        */

        if (
            !$user ||
            !Hash::check($request->password, $user->password)
        ) {
            return response()->json([
                'message' => 'Email atau password salah.',
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | PASTIKAN BUKAN ADMIN
        |--------------------------------------------------------------------------
        */

        if ($user->role === 'admin') {
            return response()->json([
                'message' => 'Akun admin harus login melalui halaman admin.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | BUAT TOKEN USER
        |--------------------------------------------------------------------------
        */

        $token = $user
            ->createToken('login-token')
            ->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => $user,
            'token' => $token,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | LOGIN ADMIN
    |--------------------------------------------------------------------------
    */

    public function adminLogin(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'email' => 'required|email',
                'password' => 'required|string',
            ],
            [
                'email.required' => 'Email admin wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'password.required' => 'Password admin wajib diisi.',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Email dan password admin wajib diisi.',
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | CEK EMAIL ADMIN
        |--------------------------------------------------------------------------
        */

        $email = strtolower($request->email);

        if (!in_array($email, $this->adminEmails())) {
            return response()->json([
                'message' => 'Email ini tidak memiliki akses admin.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | CARI USER
        |--------------------------------------------------------------------------
        */

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Akun admin tidak ditemukan.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | CEK PASSWORD
        |--------------------------------------------------------------------------
        */

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password admin salah.',
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | WAJIB ROLE ADMIN
        |--------------------------------------------------------------------------
        */

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Akun ini belum memiliki akses sebagai admin.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | BUAT TOKEN ADMIN
        |--------------------------------------------------------------------------
        */

        $token = $user
            ->createToken('admin-token')
            ->plainTextToken;

        return response()->json([
            'message' => 'Login admin berhasil.',
            'user' => $user,
            'token' => $token,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    public function logout(Request $request)
    {
        if (
            $request->user() &&
            $request->user()->currentAccessToken()
        ) {
            $request->user()
                ->currentAccessToken()
                ->delete();
        }

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | DATA USER YANG SEDANG LOGIN
    |--------------------------------------------------------------------------
    */

    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => $user,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE PROFILE
    |--------------------------------------------------------------------------
    */

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make(
            $request->all(),
            [
                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'email' => [
                    'required',
                    'email',
                    'max:255',
                    'unique:users,email,' . $user->id,
                ],

                'password' => [
                    'nullable',
                    'string',
                    'min:6',
                    'confirmed',
                ],

                'profile_photo' => [
                    'nullable',
                    'image',
                    'mimes:jpg,jpeg,png,webp',
                    'max:2048',
                ],
            ],
            [
                'name.required' => 'Nama wajib diisi.',
                'name.max' => 'Nama maksimal 255 karakter.',

                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email sudah digunakan oleh akun lain.',

                'password.min' => 'Password minimal 6 karakter.',
                'password.confirmed' => 'Konfirmasi password tidak cocok.',

                'profile_photo.image' => 'File harus berupa gambar.',
                'profile_photo.mimes' => 'Foto harus berformat JPG, JPEG, PNG, atau WEBP.',
                'profile_photo.max' => 'Ukuran foto maksimal 2 MB.',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE NAMA
        |--------------------------------------------------------------------------
        */

        $user->name = $request->name;

        /*
        |--------------------------------------------------------------------------
        | UPDATE EMAIL
        |--------------------------------------------------------------------------
        */

        $user->email = $request->email;

        /*
        |--------------------------------------------------------------------------
        | UPDATE PASSWORD
        |--------------------------------------------------------------------------
        */

        if ($request->filled('password')) {
            $user->password = Hash::make(
                $request->password
            );
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE FOTO PROFILE
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('profile_photo')) {

            if (
                $user->profile_photo &&
                Storage::disk('public')->exists(
                    $user->profile_photo
                )
            ) {
                Storage::disk('public')->delete(
                    $user->profile_photo
                );
            }

            $path = $request
                ->file('profile_photo')
                ->store('profile', 'public');

            $user->profile_photo = $path;
        }

        /*
        |--------------------------------------------------------------------------
        | SIMPAN
        |--------------------------------------------------------------------------
        */

        $user->save();

        /*
        |--------------------------------------------------------------------------
        | PROFILE PHOTO URL
        |--------------------------------------------------------------------------
        */

        $user->profile_photo_url = $user->profile_photo
            ? asset(
                'storage/' . $user->profile_photo
            )
            : null;

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'data' => $user,
        ]);
    }
}

