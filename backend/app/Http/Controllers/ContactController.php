<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | USER KIRIM PESAN
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'phone' => 'nullable|string|max:30',
            'message' => 'required|string',
        ]);

        $contact = Contact::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $validated['phone'] ?? null,
            'message' => $validated['message'],
            'reply' => null,
            'replied_at' => null,
            'reply_read_at' => null,
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Pesan berhasil dikirim.',
            'data' => $contact,
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN - SEMUA PESAN
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $contacts = Contact::with('user')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Data pesan berhasil diambil.',
            'data' => $contacts,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN - DETAIL PESAN
    |--------------------------------------------------------------------------
    */

    public function show(Contact $contact)
    {
        $contact->load('user');

        return response()->json([
            'message' => 'Detail pesan berhasil diambil.',
            'data' => $contact,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN - JUMLAH PESAN BELUM DIBACA
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
    | ADMIN - TANDAI PESAN SUDAH DIBACA
    |--------------------------------------------------------------------------
    */

    public function markAsRead(Contact $contact)
    {
        $contact->update([
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Pesan ditandai sudah dibaca.',
            'data' => $contact,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN - BALAS PESAN
    |--------------------------------------------------------------------------
    */

    public function reply(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'reply' => 'required|string',
        ]);

        $contact->update([
            'reply' => $validated['reply'],
            'replied_at' => now(),
            'reply_read_at' => null,
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Balasan berhasil dikirim.',
            'data' => $contact->fresh(),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN - HAPUS PESAN
    |--------------------------------------------------------------------------
    */

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response()->json([
            'message' => 'Pesan berhasil dihapus.',
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | USER - PESAN MILIK SENDIRI
    |--------------------------------------------------------------------------
    */

    public function myContacts(Request $request)
    {
        $user = $request->user();

        $contacts = Contact::where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Data pesan berhasil diambil.',
            'data' => $contacts,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | USER - JUMLAH BALASAN BELUM DIBACA
    |--------------------------------------------------------------------------
    */

    public function myUnreadReplies(Request $request)
    {
        $user = $request->user();

        $count = Contact::where('user_id', $user->id)
            ->whereNotNull('reply')
            ->whereNull('reply_read_at')
            ->count();

        return response()->json([
            'count' => $count,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | USER - TANDAI BALASAN SUDAH DIBACA
    |--------------------------------------------------------------------------
    */

    public function markReplyAsRead(
        Request $request,
        Contact $contact
    ) {
        if ($contact->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke pesan ini.',
            ], 403);
        }

        $contact->update([
            'reply_read_at' => now(),
        ]);

        return response()->json([
            'message' => 'Balasan berhasil ditandai sudah dibaca.',
            'data' => $contact->fresh(),
        ]);
    }
}