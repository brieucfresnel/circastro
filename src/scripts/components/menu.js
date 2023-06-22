function Menu() {
    const navbar = document.querySelector('#navbar')
    const toggleButton = document.querySelector('#navbar-toggle')
    let allowSwitchFromScroll = true;

    if (!navbar || !toggleButton) return

    toggleButton.addEventListener('click', toggle)

    document.addEventListener('scroll', switchLayoutOnScroll)

    navbar.addEventListener('mouseover', setHoverLayout)

    navbar.addEventListener('mouseout', resetLayoutAfterHover)

    function toggle() {
        if (navbar.dataset.isOpen) {
            delete navbar.dataset.isOpen
        } else {
            navbar.dataset.isOpen = 'true'
        }

        document.documentElement.classList.toggle('noscroll')
    }

    function switchLayoutOnScroll() {

        // Allow switch from scroll if user scrolled up to 0 without condensing navbar
        if (navbar.classList.contains('is-hover') && window.scrollY === 0) {
            navbar.classList.remove('is-hover')
            allowSwitchFromScroll = true
        }

        if (!allowSwitchFromScroll) return

        if (window.scrollY > 0 && !navbar.classList.contains('is-condensed')) {
            navbar.classList.add('is-condensed')
        }

        if (window.scrollY === 0 && navbar.classList.contains('is-condensed')) {
            navbar.classList.remove('is-condensed')
        }
    }

    function setHoverLayout() {
        if (window.scrollY === 0) return

        allowSwitchFromScroll = false

        if (navbar.classList.contains('is-condensed')) {
            navbar.classList.remove('is-condensed')
            navbar.classList.add('is-hover')
        }
    }

    function resetLayoutAfterHover() {
        if (window.scrollY === 0) return

        if (!navbar.classList.contains('is-condensed')) {
            navbar.classList.add('is-condensed')
            navbar.classList.remove('is-hover')

            allowSwitchFromScroll = true
        }
    }
}

export default Menu;
