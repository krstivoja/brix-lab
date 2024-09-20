<?php

namespace BricksLab\App;

class RenderSettingsPage
{
    public function render()
    {
        $global_classes = $this->retrieveGlobalClasses();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->handlePostRequest($global_classes);
        }
        $this->outputHtml($global_classes);
    }

    private function retrieveGlobalClasses()
    {
        return get_option('bricks_global_classes', []);
    }

    private function handlePostRequest(&$global_classes)
    {
        if (isset($_POST['delete_all']) && $_POST['delete_all'] == '1') {
            $global_classes = [];
        } elseif (isset($_POST['new_classes'])) {
            $this->addNewClasses($global_classes);
        } elseif (isset($_POST['search_term'], $_POST['replace_term'])) {
            $global_classes = $this->findAndReplaceClasses(
                $global_classes,
                $_POST['search_term'],
                $_POST['replace_term'],
                $_POST['prefix'] ?? '',
                $_POST['suffix'] ?? ''
            );
        }
        update_option('bricks_global_classes', $global_classes);
    }

    private function addNewClasses(&$global_classes)
    {
        $new_classes = array_filter(array_map('trim', explode("\n", $_POST['new_classes'])));
        $selected_category = $_POST['class_category'] ?? null; // Get the selected category

        foreach ($new_classes as $new_class) {
            if (!in_array($new_class, array_column($global_classes, 'name'))) {
                $global_classes[] = [
                    'name' => $new_class,
                    'category' => $selected_category // Add the selected category
                ];
            }
        }
    }

    private function findAndReplaceClasses($classes, $search_term, $replace_term, $prefix, $suffix)
    {
        foreach ($classes as &$class) {
            if ($search_term === '*' || strpos($class['name'], $search_term) !== false) {
                $class['name'] = $prefix . $class['name'] . $suffix;
            }
        }
        return $classes;
    }

    private function outputHtml($global_classes)
    {
?>
        <script src="https://cdn.tailwindcss.com"></script>
        <div class="wrap" data-classes='<?php echo json_encode(array_column($global_classes, 'name')); ?>'>
            <h1>Bricks Lab Settings</h1>
            <div class="flex gap-12">
                <?php $this->renderForms(); ?>
                <div class="flex flex-col gap-4 bg-white p-4 rounded-md h-full min-w-[500px]">
                    <h2 class="text-4xl font-bold">Available Classes</h2>
                    <ul id="search_results"></ul>
                    <button id="delete_selected" class="mt-4">Delete Selected</button>
                    <form method="post" action="" class="flex flex-col gap-4 bg-white p-4 rounded-md h-full w-full">
                        <button type="submit" name="delete_all" value="1">Delete All Classes</button>
                    </form>
                </div>
                <?php $this->renderAddClassesForm(); ?>
            </div>
        </div>
    <?php
    }

    private function renderForms()
    {
    ?>
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
                <label for="prefix">Add Prefix:</label>
                <input type="text" id="prefix" name="prefix">
            </div>
            <div class="flex flex-col gap-2">
                <label for="suffix">Add Suffix:</label>
                <input type="text" id="suffix" name="suffix">
            </div>
            <button type="submit">Update</button>
        </form>
    <?php
    }

    private function renderAddClassesForm()
    {
        $categories = $this->retrieveClassCategories();
    ?>
        <form method="post" action="" class="flex flex-col gap-4 bg-white p-4 rounded-md h-full w-full">
            <div class="flex flex-col gap-2">
                <label for="new_classes">Add New Classes (one per row):</label>
                <textarea id="new_classes" name="new_classes" rows="10"></textarea>
            </div>
            <div class="flex flex-col gap-2">
                <label>Category:</label>
                <?php foreach ($categories as $category): ?>
                    <label>
                        <input type="radio" name="class_category" value="<?php echo esc_attr($category['id']); ?>" required> <?php echo esc_html($category['name']); ?>
                    </label>
                <?php endforeach; ?>
            </div>
            <button type="submit">Add Classes</button>
        </form>
<?php
    }

    private function retrieveClassCategories()
    {
        $categories = get_option('bricks_global_classes_categories', []);
        $decoded_categories = maybe_unserialize($categories);

        return is_array($decoded_categories) ? $decoded_categories : [];
    }
}
