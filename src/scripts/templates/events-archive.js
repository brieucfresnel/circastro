import { FiltersBar } from "../components/filters-bar";
import { EventsSearchForm } from "../components/events-search-form";
import { EventsArchiveMonthsNavbar } from "../../../dotstarter/components/months-navbar/months-navbar";
import { defaultEventArchive } from "../../../dotstarter/components/month-events-grid/month-events-grid";

const VIEW_MONTHS = 0;
const VIEW_GRID = 1;
const MONTHNAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class EventsArchiveManager {
    constructor() {
        this.rootElement = document.querySelector('#events-archive');

        if (!this.rootElement) return;

        this.isLoading = false;
        this.isFullyLoaded = false;

        this.viewMode = VIEW_MONTHS;
        this.rootElement.classList.add('view-months');

        // Get required DOM elements
        this.eventsContainerSelector = '.t-events-archive__months';
        this.eventsContainer = this.rootElement.querySelector(this.eventsContainerSelector);
        this.loader = this.rootElement.querySelector('#loader');

        // Create Filters Bar
        let filtersBarElem = document.querySelector('#events-filters-bar');

        this.filtersBar = new FiltersBar(filtersBarElem);

        filtersBarElem.addEventListener('reset-filters', this.reset.bind(this, true, true));
        filtersBarElem.addEventListener('apply-filters', () => {
            this.reset();
            this.setViewMode(VIEW_GRID);
            this.loadEvents();
        });

        // Create months navbar
        this.monthsNavbar = new EventsArchiveMonthsNavbar(this);

        // Create Search Form
        const searchFormElem = document.querySelector('#events-search-form');
        this.searchForm = new EventsSearchForm(searchFormElem, this.filtersBar.resetAndNotifyArchive.bind(this.filtersBar));
        searchFormElem.addEventListener('search', this.prepareDOMForSearch.bind(this, true));
        searchFormElem.addEventListener('searched', this.renderSearchResults.bind(this));


        // Setup time vars
        // Timestamp will be used to load month view
        let date = new Date();

        this.initialDateIntervalStart = new Date(date.getFullYear(), date.getMonth(), 1, 1);
        this.dateIntervalStart = new Date(this.initialDateIntervalStart.getTime());

        // Keep track of already loaded months
        this.loadedMonths = [];

        // Offset is used to paginate (offset param of WP_Query)
        this.offset = 0;

        // Create custom events
        this.loadNextMonthEvent = new Event('load-month');
        this.loadedNextMonthEvent = new Event('month-loaded');
        this.loadEventsEvent = new Event('load-events');
        this.loadedEventsEvent = new Event('loaded-events');

        // Create main observer
        this.createLoadMoreIntersectionObserver();

        // Initial load : use url params or load 2 months
        const initialFilters = this.filtersBar.getSelectionFromCurrentUrl();

        if (initialFilters.length) {
            this.setViewMode(VIEW_GRID);
            this.loadEvents();
        }

        // Create main observer
        this.loadEvents(2);
    }

    /**
     * Load next events according to view mode 
     * 
     * @param {int} monthsToLoad 
     * @returns 
     */
    async loadEvents(monthsToLoad = 1) {
        if (this.isLoading) return;
        this.setIsLoading(true);
        this.rootElement.dispatchEvent(this.loadEventsEvent);

        const ajaxUrl = ajaxConfig?.ajaxUrl;
        let action;
        let data;

        switch (this.viewMode) {
            case VIEW_MONTHS:
                // Get timestamps
                action = 'load_events_archive_next_month';

                data = {
                    intervalStart: this.dateIntervalStart.toDateString(), // Convert time to PHP timestamp
                    monthsToLoadCount: monthsToLoad
                }

                // Dispatch load next month event
                this.rootElement.dispatchEvent(this.loadNextMonthEvent);

                break;
            case VIEW_GRID:
                // Get selected terms
                action = 'load_events_archive_next_page';

                const taxQueryParams = this.filtersBar.getSelection();
                data = {
                    taxQueryParams,
                    offset: this.offset
                };

                break;
        }

        // Set params 
        const params = {
            action,
            data: JSON.stringify(data)
        }

        // Run ajax request
        fetch(ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache',
            },
            body: new URLSearchParams(params)
        })
            .then(res => res.json())
            .then(response => {
                if (!response.success) {
                    // Do something
                }

                const data = response.data;

                // Get HTML and append it to events container
                if (data?.html) {
                    this.eventsContainer.innerHTML += response.data?.html;
                }

                if (this.viewMode === VIEW_MONTHS) {

                    // Add loaded months

                    const months = [];
                    for (let i = 0; i < monthsToLoad; i++) {
                        const tmpDate = new Date(this.dateIntervalStart);
                        tmpDate.setMonth(tmpDate.getMonth() + i);
                        months.push(tmpDate);
                    }

                    this.loadedMonths = [...this.loadedMonths, ...months];

                    this.dateIntervalStart.setMonth(this.dateIntervalStart.getMonth() + monthsToLoad);

                    if (data.found_posts) {
                        this.foundPosts = data.found_posts;
                    }

                    this.rootElement.dispatchEvent(this.loadedNextMonthEvent);
                }

                else if (this.viewMode === VIEW_GRID) {
                    this.offset = response.data?.offset;

                    if (this.offset >= response.data?.found_posts) {
                        this.isFullyLoaded = true;
                    }
                }

                this.setIsLoading(false);
                const myMonth = MONTHNAMES[this.dateIntervalStart.getMonth() - 1] + '-' + this.dateIntervalStart.getFullYear();
                new defaultEventArchive(myMonth);
                return data;
            }).finally(() => {

                if (this.viewMode === VIEW_MONTHS) {
                    this.rootElement.dispatchEvent(this.loadedNextMonthEvent);
                }

                this.rootElement.dispatchEvent(this.loadedEventsEvent);
            })
    }

    reset(resetView = false, loadEvents = false) {
        // Reset local progression variables
        this.offset = 0;
        this.isFullyLoaded = false;

        this.dateIntervalStart = new Date(this.initialDateIntervalStart.getTime());

        // Empty events HTML
        this.eventsContainer.innerHTML = '';

        if (resetView) {
            this.setViewMode(VIEW_MONTHS);
        }

        if (loadEvents) {
            this.loadEvents(2);
        }
    }

    setViewMode(viewMode) {
        this.viewMode = viewMode;
        this.rootElement.classList.remove('view-grid', 'view-months');

        if (viewMode === VIEW_GRID) {
            this.rootElement.classList.add('view-grid');
        } else if (viewMode === VIEW_MONTHS) {
            this.rootElement.classList.add('view-months');
        }

    }

    /**
    * Setup intersection observer to run loadEvents on scroll to #events-end div
    */
    createLoadMoreIntersectionObserver() {
        const intersectionObserver = new IntersectionObserver((entries) => {
            const isIntersecting = entries[0]?.isIntersecting ?? false;

            if (isIntersecting && !this.isLoading && !this.isFullyLoaded) {
                this.loadEvents();
            }

        }, { rootMargin: "0px 0px -200px 0px" }); // Will trigger when scroll is 100px before observed element

        intersectionObserver.observe(document.querySelector('#events-end'));
    }

    /**
     * Clear events grid HTML
     */
    clearHtml() {
        this.eventsContainer.innerHTML = '';
    }

    prepareDOMForSearch() {
        this.reset();
        this.setViewMode(VIEW_GRID);
        this.filtersBar.resetFilters();
        this.setIsLoading(true);
    }

    renderSearchResults() {
        const searchResults = this.searchForm.getSearchResults();
        this.eventsContainer.innerHTML += searchResults;

        this.isFullyLoaded = true;
        this.setIsLoading(false);
    }

    /**
     * set isLoading & toggle loader element display
     * */
    setIsLoading(value) {
        if (value === true) {
            this.loader.classList.add('show');
            this.isLoading = true;
        } else {
            this.loader.classList.remove('show');
            this.isLoading = false;
        }
    }

    /**
     * 
     * @param {Date} date 
     */
    isMonthLoaded(date) {
        const minTime = this.loadedMonths[0].getTime();
        const maxTime = this.loadedMonths[this.loadedMonths.length - 1].getTime();

        const found = (minTime <= date.getTime() && date.getTime() <= maxTime);

        return found;
    }

    getWrapper() {
        return this.rootElement;
    }
}

export { EventsArchiveManager };
