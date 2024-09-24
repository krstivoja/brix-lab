function initTest() {
    const brxBody = document.querySelector('.brx-body');
    if (!brxBody) {
        console.error('brx-body element not found');
        return;
    }

    // Use a timeout to allow Vue to initialize
    setTimeout(() => {
        if (brxBody.__vue_app__) {
            const vueApp = brxBody.__vue_app__.config.globalProperties;

            // Get global classes and categories
            const { globalClasses, globalClassesCategories } = vueApp.$_state;

            // Create a mapping of category IDs to names
            const categoryMap = Object.fromEntries(globalClassesCategories.map(category => [category.id, category.name]));

            // Log all categories with correct names
            const globalCategories = globalClasses.map(globalClass => ({
                name: globalClass.name,
                category: globalClass.category ? categoryMap[globalClass.category] : 'Uncategorized'
            }));

            console.log('Global Categories:', globalCategories);

            // Populate #classes-list with global classes
            const classesList = document.getElementById('classes-list');
            if (classesList) {
                // Clear existing content and change to <ul>
                classesList.innerHTML = ''; // Clear existing content
                const ul = document.createElement('ul'); // Create a new <ul>

                globalCategories.forEach(globalClass => {
                    const li = document.createElement('li'); // Create a new <li>
                    li.innerHTML = `<span class="swk__class-name">${globalClass.name}</span> <span class="swk__class-category">${globalClass.category}</span>`;
                    ul.appendChild(li); // Append <li> to <ul>
                });

                classesList.appendChild(ul); // Append <ul> to #classes-list
            } else {
                console.error('#classes-list element not found');
            }

            // Populate radio buttons from existing categories
            const categoryRadiosContainer = document.querySelector('.swk__radio-group');
            globalClassesCategories.forEach(category => {
                const label = document.createElement('label');
                label.className = 'swk__radio-label';

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'search_category';
                input.value = category.name; // Assuming category has an 'id' property
                input.className = 'swk__radio';

                label.appendChild(input);
                label.appendChild(document.createTextNode(category.name)); // Assuming category has a 'name' property

                categoryRadiosContainer.appendChild(label);
            });
        } else {
            console.error('__vue_app__ is not defined on brx-body');
        }
    }, 1000); // Adjust the timeout as necessary

    const swissKnifeLab = document.getElementById('swiss-knife-lab');
    const bricksToolbar = document.querySelector('#bricks-toolbar > ul.group-wrapper.left');

    if (swissKnifeLab) {
        swissKnifeLab.style.display = 'block';
        bricksToolbar.appendChild(swissKnifeLab);
    }
}

document.addEventListener('DOMContentLoaded', initTest);