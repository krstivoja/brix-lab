document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search_term');
    const resultsContainer = document.getElementById('search_results');
    const deleteButton = document.getElementById('delete_selected');
    const classList = JSON.parse(document.querySelector('.wrap').getAttribute('data-classes'));
    const categoryRadios = document.querySelectorAll('input[name="search_category"]');

    // Function to render class list with checkboxes
    function renderClassList(classes) {
        const uniqueClasses = [...new Set(classes)]; // Remove duplicates
        resultsContainer.innerHTML = uniqueClasses.map(className => `
            <li>
                <input type="checkbox" class="class-checkbox" value="${className}" />
                ${className}
            </li>
        `).join('');
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
        const selectedCategory = document.querySelector('input[name="search_category"]:checked').value;

        const filteredClasses = classList.filter(className => {
            const matchesSearchTerm = className.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' ||
                (selectedCategory === 'uncategorized' && !className.category) ||
                (className.category === selectedCategory);
            return matchesSearchTerm && matchesCategory;
        });

        renderClassList(filteredClasses);
    }

    // Delete selected classes
    deleteButton.addEventListener('click', function () {
        const selectedCheckboxes = document.querySelectorAll('.class-checkbox:checked');
        const selectedClasses = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

        // Remove selected classes from the original classList
        const updatedClassList = classList.filter(className => !selectedClasses.includes(className));

        // Update the displayed class list
        renderClassList(updatedClassList);

        // Optionally, you can send an AJAX request to update the server-side data
        // Example: updateClassesOnServer(updatedClassList);
    });

    // Add this function to render the preview of class names
    function renderPreview() {
        const replaceTerm = document.getElementById('replace_term').value;
        const prefix = document.getElementById('prefix').value;
        const suffix = document.getElementById('suffix').value;

        const previewContainer = document.getElementById('preview_results');
        const previewList = classList.map(className => {
            const newClassName = className.replace(searchTerm, replaceTerm);
            return `
                <li>
                    Current: ${className} <br />
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
});
