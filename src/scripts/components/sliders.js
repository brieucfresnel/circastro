const $ = jQuery;

class SlickSlider {
    constructor(layoutSlug, config) {
        this.sliders = [];
        this.layoutSlug = layoutSlug;
        this.config = config;
    }

    init() {

        this.reset();

        const layoutSlug = this.layoutSlug;
        const layoutClass = '.' + this.layoutSlug;

        $(layoutClass + ':not(.is-preview)').each((index, layout) => {
            const layoutId = '#' + layout.id;

            const sliderSelector = `${layoutId} ${layoutClass}__slider`;
            const prevButtonSelector = `${layoutId} .btn-prev`;
            const nextButtonSelector = `${layoutId} .btn-next`;

            const $slider = $(sliderSelector);

            if (!$slider.length) return;

            $slider.not('.slick-initialized').slick({
                ...this.config,
                prevArrow: prevButtonSelector,
                nextArrow: nextButtonSelector,
            });

            const totalSlidesElem = $(layoutId).find('.total-slides');
            const pagesCount = $(layoutId).find('.slick-dots li').length;

            totalSlidesElem.text(pagesCount);

            $slider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
                let indexElem = $(layoutId).find('.current-index');
                indexElem.text(currentSlide + 1);
            });


            if (layoutSlug === 'f-slider-grid' || layoutSlug === 'f-slider-image-text-content' || layoutSlug === 'f-images-slider' || layoutSlug === 'f-slider-image-text') {
                defaultImagesSlider(layoutSlug);
            }
        });
    };

    reset() {
        jQuery(($) => {
            this.sliders.forEach(slider => $(slider).slick('unslick'))
            this.sliders = [];
        })
    };
}

export default SlickSlider;
