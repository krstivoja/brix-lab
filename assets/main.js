document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search_term');
    const resultsContainer = document.getElementById('search_results');
    const deleteButton = document.getElementById('delete_selected');
    const classList = JSON.parse(document.querySelector('.wrap').getAttribute('data-classes'));

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

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredClasses = classList.filter(className => className.toLowerCase().includes(searchTerm));
        renderClassList(filteredClasses);
    });

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
});
