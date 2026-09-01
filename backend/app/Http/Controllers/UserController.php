<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // ========================================
    // GET SEMUA USER
    // ========================================

    public function index()
    {
        $users = User::latest()->get();

        return response()->json([
            'message' => 'Data pengguna berhasil diambil',
            'data' => $users,
        ]);
    }


    // ========================================
    // TAMBAH USER
    // ========================================

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(
                $validated['password']
            ),
            'role' => $validated['role'],
        ]);

        return response()->json([
            'message' => 'Pengguna berhasil ditambahkan',
            'data' => $user,
        ], 201);
    }


    // ========================================
    // DETAIL USER
    // ========================================

    public function show(User $user)
    {
        return response()->json([
            'message' => 'Data pengguna berhasil diambil',
            'data' => $user,
        ]);
    }


    // ========================================
    // UPDATE USER
    // ========================================

    public function update(
        Request $request,
        User $user
    ) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
            ],

            'password' => 'nullable|string|min:6',

            'role' => 'required|in:admin,user',
        ]);

        $user->name =
            $validated['name'];

        $user->email =
            $validated['email'];

        $user->role =
            $validated['role'];

        // Password hanya diubah
        // jika diisi
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
            'message' => 'Pengguna berhasil diperbarui',
            'data' => $user,
        ]);
    }


    // ========================================
    // DELETE USER
    // ========================================

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Pengguna berhasil dihapus',
        ]);
    }
}
