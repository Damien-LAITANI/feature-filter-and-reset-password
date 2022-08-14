<?php

add_action('rest_api_init', 'cat_to_home_rest_info_user');

function cat_to_home_rest_info_user()
{
    // Route pour récupérer les infos d'un l'utilisateur en vue de la réinitialisation de son mot de passe
    register_rest_route('wp/v2', 'users/reset/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'cat_to_home_rest_info_user_handler',
        'permission_callback' => function () {
            return true;
        }
    ));
}

function cat_to_home_rest_info_user_handler($data)
{
    global $wpdb;
    
    $userId = $data['id'];
    $user = get_user_by('ID', $userId);

    $sql = "SELECT *
            FROM $wpdb->usermeta
            WHERE user_id = $userId
            AND meta_key IN ('reset_token', 'exp_date', 'reset_email')
            ORDER BY umeta_id";

    $result = $wpdb->get_results($sql);

    if ($user) {
        $response['code'] = 200;
        $response['data'] = $result;   

    } else {
        $response['code'] = 400;
        $response['message'] = 'L\'email n\'est pas valide';

    }
    return new WP_REST_Response($response, 200);

}
