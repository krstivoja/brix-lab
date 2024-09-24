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
            const categoryMap = createCategoryMap(globalClassesCategories);

            // Log all categories with correct names
            const globalCategories = mapGlobalClasses(globalClasses, categoryMap);
            console.log('Global Categories:', globalCategories);

            // Populate #classes-list with global classes
            populateClassesList(globalCategories);

            // Populate radio buttons from existing categories
            populateCategoryRadios(globalClassesCategories);

            // Add event listener for category filtering
            const categoryRadios = document.querySelectorAll('input[name="search_category"]');
            categoryRadios.forEach(radio => {
                radio.addEventListener('change', function () {
                    filterClasses(globalCategories); // Pass globalCategories here
                });
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

function createCategoryMap(categories) {
    return Object.fromEntries(categories.map(category => [category.id, category.name]));
}

function mapGlobalClasses(globalClasses, categoryMap) {
    return globalClasses.map(globalClass => ({
        name: globalClass.name,
        category: globalClass.category != null ? categoryMap[globalClass.category] : 'Uncategorized'
    }));
}

function populateClassesList(globalCategories) {
    const classesList = document.getElementById('classes-list');
    if (classesList) {
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
}

function populateCategoryRadios(globalClassesCategories) {
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
}

// Function to filter classes based on selected category
function filterClasses(globalCategories) {
    const selectedCategory = document.querySelector('input[name="search_category"]:checked').value;
    const classesList = document.getElementById('classes-list');
    const ul = classesList.querySelector('ul');

    if (ul) {
        const filteredClasses = globalCategories.filter(globalClass => {
            return selectedCategory === 'all' || globalClass.category === selectedCategory;
        });

        ul.innerHTML = ''; // Clear existing list
        filteredClasses.forEach(globalClass => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="swk__class-name">${globalClass.name}</span> <span class="swk__class-category">${globalClass.category}</span>`;
            ul.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', initTest);