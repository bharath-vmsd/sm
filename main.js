import { StoreScene } from './StoreScene.js';
import { StorefrontBuilder } from './StorefrontBuilder.js';
import { SignageBuilder } from './SignageBuilder.js';

document.addEventListener('DOMContentLoaded', () => {
    const storeScene = new StoreScene('hero-section');
    const scene = storeScene.getScene();

    const storefrontBuilder = new StorefrontBuilder(scene);
    storefrontBuilder.build();

    const signageBuilder = new SignageBuilder(scene);
    signageBuilder.build();

    // Keyboard shortcuts for navigation
    document.addEventListener('keydown', (event) => {
        let targetUrl = '';
        switch (event.key) {
            case '1':
                targetUrl = './Assesment/adayar/';
                break;
            case '2':
                targetUrl = './Assesment/adayar2/';
                break;
            case '3':
                targetUrl = './Assesment/besant-nagar/';
                break;
            case '4':
                targetUrl = './Assesment/mudichur/';
                break;
            case '5':
                targetUrl = './Assesment/manivakkam/';
                break;
            case '6':
                targetUrl = './Assesment/entrance/';
                break;
            case '7':
                targetUrl = './Assesment/sunglass/';
                break;
            case '8':
                targetUrl = './Assesment/logistics/';
                break;
        }

        if (targetUrl) {
            window.location.href = targetUrl;
        }
    });
});