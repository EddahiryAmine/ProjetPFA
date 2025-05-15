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
        Schema::create('offre_emplois', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employeur_id');
            $table->unsignedBigInteger('statistiques_id');
            $table->string('titre');
            $table->text('description');
            $table->float('salaire')->nullable();
            
            $table->string('localisation');
            $table->date('dateExpiration');
            $table->timestamps();

            $table->foreign('employeur_id')->references('id')->on('employeurs')->onDelete('cascade');
            $table->foreign('statistiques_id')->references('id')->on('statistiques')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offre_emplois');
    }
};
