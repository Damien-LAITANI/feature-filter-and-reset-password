# Features réalisées pour le projet _Cat to home_

Voici les deux fonctionnalités réalisées en autonomie, j'ai toutefois aidé sur la création d'une fiche (récupération de la featured media et son traitement, gestion de la condition si la localisation était déjà ou non en base de données), la page profil, les services et le store. J'ai également réalisé en grande partie le backend (custom rôles, endpoint, taxonomie, table)

## Feature filter

Fonctionnalité qui permet de filtrer les fiches d'adoption en fonction de la localisation, de l'âge et par ordre croissant ou décroissant.

## Feature reset password

Fonctionnalité qui envoie un mail à l'utilisateur avec un lien contenant un token avec date d'expiration pour réinitialiser son mot de passe.

Avant l'envoi du mail, un token, une date d'expiration ainsi que l'adresse mail sont enregistrés en base de données et ensuite récupérés par le front lors du traitement de la demande.
