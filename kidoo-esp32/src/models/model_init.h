#ifndef MODEL_INIT_H
#define MODEL_INIT_H

/**
 * Fichier central pour inclure l'initialisation du modèle
 * 
 * Ce fichier inclut automatiquement la bonne initialisation
 * selon le modèle défini lors de la compilation
 */

// Vérifier qu'un modèle est défini
#if !defined(KIDOO_MODEL_BASIC) && !defined(KIDOO_MODEL_MINI)
  #error "Aucun modele Kidoo defini. Definir KIDOO_MODEL_BASIC ou KIDOO_MODEL_MINI dans platformio.ini"
#endif

// Inclure l'initialisation du modèle approprié
#ifdef KIDOO_MODEL_BASIC
  #include "basic/init/init_model.h"
  #define InitModel InitModelBasic
#elif defined(KIDOO_MODEL_MINI)
  #include "mini/init/init_model.h"
  #define InitModel InitModelMini
#endif

#endif // MODEL_INIT_H
