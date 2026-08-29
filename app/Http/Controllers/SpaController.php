<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SpaController extends Controller
{
    public function index(Request $request)
    {
        $candidates = [
            public_path('index.html'),
            base_path('public/index.html'),
            dirname(base_path()).'/public_html/index.html',
        ];

        foreach ($candidates as $candidate) {
            if (file_exists($candidate)) {
                return response(file_get_contents($candidate), 200, [
                    'Content-Type' => 'text/html; charset=UTF-8',
                ]);
            }
        }

        if (view()->exists('app')) {
            return view('app');
        }

        return view('welcome');
    }
}
