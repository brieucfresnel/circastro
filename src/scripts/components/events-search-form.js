class EventsSearchForm {
    constructor(rootElem, resetFunction) {
        if (!rootElem) {
            return;
        }

        this.resetFunction = resetFunction;

        // Elements
        this.rootElem = rootElem;
        this.inputElem = this.rootElem.querySelector('input[type="text"]');
        this.submitButtonElem = this.rootElem.querySelector('input[type="submit"]');

        // Internal vars 
        this.isSearching = false;

        // Custom events
        this.searchEvent = new Event('search');
        this.searchCompletedEvent = new Event('searched')

        // Listeners
        this.rootElem.addEventListener('submit', this.search.bind(this));
    }

    search(e) {
        e.preventDefault();

        if (this.isSearching)
            return;


        const ajaxUrl = ajaxConfig?.ajaxUrl;
        const action = 'search_for_events';
        const s = this.inputElem.value;

        if (s.length === 0) {
            this.resetFunction();
            return;
        }

        const params = {
            action,
            s
        }

        this.isSearching = true;
        this.rootElem.dispatchEvent(this.searchEvent);

        fetch(ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache',
            },
            body: new URLSearchParams(params)
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    this.searchResults = res.data;
                } else {
                    this.searchResults = `<p class="no-results">Aucun résultat pour cette recherche</p>`;
                }
            })
            .finally(() => {
                // Event : end search
                this.isSearching = false;
                this.rootElem.dispatchEvent(this.searchCompletedEvent);
            });

    }

    setIsSearching(isSearching) {
        this.isSearching = isSearching;
    }

    getIsSearching() {
        return this.isSearching;
    }

    getSearchResults() {
        return this.searchResults;
    }
}

export { EventsSearchForm }