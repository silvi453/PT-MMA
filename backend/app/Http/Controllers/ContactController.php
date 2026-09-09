<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | PENGUNJUNG MENGIRIM PESAN
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:30',
            'message' => 'required|string',
        ]);

        $contact = Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Pesan berhasil dikirim.',
            'data' => $contact,
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN MELIHAT SEMUA PESAN
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $contacts = Contact::latest()->get();

        return response()->json([
            'message' => 'Data pesan berhasil diambil.',
            'data' => $contacts,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN MELIHAT DETAIL PESAN
    |--------------------------------------------------------------------------
    */

    public function show(Contact $contact)
    {
        return response()->json([
            'message' => 'Detail pesan berhasil diambil.',
            'data' => $contact,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | JUMLAH PESAN BELUM DIBACA
    |--------------------------------------------------------------------------
    */

    public function unreadCount()
    {
        $count = Contact::where('is_read', false)->count();

        return response()->json([
            'count' => $count,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | TANDAI SUDAH DIBACA
    |--------------------------------------------------------------------------
    */

    public function markAsRead(Contact $contact)
    {
        $contact->update([
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Pesan berhasil ditandai sudah dibaca.',
            'data' => $contact,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | HAPUS PESAN
    |--------------------------------------------------------------------------
    */

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response()->json([
            'message' => 'Pesan berhasil dihapus.',
        ]);
    }
}