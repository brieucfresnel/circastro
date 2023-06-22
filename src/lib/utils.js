import gsap from "gsap";

export const uid = () =>
    String(
        Date.now().toString(32) +
        Math.random().toString(16)
    ).replace(/\./g, '')

export function animatefromAuto($element, height, duration = 0.3, ease = 'power4.inOut') {
    $element.style.height = 'auto';
    const autoHeight = $element.offsetHeight;

    return gsap.fromTo($element, {
        height: autoHeight,
    }, {
        height,
        ease,
        duration,
    });
}

export function animatefromAutoToZero($element, duration = 0.85, ease = 'power4.inOut') {
    return animatefromAuto($element, 0, duration, ease);
}

export function animatefromZeroToAuto($element, duration = 0.85, ease = 'power4.inOut') {
    const curHeight = $element.offsetHeight;
    $element.style.height = 'auto';
    const autoHeight = $element.offsetHeight;
    $element.style.height = curHeight;

    return gsap.fromTo($element, {
        height: 0,
    }, {
        height: autoHeight,
        ease,
        duration,
        onComplete: () => {
            $element.style.height = 'auto';
        },
    });
}