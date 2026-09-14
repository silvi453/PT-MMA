<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
   

    private function adminEmails()
    {
        return [
            'admin1ptmma@gmail.com',
            'admin2ptmma@gmail.com',
        ];
    }


    public function handle(
        Request $request,
        Closure $next
    ) {

        if (!$request->user()) {
            return response()->json([
                'message' =>
                    'Unauthenticated.',
            ], 401);
        }


        $user = $request->user();


        $email = strtolower(
            trim($user->email)
        );


        if (
            !in_array(
                $email,
                $this->adminEmails(),
                true
            )
        ) {
            return response()->json([
                'message' =>
                    'Akses ditolak. Email ini bukan email admin resmi.',
            ], 403);
        }


        if ($user->role !== 'admin') {
            return response()->json([
                'message' =>
                    'Akses ditolak. Akun ini bukan admin.',
            ], 403);
        }


        return $next($request);
    }
}