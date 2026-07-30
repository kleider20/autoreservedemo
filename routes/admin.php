<?php

use App\Http\Controllers\Admin\TemplateController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/templates', [TemplateController::class, 'index'])->name('templates.index');
    Route::get('/templates/assign', [TemplateController::class, 'assign'])->name('templates.assign');
    Route::get('/templates/upload', [TemplateController::class, 'upload'])->name('templates.upload');
    Route::post('/templates', [TemplateController::class, 'store'])->name('templates.store');
    Route::post('/templates/{template}/activate', [TemplateController::class, 'activate'])->name('templates.activate');
    Route::post('/templates/deactivate', [TemplateController::class, 'deactivate'])->name('templates.deactivate');
    Route::get('/templates/{template}/download', [TemplateController::class, 'download'])->name('templates.download');
    Route::delete('/templates/{template}', [TemplateController::class, 'destroy'])->name('templates.destroy');
});
