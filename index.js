import AnimationController from './controller/animation-controller.js';

const canvas = document.querySelector('canvas');

const animationController = new AnimationController(canvas);
animationController.animate();