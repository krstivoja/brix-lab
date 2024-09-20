document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search_term');
    const resultsContainer = document.getElementById('search_results');
    const classList = JSON.parse(document.querySelector('.wrap').getAttribute('data-classes'));

    // Display all classes by default
    resultsContainer.innerHTML = classList.map(className => `<li>${className}</li>`).join('');

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredClasses = classList.filter(className => className.toLowerCase().includes(searchTerm));
        resultsContainer.innerHTML = filteredClasses.map(className => {
            const highlightedName = className.replace(new RegExp(`(${searchTerm})`, 'gi'), '<span class="highlight">$1</span>');
            return `<li>${highlightedName}</li>`;
        }).join('');
    });
});
