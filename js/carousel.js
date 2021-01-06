class Carousel {
    constructor({ imagePrefix, numImages }) {
        this.itemClassName = 'carousel-item';
        this.items = [];
        this.itemsSize = numImages;
        this.slide = 0;
        this.isTransitioning = false;

        const containerRef = document.getElementById('carousel');

        // add buttons
        const nextButton = document.createElement('div');
        nextButton.className = 'carousel-btn-next';
        containerRef.appendChild(nextButton);

        // add slides
        for (let i = 0; i < numImages; i++) {
            // create div
            const slide = document.createElement('div');
            // add className
            slide.className = this.itemClassName
            // add image as background
            slide.style.backgroundImage = `url('./${imagePrefix}${i}.jpg')`;
            // add slide to carousel
            containerRef.appendChild(slide);
            this.items.push(slide)
        }

        // set initial state (assume min of 3 images)
        this.items[0].className += ' active';
        this.items[1].className += ' next';
        this.items[numImages - 1].className += ' prev';

        this.setEventListeners();
    }
    setEventListeners() {
        const next = document.getElementsByClassName('carousel-btn-next')[0];
        next.addEventListener('click', this.nextSlide.bind(this));
    }
    disableCarousel() {
        this.isTransitioning = true;
        setTimeout(() => {
            this.isTransitioning = false;
        }, 2100);
    }
    jsMod(x, y) {
        return ((x % y) + y) % y;
    }
    transitionTo(slideToTransition) {
        if (this.isTransitioning) return;

        this.disableCarousel();

        // Reset old next/prev elements to default classes
        const oldClasses = [
            ...document.querySelectorAll('.carousel-item.prev'),
            ...document.querySelectorAll('.carousel-item.next'),
        ]
        oldClasses.forEach(item => item.className = this.itemClassName)


        // Set new classes
        this.items[this.jsMod(slideToTransition - 1, this.itemsSize)].className = this.itemClassName + ' prev';
        this.items[slideToTransition].className = this.itemClassName + ' active';
        this.items[this.jsMod(slideToTransition + 1, this.itemsSize)].className = this.itemClassName + ' next';
    }
    nextSlide() {
        if (this.isTransitioning) return;

        // compute next slide
        const newSlide = this.jsMod(this.slide + 1, this.itemsSize);

        this.transitionTo(newSlide);
        this.slide = newSlide;
    }
    prevSlide() {
        if (this.isTransitioning) return;

        //compute prev slide
        const newSlide = this.jsMod(this.slide - 1, this.itemsSize);

        this.transitionTo(newSlide);
        this.slide = newSlide;
    }
}

const options = {
    imagePrefix: 'assets/img-',
    numImages: 3,
}

let carousel;
carousel = new Carousel(options);

