<?php
/*
Plugin Name: Bricks Lab
Plugin URI: https://example.com/bricks-lab
Description: A plugin for managing bricks in a lab environment.
Version: 1.0
Author: Your Name
Author URI: https://example.com
License: GPL2
*/


require_once plugin_dir_path(__FILE__) . 'App/ClassManager.php';


add_action('wp_enqueue_scripts', function () {
    // Check if the Bricks builder function exists and is active, and not in iframe
    if (function_exists('bricks_is_builder') && bricks_is_builder() && !bricks_is_builder_iframe()) {
        wp_enqueue_script('in-brick-editor', plugin_dir_url(__FILE__) . 'assets/in-bricks-editor.js', [], null, true);
        wp_enqueue_style('in-brick-editor', plugin_dir_url(__FILE__) . 'assets/in-bricks-editor.css');

        // Check if the content has already been output
        if (!defined('SWISS_KNIFE_LAB_OUTPUT')) {
            define('SWISS_KNIFE_LAB_OUTPUT', true); // Define a constant to prevent duplicate output

            ob_start(); // Start output buffering
            $classManager = new \BrixLab\App\ClassManager(); // Create an instance of ClassManager
            echo $classManager->renderHTML(); // Call the method to get HTML
        }
    }
});

add_action('wp_ajax_update_classes', 'update_classes_callback');

function update_classes_callback()
{
    // Check for the required permissions
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Unauthorized', 403);
        return;
    }

    // Get the posted data
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['classes'])) {
        // Retrieve the current global classes from the database
        $global_classes = get_option(BRICKS_DB_GLOBAL_CLASSES, []);

        // Update the global classes with the new names
        foreach ($data['classes'] as $class) {
            // Find the index of the class to update
            $index = array_search($class['name'], array_column($global_classes, 'name'));
            if ($index !== false) {
                // Update the class name
                $global_classes[$index]['name'] = $class['newName'];
            }
        }

        // Save the updated global classes back to the database
        update_option(BRICKS_DB_GLOBAL_CLASSES, $global_classes);

        wp_send_json_success('Classes updated successfully');
    } else {
        wp_send_json_error('No classes provided');
    }
}
