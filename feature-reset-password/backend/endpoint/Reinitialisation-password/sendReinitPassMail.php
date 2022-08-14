<?php

add_action('rest_api_init', 'cat_to_home_rest_send_mail');

function cat_to_home_rest_send_mail()
{
    // Route pour l'envoie de mail pour la réinitialisation de mot de passe
    register_rest_route('wp/v2', 'users/send', array(
        'methods' => 'POST',
        'callback' => 'cat_to_home_rest_send_mail_handler',
        'permission_callback' => function () {
            return true;
        }
    ));
}

function cat_to_home_rest_send_mail_handler($request)
{
    
    $parameters = $request->get_json_params();
    $email = sanitize_text_field($parameters['email']);

    $user = get_user_by('email', $email);

    // Si un utilisateur existe et qu'il n'est pas administrateur, on procède à l'envoie du mail.
    // Pour des raisons de sécuritées, on ne permet pas de modifier le mot de passe d'un administrateur 
    // car le BackOffice de wp est la pour le faire
    if ($user && $user->roles[0] !== 'administrator') {
        $token = md5($email).rand(10,9999);

        // On crée une date d'expiration au format Européen pour le token
        date_default_timezone_set('Europe/Paris');

        $expFormat = mktime(
            date("H"), date("i"), date("s"), date("m") ,date("d")+1, date("Y")
        );
        
        $expDate = date("Y-m-d H:i:s",$expFormat);

        // On met à jour les usermetas
        update_user_meta($user->ID, 'reset_token', $token);
        update_user_meta($user->ID, 'exp_date', $expDate);
        update_user_meta($user->ID, 'reset_email', $email);

        $link = "<a href=\"http://localhost:8080/reinitialisation-mot-de-passe?key=$user->ID&token=$token\">Reset password</a>";
        
        $subject = 'reset mot de passe';

        $message = 'Clique sur le lien pour réinisialiser ton mot de passe ' . $link . '<br>' . 'Si le lien ne fonctionne pas, copiez l\'url suivante : <br>' . 'http://localhost:8080/reinitialisation-mot-de-passe?key='.$user->ID.'&token='.$token.'';

        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            "Reply-To: Cat to home cattohome.contact@gmail.com",
            'From: Cat to home <cattohome.contact@gmail.com>'
        );
        $response['code'] = 200;
        $response['sent'] = wp_mail(''. $user->first_name . ' <'. $email .'>', $subject, $message, $headers);
    } else {
        $response['code'] = 400;
        $response = 'Aucun utilisateur ne correspond à cette adresse mail.';
    }
    return new WP_REST_Response($response, 200);
}