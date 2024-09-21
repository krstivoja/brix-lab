function initTest() {
    console.log('in-brick-editor.js loaded');

    let menuItem = document.querySelector('#bricks-toolbar > ul.group-wrapper.left');
    if (menuItem) {
        menuItem.insertAdjacentHTML('beforeend', `
            <li id="swk-paste" data-key="'swiss_paste'"><span class="label">Marko</span></li>
        `);
    }

    const brxBody = document.querySelector('.brx-body');
    if (!brxBody) {
        console.error('brx-body element not found');
        return;
    }

    // Use a timeout to allow Vue to initialize
    setTimeout(() => {
        if (brxBody.__vue_app__) {
            const vueApp = brxBody.__vue_app__.config.globalProperties;
            // console.log(vueApp);

            // Log all global classes
            const globalClasses = vueApp.$_state.globalClasses;
            // console.log('Global Classes:', globalClasses);

            // Create a mapping of category IDs to names
            const categoryMap = {};
            const categories = [
                { id: 'bqcwew', name: 'marko' },
                { id: 'fxpjug', name: 'kategorija' }
            ];

            categories.forEach(category => {
                categoryMap[category.id] = category.name;
            });

            // Log all categories with correct names
            const globalCategories = globalClasses.map(globalClass => {
                return {
                    name: globalClass.name,
                    category: globalClass.category ? categoryMap[globalClass.category] : null
                };
            });

            console.log('Global Categories:', globalCategories);
        } else {
            console.error('__vue_app__ is not defined on brx-body');
        }
    }, 100); // Adjust the timeout as necessary
}

document.addEventListener('DOMContentLoaded', initTest);