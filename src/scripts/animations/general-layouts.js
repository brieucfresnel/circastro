import gsap from 'gsap';
import SplitText from "gsap/SplitText";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function generalLayoutAnims() {

    const layoutClass = '.f-layout';
    const layouts = document.querySelectorAll(layoutClass);

    if (!layouts) return;
    if (!document.querySelector(`.f-layout`)) return;

    gsap.utils.toArray(layoutClass).forEach(layout => {

        const splitHeading1 = new SplitText(layout.querySelector(`${layoutClass} .f-layout__title`), {
            type: 'words'
        })

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: layout.querySelector(`${layoutClass} .l-container`),
                start: "top 85%",
                toggleActions: "play none play none"
                // markers: true
            }
        });
        let delay = 0; // initial delay value, incremented for each element

        tl.add(function () {
            layout.classList.add("is-inview");
        }, delay);
        delay += 0;

        if (layout.querySelector(`${layoutClass}__deco`)) {
            tl.add(function () {
                layout.querySelector(`${layoutClass}__deco`).classList.add("is-inview");
            }, delay);
            delay += 0;
        }

        if (layout.querySelector(`${layoutClass} .f-layout__title`)) {
            tl.add(function () {
                layout.querySelector(`${layoutClass} .f-layout__title`).classList.add("is-inview");
            }, delay);
            delay += 0.25;
        }

        if (layout.querySelector(`${layoutClass} .f-layout__title-en`)) {
            tl.add(function () {
                layout.querySelector(`${layoutClass} .f-layout__title-en`).classList.add("is-inview");
            }, delay);
            delay += 0.25;
        }

        if (layout.querySelector(`${layoutClass} .f-layout__introduction`)) {
            tl.add(function () {
                layout.querySelector(`${layoutClass} .f-layout__introduction`).classList.add("is-inview");
            }, delay);
            delay += 0.25;
        }

        if (layout.querySelector(`${layoutClass} .f-layout__introduction-en`)) {
            tl.add(function () {
                layout.querySelector(`${layoutClass} .f-layout__introduction-en`).classList.add("is-inview");
            }, delay);
            delay += 0.25;
        }

    })

    //reset ScrollTrigger in case of reload;
    ScrollTrigger.clearScrollMemory();
    window.history.scrollRestoration = "manual";
}

export {
    generalLayoutAnims
}

export default function () { }