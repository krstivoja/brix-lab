function initTest() {
    console.log('in-brick-editor.js loaded');

    const brxBody = document.querySelector('.brx-body');
    if (!brxBody) {
        console.error('brx-body element not found');
        return;
    }

    // Use a timeout to allow Vue to initialize
    setTimeout(() => {
        const vueApp = brxBody.__vue_app__?.config.globalProperties; // Optional chaining

        if (vueApp) {
            const { globalClasses, globalClassesCategories } = vueApp.$_state;

            // Create a mapping of category IDs to names
            const categoryMap = Object.fromEntries(globalClassesCategories.map(category => [category.id, category.name]));

            // Log all categories with correct names
            const globalCategories = globalClasses.map(globalClass => ({
                name: globalClass.name,
                category: globalClass.category ? categoryMap[globalClass.category] : null
            }));

            console.log('Global Categories:', globalCategories);
        } else {
            console.error('__vue_app__ is not defined on brx-body');
        }
    }, 100); // Adjust the timeout as necessary

    const swissKnifeLab = document.getElementById('swiss-knife-lab');
    const bricksToolbar = document.querySelector('#bricks-toolbar > ul.group-wrapper.left');

    if (swissKnifeLab) {
        swissKnifeLab.style.display = 'block';
        bricksToolbar.appendChild(swissKnifeLab);
    }
}

document.addEventListener('DOMContentLoaded', initTest);