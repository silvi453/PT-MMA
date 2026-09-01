<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\UserController;


// ========================================
// AUTH
// ========================================

// REGISTER
Route::post(
    '/register',
    [AuthController::class, 'register']
);


// LOGIN
Route::post(
    '/login',
    [AuthController::class, 'login']
);


// USER YANG SEDANG LOGIN
Route::middleware('auth:sanctum')
    ->get(
        '/user',
        [AuthController::class, 'user']
    );


// LOGOUT
Route::middleware('auth:sanctum')
    ->post(
        '/logout',
        [AuthController::class, 'logout']
    );


// ========================================
// PRODUCTS
// ========================================

Route::apiResource(
    'products',
    ProductController::class
);


// ========================================
// SERVICES
// ========================================

Route::apiResource(
    'services',
    ServiceController::class
);


// ========================================
// ARTICLES
// ========================================

Route::apiResource(
    'articles',
    ArticleController::class
);


// ========================================
// USERS
// ========================================

Route::apiResource(
    'users',
    UserController::class
);
