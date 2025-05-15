<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOffreEmploiPreferenceTable extends Migration
{
    public function up()
    {
        Schema::create('offre_emploi_preference', function (Blueprint $table) {
            $table->id();

            $table->foreignId('offre_emploi_id')->constrained('offre_emplois')->onDelete('cascade');
            $table->foreignId('preference_id')->constrained('preferences')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('offre_emploi_preference');
    }
}
