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
        $global_classes = get_option('bricks_global_classes', []);
        $categories = $this->retrieveClassCategories();

        // Create a mapping of category IDs to names
        $categoryMap = [];
        foreach ($categories as $category) {
            $categoryMap[$category['id']] = $category['name'];
        }

        // Map the category names to the global classes
        foreach ($global_classes as &$class) {
            if (isset($class['category'])) {
                $class['category'] = $categoryMap[$class['category']] ?? 'Uncategorized';
            }
        }

        return $global_classes;
    }

    private function handlePostRequest(&$global_classes)
    {
        if (isset($_POST['delete_all']) && $_POST['delete_all'] == '1') {
            $global_classes = [];
        } elseif (isset($_POST['new_classes'])) {
            $this->addNewClasses($global_classes);
        } elseif (isset($_POST['search_term'], $_POST['replace_term'])) {
            $search_category = $_POST['search_category'] ?? 'all'; // Get the selected category
            $global_classes = $this->findAndReplaceClasses(
                $global_classes,
                $_POST['search_term'],
                $_POST['replace_term'],
                $_POST['prefix'] ?? '',
                $_POST['suffix'] ?? '',
                $search_category // Pass the selected category
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
                    'category' => $selected_category === 'uncategorized' ? null : $selected_category // Set to null if uncategorized
                ];
            }
        }
    }

    private function findAndReplaceClasses($classes, $search_term, $replace_term, $prefix, $suffix, $search_category)
    {
        foreach ($classes as &$class) {
            // Check if the class matches the selected category
            if (
                $search_category === 'all' ||
                ($search_category === 'uncategorized' && $class['category'] === null) ||
                ($class['category'] === $search_category)
            ) {
                // Check if the search term matches
                if ($search_term === '*' || strpos($class['name'], $search_term) !== false) {
                    // Replace the class name
                    $class['name'] = str_replace($search_term, $replace_term, $class['name']);
                    $class['name'] = $prefix . $class['name'] . $suffix; // Add prefix and suffix
                }
            }
        }
        return $classes;
    }

    private function outputHtml($global_classes)
    {
?>
        <script src="https://cdn.tailwindcss.com"></script>
        <div class="wrap" data-classes='<?php echo json_encode($global_classes); ?>'>
            <?php echo $this->renderTitle('Class Manager'); ?>
            <div class="flex gap-4">
                <?php $this->renderForms(); ?>
                <div class="flex flex-col gap-4 bg-white p-4 rounded-md h-full min-w-[500px]">
                    <?php echo $this->renderTitle('Available Classes'); ?>
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
        $categories = $this->retrieveClassCategories();
    ?>
        <form method="post" action="" class="flex flex-col gap-4 bg-white p-4 rounded-md h-full w-full">
            <?php echo $this->renderTitle('Search form'); ?>
            <div class="flex flex-col gap-2">
                <label for="search_term">Search Term:</label>
                <input type="text" id="search_term" name="search_term" required>
            </div>
            <div class="flex flex-col gap-2">
                <b><label>Search in Categories:</label></b>
                <div class="ml-2 flex flex-col gap-2">
                    <label>
                        <input type="radio" name="search_category" value="all" required checked> All
                    </label>
                    <label>
                        <input type="radio" name="search_category" value="uncategorized"> Uncategorized
                    </label>
                    <?php foreach ($categories as $category): ?>
                        <label>
                            <input type="radio" name="search_category" value="<?php echo esc_attr($category['name']); ?>"> <?php echo esc_html($category['name']); ?>
                        </label>
                    <?php endforeach; ?>
                </div>
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
            <?php echo $this->renderTitle('Add New Classes'); ?>

            <div class="flex flex-col gap-2">
                <label for="new_classes">one per row</label>
                <textarea id="new_classes" name="new_classes" rows="10"></textarea>
            </div>
            <div class="flex flex-col gap-2">
                <b><label>Assign to Category:</label></b>
                <div class="ml-2 flex flex-col gap-2">
                    <label>
                        <input type="radio" name="class_category" value="uncategorized" required checked> Uncategorized
                    </label>
                    <?php foreach ($categories as $category): ?>
                        <label>
                            <input type="radio" name="class_category" value="<?php echo esc_attr($category['id']); ?>"> <?php echo esc_html($category['name']); ?>
                        </label>
                    <?php endforeach; ?>
                </div>
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

    private function renderTitle($text)
    {
        return "<h2 class='text-2xl font-bold'>{$text}</h2>";
    }
}
