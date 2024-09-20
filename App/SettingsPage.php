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
            [$this, 'render_settings_page'] // Callback function
        );
    }

    public function render_settings_page()
    {
        // Retrieve global classes from the database
        $global_classes = get_option('bricks_global_classes', []);
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (isset($_POST['delete_all']) && $_POST['delete_all'] == '1') {
                $global_classes = [];
            } elseif (isset($_POST['new_classes'])) {
                $new_classes = array_filter(array_map('trim', explode("\n", $_POST['new_classes'])));
                foreach ($new_classes as $new_class) {
                    $global_classes[] = ['name' => $new_class];
                }
            } elseif (isset($_POST['search_term'], $_POST['replace_term'])) {
                $global_classes = $this->find_and_replace_classes(
                    $global_classes,
                    $_POST['search_term'],
                    $_POST['replace_term'],
                    $_POST['prefix'] ?? '',
                    $_POST['suffix'] ?? ''
                );
            }
            update_option('bricks_global_classes', $global_classes);
        }
?>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const searchInput = document.getElementById('search_term');
                const classList = <?php echo json_encode(array_column($global_classes, 'name')); ?>;
                const resultsContainer = document.getElementById('search_results');

                // Display all classes by default
                resultsContainer.innerHTML = classList.map(className => `<li>${className}</li>`).join('');

                searchInput.addEventListener('input', function() {
                    const searchTerm = searchInput.value.toLowerCase();
                    const filteredClasses = classList.filter(className => className.toLowerCase().includes(searchTerm));
                    resultsContainer.innerHTML = filteredClasses.map(className => `<li>${className}</li>`).join('');
                });
            });
        </script>

        <div class="wrap">
            <h1>Bricks Lab Settings</h1>
            <div class="flex gap-12">

                <div class="flex flex-col gap-4 bg-white p-4 rounded-md h-full min-w-[500px]">
                    <h2 class="text-4xl font-bold">Available Classes</h2>
                    <ul id="search_results"></ul>
                </div>

                <form method="post" action="" class="flex flex-col gap-4 bg-white p-4 rounded-md h-full w-full">
                    <div class="flex flex-col gap-2">
                        <label for="search_term">Search Term:</label>
                        <input type="text" id="search_term" name="search_term" required>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="replace_term">Replace Term:</label>
                        <input type="text" id="replace_term" name="replace_term">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="prefix">Prefix:</label>
                        <input type="text" id="prefix" name="prefix">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="suffix">Suffix:</label>
                        <input type="text" id="suffix" name="suffix">
                    </div>
                    <button type="submit">Update</button>
                </form>

                <form method="post" action="" class="flex flex-col gap-4 bg-white p-4 rounded-md h-full w-full">
                    <button type="submit" name="delete_all" value="1">Delete All Classes</button>
                </form>

                <form method="post" action="" class="flex flex-col gap-4 bg-white p-4 rounded-md h-full w-full">
                    <div class="flex flex-col gap-2">
                        <label for="new_classes">Add New Classes (one per row):</label>
                        <textarea id="new_classes" name="new_classes" rows="10"></textarea>
                    </div>
                    <button type="submit">Add Classes</button>
                </form>

            </div>
        </div>
<?php
    }

    private function find_and_replace_classes($classes, $search_term, $replace_term, $prefix, $suffix)
    {
        foreach ($classes as &$class) {
            if ($search_term === '*' || strpos($class['name'], $search_term) !== false) {
                $class['name'] = $prefix . $class['name'] . $suffix;
            }
        }
        return $classes;
    }
}

new SettingsPage();
