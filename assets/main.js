document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search_term');
    const resultsContainer = document.getElementById('search_results');
    const deleteButton = document.getElementById('delete_selected');
    const classList = JSON.parse(document.querySelector('.wrap').getAttribute('data-classes'));
    const categoryRadios = document.querySelectorAll('input[name="search_category"]');

    // Function to render class list with checkboxes
    function renderClassList(classes) {
        const uniqueClasses = [...new Set(classes)]; // Remove duplicates
        resultsContainer.innerHTML = uniqueClasses.map(classInfo => {
            const category = classInfo.category ? classInfo.category : 'Uncategorized';
            return `
                <li data-category="${category}" class="class-item w-full border-b border-slate-200 p-2 flex gap-2">
                    <input type="checkbox" class="class-checkbox !m-0 !mt-[2px]" value="${classInfo.name}" />
                    ${classInfo.name} <div class="text-xs bg-slate-100 p-1 rounded-md !ml-auto inline-block">${category}</div>
                </li>
            `;
        }).join('');
    }

    // Display all classes by default
    renderClassList(classList);

    // Filter classes based on search term
    searchInput.addEventListener('input', function () {
        filterClasses();
    });

    // Filter classes based on selected category
    categoryRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            filterClasses();
        });
    });

    function filterClasses() {
        const searchTerm = searchInput.value.toLowerCase();
        const prefix = document.getElementById('prefix').value.toLowerCase();
        const suffix = document.getElementById('suffix').value.toLowerCase();
        const selectedCategory = document.querySelector('input[name="search_category"]:checked').value;

        const filteredClasses = classList.filter(classInfo => {
            // Check if the class name matches the search term with prefix and suffix
            const fullClassName = `${prefix}${classInfo.name}${suffix}`.toLowerCase();
            const matchesSearchTerm = fullClassName.includes(searchTerm);

            // Check if the class matches the selected category
            let matchesCategory = false;
            if (selectedCategory === 'all') {
                matchesCategory = true; // Show all classes
            } else if (selectedCategory === 'uncategorized') {
                matchesCategory = !classInfo.category || classInfo.category.trim() === '';
            } else {
                matchesCategory = classInfo.category === selectedCategory;
            }

            return matchesSearchTerm && matchesCategory;
        });

        renderClassList(filteredClasses);
    }

    // Delete selected classes
    deleteButton.addEventListener('click', function () {
        const selectedCheckboxes = document.querySelectorAll('.class-checkbox:checked');
        const selectedClasses = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

        // Remove selected classes from the original classList
        const updatedClassList = classList.filter(classInfo => !selectedClasses.includes(classInfo.name));

        // Update the displayed class list
        renderClassList(updatedClassList);
    });

    // Add this function to render the preview of class names
    function renderPreview() {
        const replaceTerm = document.getElementById('replace_term').value;
        const prefix = document.getElementById('prefix').value;
        const suffix = document.getElementById('suffix').value;

        const previewContainer = document.getElementById('preview_results');
        const previewList = classList.map(classInfo => {
            const newClassName = classInfo.name.replace(searchTerm, replaceTerm);
            return `
                <li>
                    Current: ${classInfo.name} <br />
                    Replaced: ${prefix}${newClassName}${suffix}
                </li>
            `;
        }).join('');

        previewContainer.innerHTML = previewList;
    }

    // Call renderPreview when the replace term changes
    document.getElementById('replace_term').addEventListener('input', renderPreview);
    document.getElementById('prefix').addEventListener('input', renderPreview);
    document.getElementById('suffix').addEventListener('input', renderPreview);

    // Add event listener to toggle checkbox on text selection
    resultsContainer.addEventListener('click', function (event) {
        const classItem = event.target.closest('.class-item');
        if (classItem) {
            const checkbox = classItem.querySelector('.class-checkbox');
            checkbox.checked = !checkbox.checked; // Toggle checkbox state
        }
    });

    console.log(classList);
});
