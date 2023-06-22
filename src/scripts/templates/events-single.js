import Slider from "../components/sliders";
import gsap from 'gsap';
import SplitText from "gsap/SplitText";

import {
    gsapContentCards
} from "../../../assets/js/animations/text.js";

const SingleEventsSlider = new Slider('t-events-single-slider', {
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: false,
    variableHeight: true,
    dots: true
});

const SingleEventsContactSlider = new Slider('c-events-single-contact', {
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    variableHeight: false,
    mobileFirst: true,
    centerMode: false,
    swipe: true,
    dots: true,
    responsive: [
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 2
            }
        }
    ]
});

function headerEventsSingleAnims() {
    const layoutClass = '.t-events-single-header';
    const layouts = document.querySelectorAll(layoutClass);

    if (!layouts) return;
    if (!document.querySelector(`.t-events-single-header`)) return;

    gsap.utils.toArray(layoutClass).forEach(layout => {
        const splitTitle = new SplitText(document.querySelector(`${layoutClass}__title`), {
            type: 'words'
        })

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: layout.querySelector(`${layoutClass} .l-container`),
                start: "top 80%",
                // markers: true
            }
        });

        let delay = 0; // initial delay value, incremented for each element
        if (layout.querySelector(`${layoutClass} .heading1`)) {
            tl.add(function () {
                layout.querySelector(`${layoutClass} .heading1`).classList.add("is-inview");
            }, delay);
            delay += 0.1;
        }

        if (layout.querySelector(`${layoutClass} .t-events-single-slider`)) {
            tl.add(function () {
                layout.querySelector(`${layoutClass} .t-events-single-slider`).classList.add("is-inview");
            }, delay);
            delay += 0;
        }

        if (layout.querySelector(`${layoutClass}__deco`)) {
            tl.add(function () {
                layout.querySelector(`${layoutClass}__deco`).classList.add("is-inview");
            }, delay);
            delay += 0.1;
        }

        if (layout.querySelector(`${layoutClass}__performer`)) {
            tl.add(function () {
                layout.querySelector(`${layoutClass}__performer`).classList.add("is-inview");
            }, delay);
            delay += 0.1;
        }

        if (layout.querySelectorAll(`${layoutClass}__column > div`)) {

            let dropdownslistItems = layout.querySelectorAll(`${layoutClass}__column > div`);

            dropdownslistItems.forEach((dropdownslistItem) => {
                tl.add(function () {
                    dropdownslistItem.classList.add("is-inview");
                }, delay);
                delay += 0.1;
            });
        }
    })
}

function relatedEventsSingleAnims() {
    const layoutClass = '.c-events-single-related';
    const layouts = document.querySelectorAll(layoutClass);

    if (!layouts) return;
    if (!document.querySelector(`.c-events-single-related`)) return;

    gsap.utils.toArray(layoutClass).forEach(layout => {

        const splitTitle = new SplitText(document.querySelector(`${layoutClass}__title`), {
            type: 'words'
        })

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: layout.querySelector(`${layoutClass} .l-container`),
                start: "top 80%",
                // markers: true
            }
        });

        let delay = 0; // initial delay value, incremented for each element
        if (layout.querySelector(`${layoutClass}__title`)) {
            tl.add(function () {
                layout.querySelector(`${layoutClass}__title`).classList.add("is-inview");
            }, delay);
            delay += 0.1;
        }

        if (layout.querySelector(`${layoutClass} .c-event-card`)) {
            tl.from(layout.querySelectorAll(`${layoutClass} .c-event-card`), gsapContentCards, ">+=30%")
        }
    })
}


export { SingleEventsSlider, SingleEventsContactSlider, headerEventsSingleAnims, relatedEventsSingleAnims };