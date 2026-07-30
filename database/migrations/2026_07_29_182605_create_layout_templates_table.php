<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('layout_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type', 50)->default('full');
            $table->string('version')->default('1.0.0');
            $table->string('author')->default('Unknown');
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('config')->nullable();
            $table->boolean('is_protected')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('layout_templates');
    }
};
