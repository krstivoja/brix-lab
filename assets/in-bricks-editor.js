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
                globalCategories.forEach(globalClass => {
                    const listItem = document.createElement('div');
                    listItem.textContent = `${globalClass.name} - ${globalClass.category}`;
                    classesList.appendChild(listItem);
                });
            } else {
                console.error('#classes-list element not found');
            }
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