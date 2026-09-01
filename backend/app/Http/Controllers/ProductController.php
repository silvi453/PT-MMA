<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // ==========================================
    // GET /api/products
    // MENAMPILKAN SEMUA PRODUK
    // ==========================================

    public function index()
    {
        return response()->json([
            'message' => 'Data produk berhasil diambil',
            'data' => Product::latest()->get(),
        ]);
    }


    // ==========================================
    // POST /api/products
    // TAMBAH PRODUK
    // ==========================================

    public function store(Request $request)
    {
        // Validasi
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'category' => 'nullable|string|max:255',

            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            'description' => 'nullable|string',

            'price' => 'nullable|numeric',
        ]);


        // ==========================================
        // UPLOAD GAMBAR
        // ==========================================

        if ($request->hasFile('image')) {

            $path = $request->file('image')->store(
                'products',
                'public'
            );

            $validated['image'] = $path;
        }


        // ==========================================
        // SIMPAN PRODUK KE DATABASE
        // ==========================================

        $product = Product::create($validated);


        // ==========================================
        // RESPONSE
        // ==========================================

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',

            'data' => $product,
        ], 201);
    }


    // ==========================================
    // GET /api/products/{product}
    // DETAIL PRODUK
    // ==========================================

    public function show(Product $product)
    {
        return response()->json([
            'message' => 'Detail produk berhasil diambil',

            'data' => $product,
        ]);
    }


    // ==========================================
    // PUT /api/products/{product}
    // EDIT PRODUK
    // ==========================================

    public function update(Request $request, Product $product)
    {
        // Validasi
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',

            'category' => 'nullable|string|max:255',

            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            'description' => 'nullable|string',

            'price' => 'nullable|numeric',
        ]);


        // ==========================================
        // UPLOAD GAMBAR BARU
        // ==========================================

        if ($request->hasFile('image')) {

            // Hapus gambar lama jika merupakan
            // gambar yang tersimpan di storage Laravel

            if (
                $product->image &&
                str_starts_with($product->image, 'products/')
            ) {

                $oldImage = storage_path(
                    'app/public/' . $product->image
                );

                if (file_exists($oldImage)) {
                    unlink($oldImage);
                }
            }


            // Upload gambar baru

            $path = $request->file('image')->store(
                'products',
                'public'
            );

            $validated['image'] = $path;
        }


        // ==========================================
        // UPDATE DATABASE
        // ==========================================

        $product->update($validated);


        // ==========================================
        // RESPONSE
        // ==========================================

        return response()->json([
            'message' => 'Produk berhasil diperbarui',

            'data' => $product,
        ]);
    }


    // ==========================================
    // DELETE /api/products/{product}
    // HAPUS PRODUK
    // ==========================================

    public function destroy(Product $product)
    {
        // ==========================================
        // HAPUS GAMBAR DARI STORAGE
        // ==========================================

        if (
            $product->image &&
            str_starts_with($product->image, 'products/')
        ) {

            $imagePath = storage_path(
                'app/public/' . $product->image
            );

            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }


        // ==========================================
        // HAPUS DATA PRODUK
        // ==========================================

        $product->delete();


        // ==========================================
        // RESPONSE
        // ==========================================

        return response()->json([
            'message' => 'Produk berhasil dihapus',
        ]);
    }
}
