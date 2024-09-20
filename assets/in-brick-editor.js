document.addEventListener('DOMContentLoaded', function () {
    console.log('in-brick-editor.js loaded');

    // Fetch global classes from a data attribute
    const wrapElement = document.querySelector('.wrap');
    if (wrapElement) {
        const dataClasses = wrapElement.getAttribute('data-classes');
        if (dataClasses) {
            const globalClasses = JSON.parse(dataClasses);
            console.log('Global Classes:', globalClasses);

            // List all classes in the UI
            const classListContainer = document.getElementById('search_results');
            if (classListContainer) {
                classListContainer.innerHTML = globalClasses.map(className => `
                    <li>${className}</li>
                `).join('');
            }
        } else {
            console.error('data-classes attribute is null or empty.');
            // Handle the empty case by providing a default message or behavior
            const classListContainer = document.getElementById('search_results');
            if (classListContainer) {
                classListContainer.innerHTML = '<li>No classes available.</li>';
            }
        }
    } else {
        console.error('.wrap element not found.');
    }

    // Add an event listener to the classes list item
    const classesListItem = document.querySelector('.classes');

    if (classesListItem) {
        classesListItem.addEventListener('click', function () {
            const wrapElement = document.querySelector('.wrap');
            if (wrapElement) {
                const dataClasses = wrapElement.getAttribute('data-classes');
                if (dataClasses) {
                    const globalClasses = JSON.parse(dataClasses);
                    // Log the classes to the console
                    console.log('Classes clicked:', globalClasses);
                } else {
                    console.log('No classes available.');
                }
            }
        });
    }
});