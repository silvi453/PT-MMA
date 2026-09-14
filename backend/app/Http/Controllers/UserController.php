<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    private function adminEmails()
    {
        return [
            'admin1ptmma@gmail.com',
            'admin2ptmma@gmail.com',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | GET SEMUA USER
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        $users = User::latest()->get();

        return response()->json([
            'message' => 'Data pengguna berhasil diambil',
            'data' => $users,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | USER YANG SEDANG LOGIN
    |--------------------------------------------------------------------------
    */
    public function currentUser(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        return response()->json($user);
    }

    /*
    |--------------------------------------------------------------------------
    | TAMBAH USER
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' =>
                'required|string|max:255',

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' =>
                'required|string|min:6',

            'role' =>
                'required|in:admin,user',
        ]);

        $email = strtolower(
            trim($validated['email'])
        );

        $adminEmails = $this->adminEmails();

        if (
            $validated['role'] === 'admin' &&
            !in_array(
                $email,
                $adminEmails,
                true
            )
        ) {
            return response()->json([
                'message' =>
                    'Email tersebut tidak terdaftar sebagai email admin resmi.',
            ], 403);
        }

        if (
            in_array(
                $email,
                $adminEmails,
                true
            )
        ) {
            $adminCount = User::where(
                'role',
                'admin'
            )->count();

            $existingAdmin = User::where(
                'email',
                $email
            )->where(
                'role',
                'admin'
            )->exists();

            if (
                !$existingAdmin &&
                $adminCount >= 2
            ) {
                return response()->json([
                    'message' =>
                        'Akun admin sudah mencapai batas maksimal 2 akun.',
                ], 422);
            }
        }

        $role = 'user';

        if (
            in_array(
                $email,
                $adminEmails,
                true
            ) &&
            $validated['role'] === 'admin'
        ) {
            $role = 'admin';
        }

        $user = User::create([
            'name' =>
                $validated['name'],

            'email' =>
                $email,

            'password' =>
                Hash::make(
                    $validated['password']
                ),

            'role' =>
                $role,
        ]);

        return response()->json([
            'message' =>
                'Pengguna berhasil ditambahkan',

            'data' =>
                $user,
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | DETAIL USER
    |--------------------------------------------------------------------------
    */
    public function show(User $user)
    {
        return response()->json([
            'message' =>
                'Data pengguna berhasil diambil',

            'data' =>
                $user,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE USER ADMIN
    |--------------------------------------------------------------------------
    */
    public function update(
        Request $request,
        User $user
    ) {
        $validated = $request->validate([
            'name' =>
                'required|string|max:255',

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
            ],

            'password' =>
                'nullable|string|min:6',

            'role' =>
                'required|in:admin,user',
        ]);

        $email = strtolower(
            trim($validated['email'])
        );

        $adminEmails =
            $this->adminEmails();

        if (
            $validated['role'] === 'admin' &&
            !in_array(
                $email,
                $adminEmails,
                true
            )
        ) {
            return response()->json([
                'message' =>
                    'Email tersebut tidak dapat memiliki role admin.',
            ], 403);
        }

        if (
            $user->role !== 'admin' &&
            $validated['role'] === 'admin'
        ) {
            $adminCount = User::where(
                'role',
                'admin'
            )->count();

            if ($adminCount >= 2) {
                return response()->json([
                    'message' =>
                        'Tidak dapat menambahkan admin baru karena sudah ada 2 akun admin.',
                ], 422);
            }
        }

        if (
            $user->role === 'admin' &&
            !in_array(
                $email,
                $adminEmails,
                true
            )
        ) {
            return response()->json([
                'message' =>
                    'Akun admin hanya boleh menggunakan email admin resmi.',
            ], 403);
        }

        $role = 'user';

        if (
            $validated['role'] === 'admin' &&
            in_array(
                $email,
                $adminEmails,
                true
            )
        ) {
            $role = 'admin';
        }

        $user->name =
            $validated['name'];

        $user->email =
            $email;

        $user->role =
            $role;

        if (
            !empty(
                $validated['password']
            )
        ) {
            $user->password =
                Hash::make(
                    $validated['password']
                );
        }

        $user->save();

        return response()->json([
            'message' =>
                'Pengguna berhasil diperbarui',

            'data' =>
                $user,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE PROFIL USER SENDIRI
    |--------------------------------------------------------------------------
    */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' =>
                    'Unauthenticated.',
            ], 401);
        }

        $validated = $request->validate([
            'name' =>
                'required|string|max:255',

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
            ],
        ]);

        $user->name =
            $validated['name'];

        $user->email =
            strtolower(
                trim($validated['email'])
            );

        /*
         * Role TIDAK diubah dari sini.
         * Role admin hanya boleh berasal
         * dari akun admin resmi.
         */

        $user->save();

        return response()->json([
            'message' =>
                'Profil berhasil diperbarui',

            'user' =>
                $user,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPLOAD FOTO PROFIL
    |--------------------------------------------------------------------------
    */
    public function updatePhoto(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' =>
                    'Unauthenticated.',
            ], 401);
        }

        $request->validate([
            'profile_photo' =>
                'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        /*
         * Hapus foto lama jika ada
         */
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

        /*
         * Simpan foto baru
         */
        $path = $request
            ->file('profile_photo')
            ->store(
                'profile-photos',
                'public'
            );

        $user->profile_photo =
            $path;

        $user->save();

        return response()->json([
            'message' =>
                'Foto profil berhasil diperbarui',

            'user' =>
                $user,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | HAPUS USER
    |--------------------------------------------------------------------------
    */
    public function destroy(User $user)
    {
        $adminEmails =
            $this->adminEmails();

        if (
            in_array(
                strtolower($user->email),
                $adminEmails,
                true
            )
        ) {
            return response()->json([
                'message' =>
                    'Akun admin resmi tidak dapat dihapus.',
            ], 403);
        }

        /*
         * Hapus foto profil user
         */
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

        $user->delete();

        return response()->json([
            'message' =>
                'Pengguna berhasil dihapus',
        ]);
    }
}