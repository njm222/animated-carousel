import vs from './vertex-shader.js';
import fs from './fragment-shader.js';

class Carousel {
    constructor({} = {}) {
        // setup variables
        this.initVariables();
        // setupScene
        this.setup();
    }
    setup() {
        // wait for everything to be ready
        window.addEventListener('load', () => this.setupScene());
    }
    destroy(curtains) {
        curtains.dispose()
    }
    initVariables() {
        // get the plane element
        this.planeElements = document.getElementsByClassName('plane') || [];
        // set the number of textures
        this.maxTextures = this.planeElements[0].getElementsByClassName('carousel-item').length - 1 || [];
        this.activeTextureIndex = 0;
        this.nextTextureIndex = 1;
        this.isChanging = false;
        this.transitionTimer = 0;
    }
    setupScene() {
        this.initVariables()

        // set up our WebGL context and append the canvas to our wrapper
        const curtains = new Curtains({
            container: document.getElementById('carousel'),
            watchScroll: false, // no need to listen for the scroll in this example
            pixelRatio: Math.min(1.5, window.devicePixelRatio) // limit pixel ratio for performance
        });

        // handle errors
        curtains
            .onError((error) => this.handleCurtainsErrors(error))
            .onContextLost(() => this.handleCurtainsContextLost(curtains));

        // temp disable drawing
        curtains.disableDrawing();

        // plane parameters
        const params = {
            vertexShader: vs,
            fragmentShader: fs,
            uniforms: {
                time: {
                    name: "uTime",
                    type: "1f",
                    value: 0,
                },
                pi: {
                    name: "PI",
                    type: "1f",
                    value: Math.PI,
                },
            },
        };

        // init plane
        const carouselPlane = new Plane(curtains, this.planeElements[0], params);

        // assign active texture
        const activeTex = carouselPlane.textures[this.activeTextureIndex];
        activeTex._samplerName = 'activeTex'

        // assign next texture
        const nextTex = carouselPlane.textures[this.nextTextureIndex];
        nextTex._samplerName = 'nextTex'

        carouselPlane.onLoading((texture) => {
            // improve texture rendering on small screens with LINEAR_MIPMAP_NEAREST minFilter
            texture.setMinFilter(curtains.gl.LINEAR_MIPMAP_NEAREST);
        }).onReady(() => {
            // add listener for click on plane
            this.planeElements[0].addEventListener(
                "click",
                () => this.handleTransition(curtains, carouselPlane, nextTex, activeTex)
            );

        }).onRender(() => this.handleIncrement(carouselPlane));
    }
    handleCurtainsErrors(error) {
        alert(`There was an error: ${error}`);
    }
    handleCurtainsContextLost(curtains) {
        curtains.restoreContext();
    }
    handleIncrement(carouselPlane) {
        // increase the carousel's transition timer
        if (this.isChanging) {
            this.transitionTimer += 0.02;
        }
        // update our time uniform
        carouselPlane.uniforms.time.value = this.transitionTimer;
    }
    handleTransition(curtains, carouselPlane, nextTex, activeTex) {
        if(!this.isChanging) {
            console.log('click');
            // enable drawing temporarily
            curtains.enableDrawing();

            this.isChanging = true;

            // check what the next image will be
            if(this.activeTextureIndex < this.maxTextures) {
                this.nextTextureIndex = this.activeTextureIndex + 1;
            }
            else {
                this.nextTextureIndex = 0;
            }

            // apply it to the next texture
            nextTex.setSource(carouselPlane.images[this.nextTextureIndex]);

            setTimeout(() => {
                // disable drawing now, the transition is over
                curtains.disableDrawing();

                this.isChanging = false;
                this.activeTextureIndex = this.nextTextureIndex;
                // the next texture becomes the active texture
                activeTex.setSource(carouselPlane.images[this.activeTextureIndex]);
                // reset timer
                this.transitionTimer = 0;

            }, 2100); // add a bit of margin to the timer
        }
    }
}

export default Carousel;

