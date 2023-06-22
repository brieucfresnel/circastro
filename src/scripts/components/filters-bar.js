import MultipleTermsSelector from "./multiple-terms-selector";

class FiltersBar {
    constructor(rootElem) {
        // Elements
        this.rootElem = rootElem;

        if (!this.rootElem) return;

        this.termSelectorElems = this.rootElem.querySelectorAll('.c-multi-terms-selector');
        this.tagsContainer = this.rootElem.querySelector('#selected-terms-pills');
        this.resetButton = this.rootElem.querySelector('#reset-filters');

        if (!this.termSelectorElems) {
            console.error('Events Filters Bar - error : missing terms selectors');
            return;
        }

        // Data
        this.termSelectors = [];
        this.tagElems = [];

        // Load UI
        this.createTermSelectors();

        // Custom events
        this.applyEvent = new Event('apply-filters');
        this.resetEvent = new Event('reset-filters');

        // Set listeners
        this.resetButton.addEventListener('click', this.resetAndNotifyArchive.bind(this));

        this.archiveElem = document.querySelector('#events-archive');

        this.archiveElem.addEventListener('load-events', () => {
            this.isLoading = true;
        });

        this.archiveElem.addEventListener('loaded-events', () => {
            this.isLoading = false;
            this.renderPills();
            this.toggleResetButton();
        });

    }

    // Set term selectors event listeners
    createTermSelectors() {
        this.termSelectorElems.forEach(elem => {
            elem.addEventListener('apply-selection', this.applyFilters.bind(this), false);

            this.termSelectors.push(new MultipleTermsSelector(elem));
        })
    }

    toggleResetButton() {
        if (this.tagElems.length === 0) {
            if (this.resetButton.classList.contains('show')) {
                this.resetButton.classList.remove('show');
            }
        } else {
            if (!this.resetButton.classList.contains('show')) {
                this.resetButton.classList.add('show');
            }
        }
    }

    applyFilters() {
        this.setUrlParams();
        this.rootElem.dispatchEvent(this.applyEvent);
    }

    setUrlParams() {
        const selection = this.getSelection();
        const categoriesSelection = selection.find(selection => selection.taxonomy === 'tribe_events_cat');
        const disciplinesSelection = selection.find(selection => selection.taxonomy === 'discipline');

        const urlParamsParts = [];

        if (categoriesSelection) {
            urlParamsParts.push('categories=' + categoriesSelection.terms.join(','));
        }

        if (disciplinesSelection) {
            urlParamsParts.push('disciplines=' + disciplinesSelection.terms.join(','));
        }

        const urlParams = urlParamsParts.join('&');

        window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${urlParams}`));
        console.log(urlParams);
    }

    resetFilters() {
        this.termSelectors.forEach(selector => {
            selector.resetSelection()
            selector.setApplyButtonState();
        });

        // Remove term pills
        this.tagElems.forEach(pill => {
            pill.parentNode.removeChild(pill);
        })

        this.tagElems = [];

        window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}`));
    }

    resetAndNotifyArchive() {
        if (this.isLoading) return;
        this.resetFilters();
        this.rootElem.dispatchEvent(this.resetEvent);
    }

    /**
     * Displays the selected terms as pills on the filters bar
     */
    renderPills() {
        this.tagsContainer.innerHTML = '';
        const tagElems = [];

        this.termSelectors.forEach(selector => {
            const terms = selector.fetchSelected();

            terms.forEach(term => {
                const element = document.createElement('li');

                element.dataset.id = term.id;
                element.classList.add('c-tag', 'c-tag--black');
                element.innerHTML = `${term.label}<svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2188_14388)"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.87998 2.17298L6.55679 5.49617L9.88329 8.82267C10.5841 7.89959 11 6.74836 11 5.5C11 4.24967 10.5828 3.0968 9.87998 2.17298ZM8.81827 1.11338L5.49613 4.43551L2.17733 1.11671C3.10041 0.415907 4.25164 0 5.5 0C6.74638 0 7.89593 0.414587 8.81827 1.11338ZM1.11668 2.17738C0.415892 3.10045 0 4.25166 0 5.5C0 6.74638 0.414587 7.89593 1.11338 8.81827L4.43547 5.49617L1.11668 2.17738ZM2.17298 9.87998C3.0968 10.5828 4.24967 11 5.5 11C6.74834 11 7.89955 10.5841 8.82262 9.88332L5.49613 6.55683L2.17298 9.87998Z" fill="black"></path></g><defs><clipPath id="clip0_2188_14388"><rect width="11" height="11" rx="5.5" fill="white"></rect></clipPath></defs></svg>`;

                element.addEventListener('click', (e) => this.toggleTerm(e, selector), { once: true })
                this.tagsContainer.appendChild(element);

                tagElems.push(element);
            })
        })

        this.tagElems = tagElems;
    }

    toggleTerm(e, selector) {
        if (this.isLoading) return;
        // Remove tag from DOM
        const tagElem = e.target;

        // Remove from array
        this.tagElems = this.tagElems.filter(pill => pill !== tagElem);

        // Remove DOM Element
        tagElem.parentNode.removeChild(tagElem);

        // Set selected to false
        const termId = e.target.dataset.id;
        selector.toggleTerm(termId);

        // Send event

        if (this.tagElems.length === 0) {
            this.rootElem.dispatchEvent(this.resetEvent);
            return;
        }

        this.setUrlParams();
        this.rootElem.dispatchEvent(this.applyEvent);
    }

    getTermSelectors() {
        return this.termSelectors;
    }

    getPills() {
        return this.tagElems;
    }

    getRootElem() {
        return this.rootElem;
    }

    getSelectionFromCurrentUrl() {
        const selection = [];
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const categories = urlParams.get('categories') ? urlParams.get('categories').split(',') : [];
        const disciplines = urlParams.get('disciplines') ? urlParams.get('disciplines').split(',') : [];

        if (categories.length) {
            selection.push({
                taxonomy: "tribe_events_cat",
                terms: categories
            })
        }

        if (disciplines.length) {
            selection.push({
                taxonomy: "discipline",
                terms: disciplines
            })
        }

        this.setSelected(selection);
        return selection;
    }

    setSelected(selection) {
        selection.forEach(tax => {
            const taxonomy = tax.taxonomy;
            const terms = tax.terms;

            const selector = this.termSelectors.find(selector => selector.taxonomy === taxonomy);

            if (!selector) return;

            terms.forEach(term => {
                const termEl = Array.from(selector.options).find(option => option.dataset.slug === term);

                if (!termEl) return;

                termEl.dataset.selected = true;
                // const termEl = Array.from(options).find(option => option.dataset.slug === term.slug);
                // termEl.dataset.selected = true;
            })

            selector.fetchSelected();
            selector.setApplyButtonState();
        })
    }

    getSelection() {
        const selection = [];

        this.termSelectors.forEach(selector => {
            const taxonomy = selector.getTaxonomy();
            const terms = selector.fetchSelected().map(term => term.slug);

            if (terms.length === 0)
                return;

            selection.push({
                taxonomy,
                terms
            })
        })

        return selection;
    }
}

export { FiltersBar };