<?php

add_action('rest_api_init', 'cat_to_home_rest_password');

function cat_to_home_rest_password()
{
    // Route pour réinitialiser le password
    register_rest_route('wp/v2', 'users/reset-password', array(
        'methods' => 'POST',
        'callback' => 'cat_to_home_rest_password_handler',
        'permission_callback' => function () {
            return true;
        }
    ));
}

function cat_to_home_rest_password_handler($request)
{
    $parameters = $request->get_json_params();
    $password = !empty($parameters['password']) ? $parameters['password'] : false;

    if (!$password) {
        $response['code'] = 400;
        $response['message'] = 'Le mot de passe ne doit pas être vide';
        return new WP_REST_Response($response, 200);
    }

    $email = sanitize_text_field($parameters['email']);

    // On récupère l'user en fonction de son mail
    $user = get_user_by('email', $email);

    if ($user && $user->roles[0] !== 'administrator') {
        $result = wp_update_user([
            'ID' => $user->ID,
            'user_pass' => $parameters['password']
        ]);

        if ($result) {
            $response['code'] = 200;
            $response['message'] = 'Le mot de passe à bien été réinitialisé';
        } else {
            $response['code'] = 400;
            $response['message'] = $result;
        }

    } else {
        $response['code'] = 400;
        $response['message'] = 'L\'email n\'est pas valide';

    }
    return new WP_REST_Response($response, 200);

}
