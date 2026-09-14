<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContactController;


/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
| Bisa diakses tanpa login.
| User/public hanya bisa melihat Produk, Layanan, dan Artikel.
|--------------------------------------------------------------------------
*/

// =========================
// AUTH
// =========================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);


// =========================
// PRODUK PUBLIC
// =========================

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);


// =========================
// LAYANAN PUBLIC
// =========================

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);


// =========================
// ARTIKEL PUBLIC
// =========================

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{article}', [ArticleController::class, 'show']);



/*
|--------------------------------------------------------------------------
| USER AUTHENTICATED ROUTES
|--------------------------------------------------------------------------
| Bisa digunakan oleh user yang sudah login.
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // =========================
    // USER PROFILE
    // =========================

    Route::get('/user', [AuthController::class, 'user']);

    Route::put('/profile', [AuthController::class, 'updateProfile']);

    Route::post('/logout', [AuthController::class, 'logout']);


    // =========================
    // CONTACT / HUBUNGI KAMI
    // =========================

    Route::post('/contacts', [ContactController::class, 'store']);


    // =========================
    // PESAN SAYA
    // =========================

    Route::get(
        '/my-contacts',
        [ContactController::class, 'myContacts']
    );

    Route::get(
        '/my-contacts/unread-replies',
        [ContactController::class, 'myUnreadReplies']
    );

    Route::put(
        '/my-contacts/{contact}/reply-read',
        [ContactController::class, 'markReplyAsRead']
    );



    /*
    |--------------------------------------------------------------------------
    | ADMIN ROUTES
    |--------------------------------------------------------------------------
    | Hanya admin yang boleh masuk ke bagian ini.
    |--------------------------------------------------------------------------
    */

    Route::middleware('admin')->group(function () {


        // =====================================================
        // PRODUK
        // =====================================================

        // Tambah produk
        Route::post(
            '/products',
            [ProductController::class, 'store']
        );

        // Edit produk
        Route::put(
            '/products/{product}',
            [ProductController::class, 'update']
        );

        // Hapus produk
        Route::delete(
            '/products/{product}',
            [ProductController::class, 'destroy']
        );



        // =====================================================
        // LAYANAN
        // =====================================================

        // Tambah layanan
        Route::post(
            '/services',
            [ServiceController::class, 'store']
        );

        // Edit layanan
        Route::put(
            '/services/{service}',
            [ServiceController::class, 'update']
        );

        // Hapus layanan
        Route::delete(
            '/services/{service}',
            [ServiceController::class, 'destroy']
        );



        // =====================================================
        // ARTIKEL
        // =====================================================

        // Tambah artikel
        Route::post(
            '/articles',
            [ArticleController::class, 'store']
        );

        // Edit artikel
        Route::put(
            '/articles/{article}',
            [ArticleController::class, 'update']
        );

        // Hapus artikel
        Route::delete(
            '/articles/{article}',
            [ArticleController::class, 'destroy']
        );



        // =====================================================
        // USERS
        // =====================================================

        Route::apiResource(
            'users',
            UserController::class
        );



        // =====================================================
        // CONTACTS / PESAN DARI USER
        // =====================================================

        // Semua pesan
        Route::get(
            '/contacts',
            [ContactController::class, 'index']
        );

        // Jumlah pesan belum dibaca
        Route::get(
            '/contacts/unread-count',
            [ContactController::class, 'unreadCount']
        );

        // Detail pesan
        Route::get(
            '/contacts/{contact}',
            [ContactController::class, 'show']
        );

        // Tandai pesan sudah dibaca
        Route::put(
            '/contacts/{contact}/read',
            [ContactController::class, 'markAsRead']
        );

        // Admin membalas pesan
        Route::post(
            '/contacts/{contact}/reply',
            [ContactController::class, 'reply']
        );

        // Hapus pesan
        Route::delete(
            '/contacts/{contact}',
            [ContactController::class, 'destroy']
        );

    });

});

