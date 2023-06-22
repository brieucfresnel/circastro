export {}; // Declare that this file is a module

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

let FB = window.gsap;
