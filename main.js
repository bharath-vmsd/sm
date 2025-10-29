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
});