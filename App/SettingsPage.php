<?php

namespace BricksLab\App;

class SettingsPage
{
    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_settings_page']);
    }

    public function add_settings_page()
    {
        add_menu_page(
            'Bricks Lab Settings', // Page title
            'Bricks Lab',          // Menu title
            'manage_options',      // Capability
            'bricks-lab-settings', // Menu slug
            [new RenderSettingsPage(), 'render'] // Callback function
        );
    }
}

new SettingsPage();
