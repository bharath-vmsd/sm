import { StoreScene } from './StoreScene.js';
import { StorefrontBuilder } from './StorefrontBuilder.js';
import { SignageBuilder } from './SignageBuilder.js';

document.addEventListener('DOMContentLoaded', () => {
    const storeScene = new StoreScene('hero-section');
    const scene = storeScene.getScene();

    const storefrontBuilder = new StorefrontBuilder(storeScene.getWorldGroup());
    storefrontBuilder.build();

    const signageBuilder = new SignageBuilder(storeScene.getWorldGroup());
    signageBuilder.build();

    const toastNotification = document.getElementById('toast-notification');

    function showToast(message) {
        toastNotification.textContent = message;
        toastNotification.classList.add('show');
        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 3000); // Hide after 3 seconds
    }

    // Keyboard shortcuts for navigation
    document.addEventListener('keydown', (event) => {
        let targetUrl = '';
        let pageName = '';
        switch (event.key) {
            case '1':
                targetUrl = './Assesment/adayar/';
                pageName = 'Adayar';
                break;
            case '2':
                targetUrl = './Assesment/adayar2/';
                pageName = 'Adayar 2';
                break;
            case '3':
                targetUrl = './Assesment/besant-nagar/';
                pageName = 'Besant Nagar';
                break;
            case '4':
                targetUrl = './Assesment/mudichur/';
                pageName = 'Mudichur';
                break;
            case '5':
                targetUrl = './Assesment/manivakkam/';
                pageName = 'Manivakkam';
                break;
            case '6':
                targetUrl = './Assesment/entrance/';
                pageName = 'Entrance';
                break;
            case '7':
                targetUrl = './Assesment/sunglass/';
                pageName = 'Sunglass';
                break;
            case '8':
                targetUrl = './Assesment/logistics/';
                pageName = 'Logistics';
                break;
            case '9':
                storeScene.rotateWorld();
                showToast('Rotating scene...');
                break;
        }

        if (targetUrl) {
            showToast(`Taking you to ${pageName} page...`);
            // Give a small delay for the toast to be visible before redirecting
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 500); // 0.5 second delay
        }
    });

    // Fullscreen toggle on Enter key press
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        }
    });
});