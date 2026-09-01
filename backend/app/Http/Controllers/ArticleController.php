<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    // =========================
    // GET SEMUA ARTIKEL
    // =========================
    public function index()
    {
        $articles = Article::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    // =========================
    // TAMBAH ARTIKEL
    // =========================
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        // Upload gambar
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store(
                'articles',
                'public'
            );

            $validated['image'] = $path;
        }

        $article = Article::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil ditambahkan',
            'data' => $article,
        ], 201);
    }

    // =========================
    // DETAIL ARTIKEL
    // =========================
    public function show(Article $article)
    {
        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }

    // =========================
    // UPDATE ARTIKEL
    // =========================
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        // Upload gambar baru
        if ($request->hasFile('image')) {

            // Hapus gambar lama
            if ($article->image) {
                Storage::disk('public')->delete(
                    $article->image
                );
            }

            $path = $request->file('image')->store(
                'articles',
                'public'
            );

            $validated['image'] = $path;
        }

        $article->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil diperbarui',
            'data' => $article,
        ]);
    }

    // =========================
    // HAPUS ARTIKEL
    // =========================
    public function destroy(Article $article)
    {
        if ($article->image) {
            Storage::disk('public')->delete(
                $article->image
            );
        }

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil dihapus',
        ]);
    }
}
