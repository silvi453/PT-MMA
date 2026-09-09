<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContactController;

Route::post('/register', [
    AuthController::class,
    'register'
]);

Route::post('/login', [
    AuthController::class,
    'login'
]);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', [
        AuthController::class,
        'user'
    ]);

    Route::put('/profile', [
        AuthController::class,
        'updateProfile'
    ]);

    Route::post('/logout', [
        AuthController::class,
        'logout'
    ]);
});

Route::apiResource(
    'products',
    ProductController::class
);

Route::apiResource(
    'services',
    ServiceController::class
);

Route::apiResource(
    'articles',
    ArticleController::class
);

Route::apiResource(
    'users', 
    UserController::class
);

Route::post('/contacts', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/contacts', [
        ContactController::class,
        'index'
    ]);

    Route::get('/contacts/unread-count', [
        ContactController::class,
        'unreadCount'
    ]);

    Route::get('/contacts/{contact}', [
        ContactController::class,
        'show'
    ]);

    Route::put('/contacts/{contact}/read', [
        ContactController::class,
        'markAsRead'
    ]);

    Route::delete('/contacts/{contact}', [
        ContactController::class,
        'destroy'
    ]);

});