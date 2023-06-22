function setIndexes() {
    const layouts = document.querySelectorAll('.f-layout');
    for (let i = 0; i < layouts.length; i++) {
        layouts[i].style.position = 'relative';
        layouts[i].style.zIndex = i;
    }
}