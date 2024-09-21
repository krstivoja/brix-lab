function initTest() {
    console.log('in-brick-editor.js loaded');

    const brxBody = document.querySelector('.brx-body');
    if (!brxBody) {
        console.error('brx-body element not found');
        return;
    }

    // Use a timeout to allow Vue to initialize
    setTimeout(() => {
        if (brxBody.__vue_app__) {
            const vueApp = brxBody.__vue_app__.config.globalProperties;
            console.log(vueApp);
        } else {
            console.error('__vue_app__ is not defined on brx-body');
        }
    }, 100); // Adjust the timeout as necessary
}

document.addEventListener('DOMContentLoaded', initTest);