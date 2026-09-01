<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // GET /api/services
    public function index()
    {
        return response()->json([
            'message' => 'Data layanan berhasil diambil',
            'data' => Service::latest()->get(),
        ]);
    }

    // POST /api/services
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'description' => 'nullable|string',
            'status' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store(
                'services',
                'public'
            );

            $validated['image'] = $path;
        }

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Layanan berhasil ditambahkan',
            'data' => $service,
        ], 201);
    }

    // GET /api/services/{service}
    public function show(Service $service)
    {
        return response()->json([
            'message' => 'Detail layanan berhasil diambil',
            'data' => $service,
        ]);
    }

    // PUT /api/services/{service}
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'description' => 'nullable|string',
            'status' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store(
                'services',
                'public'
            );

            $validated['image'] = $path;
        }

        $service->update($validated);

        return response()->json([
            'message' => 'Layanan berhasil diperbarui',
            'data' => $service,
        ]);
    }

    // DELETE /api/services/{service}
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'message' => 'Layanan berhasil dihapus',
        ]);
    }
}