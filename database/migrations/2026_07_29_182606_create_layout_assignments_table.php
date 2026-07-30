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
        Schema::create('layout_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('layout_templates')->cascadeOnDelete();
            $table->string('page_type', 100); // 'landing', 'dashboard', 'auth', 'default'
            $table->timestamps();

            $table->unique(['template_id', 'page_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('layout_assignments');
    }
};
