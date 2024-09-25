document.addEventListener('DOMContentLoaded', initTest);

function initTest() {
    const brxBody = document.querySelector('.brx-body');
    if (!brxBody) {
        console.error('brx-body element not found');
        return;
    }

    // Initialize when Vue is ready
    waitForVueApp(brxBody, vueApp => {
        const { globalClasses, globalClassesCategories } = vueApp.$_state;

        const categoryMap = createCategoryMap(globalClassesCategories);
        const globalCategories = mapGlobalClasses(globalClasses, categoryMap);

        console.log('Global Categories:', globalCategories);

        populateClassesList(globalCategories);
        populateCategoryRadios(globalClassesCategories);

        const categoryRadios = document.querySelectorAll('input[name="search_category"]');
        categoryRadios.forEach(radio => {
            radio.addEventListener('change', () => filterClasses(globalCategories));
        });

        const searchInput = document.getElementById('search_term');
        if (searchInput) {
            searchInput.addEventListener('input', () => filterClasses(globalCategories));
        }

        const replaceInput = document.getElementById('replace_term');
        if (replaceInput) {
            replaceInput.addEventListener('input', () => filterClasses(globalCategories));
        }

        const prefixInput = document.getElementById('prefix');
        if (prefixInput) {
            prefixInput.addEventListener('input', () => filterClasses(globalCategories));
        }

        const suffixInput = document.getElementById('suffix');
        if (suffixInput) {
            suffixInput.addEventListener('input', () => filterClasses(globalCategories));
        }

        const updateButton = document.querySelector('.swk__button--update-classes');
        if (updateButton) {
            updateButton.addEventListener('click', (e) => {
                e.preventDefault();
                updateClasses();
            });
        }

        // Add event listener to show the popup
        const swissKnifeLab = document.getElementById('swiss-knife-lab');
        if (swissKnifeLab) {
            swissKnifeLab.addEventListener('click', () => {
                const popupBg = document.querySelector('.popup-bg');
                if (popupBg) {
                    popupBg.style.display = 'flex'; // Show the popup
                }
            });
        }

        // Add event listener to close the popup
        const closeButton = document.querySelector('.swk__close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                const popupBg = document.querySelector('.popup-bg');
                if (popupBg) {
                    popupBg.style.display = 'none'; // Hide the popup
                }
            });
        }
    });

    handleSwissKnifeLabDisplay();
}

// Ensure the popup is hidden on page load
document.addEventListener('DOMContentLoaded', () => {
    const popupBg = document.querySelector('.popup-bg');
    if (popupBg) {
        popupBg.style.display = 'none'; // Hide the popup initially
    }
});

function waitForVueApp(element, callback) {
    const observer = new MutationObserver(() => {
        if (element.__vue_app__) {
            observer.disconnect();
            callback(element.__vue_app__.config.globalProperties);
        }
    });
    observer.observe(element, { childList: true });
}

function createCategoryMap(categories) {
    return categories.reduce((map, category) => {
        map[category.id] = category.name;
        return map;
    }, {});
}

function mapGlobalClasses(globalClasses, categoryMap) {
    return globalClasses.map(globalClass => ({
        name: globalClass.name,
        category: globalClass.category != null ? categoryMap[globalClass.category] : 'Uncategorized'
    }));
}

function populateClassesList(globalCategories) {
    const classesList = document.getElementById('classes-list');
    if (!classesList) {
        console.error('#classes-list element not found');
        return;
    }

    const ul = document.createElement('ul');
    const fragment = document.createDocumentFragment();

    globalCategories.forEach(globalClass => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="swk__class-name">${globalClass.name}</span> <span class="swk__class-category">${globalClass.category}</span>`;
        fragment.appendChild(li);
    });

    ul.appendChild(fragment);
    classesList.innerHTML = '';
    classesList.appendChild(ul);
}

function populateCategoryRadios(globalClassesCategories) {
    const categoryRadiosContainer = document.querySelector('.swk__radio-group');
    if (!categoryRadiosContainer) {
        console.error('.swk__radio-group element not found');
        return;
    }

    globalClassesCategories.forEach(category => {
        const label = document.createElement('label');
        label.className = 'swk__radio-label';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'search_category';
        input.value = category.name;
        input.className = 'swk__radio';

        label.appendChild(input);
        label.appendChild(document.createTextNode(category.name));

        categoryRadiosContainer.appendChild(label);
    });
}

function filterClasses(globalCategories) {
    const searchTerm = document.getElementById('search_term').value.toLowerCase();
    const replaceTerm = document.getElementById('replace_term').value;
    const prefix = document.getElementById('prefix').value; // Get the prefix value
    const suffix = document.getElementById('suffix').value; // Get the suffix value
    const selectedCategory = document.querySelector('input[name="search_category"]:checked').value;
    const classesList = document.getElementById('classes-list');

    if (!classesList) {
        console.error('#classes-list element not found');
        return;
    }

    const ul = classesList.querySelector('ul');
    if (!ul) return;

    const filteredClasses = globalCategories.filter(globalClass => {
        const classNameElement = document.createElement('div');
        classNameElement.innerHTML = `<span class="swk__class-name">${globalClass.name}</span>`;
        const classNameText = classNameElement.querySelector('.swk__class-name').textContent.toLowerCase();

        return (selectedCategory === 'all' || globalClass.category === selectedCategory) &&
            classNameText.includes(searchTerm);
    });

    ul.innerHTML = '';
    const fragment = document.createDocumentFragment();

    filteredClasses.forEach(globalClass => {
        let modifiedClassName = globalClass.name;
        if (replaceTerm) {
            modifiedClassName = modifiedClassName.replace(new RegExp(searchTerm, 'gi'), replaceTerm);
        }

        // Add prefix and suffix
        modifiedClassName = `${prefix}${modifiedClassName}${suffix}`;

        const li = document.createElement('li');
        li.innerHTML = `<span class="swk__class-name">${modifiedClassName}</span> <span class="swk__class-category">${globalClass.category}</span>`;
        fragment.appendChild(li);
    });

    ul.appendChild(fragment);
}

function handleSwissKnifeLabDisplay() {
    const swissKnifeLab = document.getElementById('swiss-knife-lab');
    const bricksToolbar = document.querySelector('#bricks-toolbar > ul.group-wrapper.left');

    if (swissKnifeLab && bricksToolbar) {
        swissKnifeLab.style.display = 'block';
        bricksToolbar.appendChild(swissKnifeLab);
    }
}

function updateClasses() {
    const searchTerm = document.getElementById('search_term').value.toLowerCase(); // Define searchTerm here
    const replaceTerm = document.getElementById('replace_term').value;
    const prefix = document.getElementById('prefix').value;
    const suffix = document.getElementById('suffix').value;

    // Collect the classes to update
    const classesToUpdate = Array.from(document.querySelectorAll('.swk__class-name')).map(classElement => {
        return {
            name: classElement.textContent,
            newName: `${prefix}${classElement.textContent}${suffix}`.replace(new RegExp(searchTerm, 'gi'), replaceTerm)
        };
    });

    // Make an AJAX call to update classes
    fetch('/wp-admin/admin-ajax.php?action=update_classes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classes: classesToUpdate }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Classes updated successfully:', data);
                // Optionally refresh the classes list or show a success message
            } else {
                console.error('Error updating classes:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}