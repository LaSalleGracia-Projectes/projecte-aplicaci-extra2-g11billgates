<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmailsController;

Route::get('/emails', [EmailsController::class, 'index']);
