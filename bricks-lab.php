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

require_once plugin_dir_path(__FILE__) . 'App/SettingsPage.php';
require_once plugin_dir_path(__FILE__) . 'App/RenderSettingsPage.php';

// Enqueue scripts and styles
add_action('admin_enqueue_scripts', function () {
    wp_enqueue_style('settings-page-css', plugin_dir_url(__FILE__) . 'assets/style.css');
    wp_enqueue_script('settings-page-js', plugin_dir_url(__FILE__) . 'assets/main.js', [], null, true);
});

add_action('wp_enqueue_scripts', function () {
    // Check if the Bricks builder function exists and is active
    if (function_exists('bricks_is_builder') && bricks_is_builder()) {
        wp_enqueue_script('in-brick-editor', plugin_dir_url(__FILE__) . 'assets/in-brick-editor.js', [], null, true);
    }
});
