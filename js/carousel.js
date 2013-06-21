function setupCarousels() {
    
    $(document).find('ul.carousel').each(function(){
        var container = $(this).parents('.carousel-container')
        
        var portview = $(this).parents('.carousel-portview');
        var portviewHeight = container.height();
        var portviewWidth = portview.width();
        
        var slides = $(this).find('li.slide');
        var slidesCount = slides.length;
        
        var carousel = $(this);
        var carouselWidth = slidesCount * portviewWidth;
        
        var slideNavigation = '';
        var arrows = '<a class="js-carouselArrow js-disabled js-prev" href="#"></a><a class="js-carouselArrow js-next" href="#"></a>';
        var slideSelectors = '<ul class="js-slideSelectors">';
        
        var slideNumner = 1;
        // Variable for the slide selectors
        for( i=0; i<slidesCount; i++ )
        { 
            slideSelectors += '<li class="';
            
            if (i == 0)
            {
                slideSelectors += 'js-active ';
            }
            
            slideSelectors += 'js-slideSelector"><a href="slide' + slideNumner + '"></a></li>';
            slideNumner += 1;
        }
        
        slideSelectors += '</ul>';
        
        /* ************************************************************************ */
        // 1. SET DIMENSIONS AND LABEL
        /* ************************************************************************ */
        
        // set height and width to the portview
        portview.css({
            'height': portviewHeight,
            'width': portviewWidth
        });
        
        
        carousel.css('width', carouselWidth);
        
        // label each slide
        // set height and width to the slides
        slides.each(function(){
            var index = $(this).index() + 1;
            $(this)
            .addClass('slide' + index)
            .css({
                'height': portviewHeight,
                'width': portviewWidth
            });
            
            if( index == 1) {
                $(this).addClass('js-active');
            }
            
        });
        
        
        /* ************************************************************************ */
        // 2. SETUP CAROUSEL NAVIGATION
        /* ************************************************************************ */
        
        // if the carousel has the class arrows, add navigation arrows to the container
        if( container.hasClass('carousel-arrows') )
        {
            slideNavigation += arrows;
        }
        
        // if the carousel has the class slideSelectors, add slide selectors to the container
        if( container.hasClass('carousel-slideSelectors') )
        {
            slideNavigation += slideSelectors;
        }
        
        // Add the slide selectors to the carousel
        container.append(slideNavigation);
        
    });
}

function carouselListeners() {
    listenerCarouselArrows();
    listenerCarouselSlideSelector();
}


function listenerCarouselArrows() {
    $(document).on('click', '.js-carouselArrow', function(){
        var container           = $(this).parents('.carousel-container');
        var portview            = container.find('.carousel-portview');
        var carousel            = container.find('.carousel');
        var id                  = carousel.attr('id');
        var carouselWidth       = portview.width();
        
        var currentSlide        = container.find('li.slide.js-active');
        var newSlideIndex       = currentSlide.index();
        var newLeftValue;
        
        // if the button isn't disabled, continue
        if(! $(this).hasClass('js-disabled') )
        {
            
            
            disableCarouselNavigation(container);
            
            // if user clicks the previous button
            if( $(this).hasClass('js-prev') )
            {
                newSlideIndex -= 1 ;
            }
            // if user clicks the next button
            else
            {
                newSlideIndex += 1;
            }
            newLeftValue = newSlideIndex * carouselWidth;
            animateCarousel(id, newLeftValue, newSlideIndex);
        }
    });
}

function listenerCarouselSlideSelector() {
    
    $(document).on('click', '.js-slideSelector a', function(event){        
        event.preventDefault();
        
        var container = $(this).parents('.carousel-container');
        var carousel = container.find('.carousel');
        var id = carousel.attr('id');
        
        var portview = container.find('.carousel-portview');
        var portviewWidth = portview.width();
        
        var parent = $(this).parents('.js-slideSelector');
        var index = parent.index();
        
        var newSlideIndex = $(this).parents('li.js-slideSelector').index();
        
        var correspondingSlide = $(this).attr('href');
        
        
        disableCarouselNavigation(container);
        
        // if the selected slide selector is not the active button
        if(! parent.hasClass('js-active') )
        {
            
            var newLeftValue = index * portviewWidth;
            
            animateCarousel(id, newLeftValue, newSlideIndex);
            
            container.find('.js-active').each(function(){
                $(this).removeClass('js-active');
            });
            parent.addClass('js-active');
            
            container.find('.' + correspondingSlide).addClass('js-active');
        }
        
    });
}

function animateCarousel(id, newLeftValue, newSlideIndex) { 
    var carousel                = $('#' + id);
    var container               = carousel.parents('.carousel-container');
    
    disableCarouselNavigation(container);
    
    if (newLeftValue != 0 ) {
        newLeftValue = -Math.abs(newLeftValue);
    }
    
    carousel.animate({
        'left' : newLeftValue
    });
    
    enableCarouselNavigation(container, newSlideIndex);
}

function disableCarouselNavigation(container) {
        
    container.find('.js-carouselArrow, .js-slideSelector').each(function(){
        $(this).addClass('js-disabled');
    });
    
}

function enableCarouselNavigation(container, newSlideIndex) {
    newSlideIndex += 1;
    
    var prev            = container.find('.js-prev');
    var next            = container.find('.js-next');
    var slideSelectors  = container.find('.js-slideSelector');
    var maxLength       = container.find('li.slide').length;
    
    var currentSlide            = container.find('li.slide.js-active');
    var currentSlideSelector    = container.find('li.js-slideSelector.js-active');
    var newSlide                = container.find('li.slide:nth-child(' + newSlideIndex + ')');
    var newSlideSelector        = container.find('li.js-slideSelector:nth-child(' + newSlideIndex + ')');


    alert(newSlideIndex);
    
    // ADD THE ACTIVE STATE TO THE CORRECT ELEMENTS
    currentSlide.removeClass('js-active');
    currentSlideSelector.removeClass('js-active');
    newSlide.addClass('js-active');
    newSlideSelector.addClass('js-active');    
    
    // enable slide selectors
    slideSelectors.each(function(){
        $(this).removeClass('js-disabled');
    });
    
    // if this is not the first slide, enable the left arrow
    if( newSlideIndex > 1 )
    {
        
        prev.removeClass('js-disabled');
    }
    
    // if this is not the last slide, enable the right arrow
    if( newSlideIndex < maxLength )
    {
        next.removeClass('js-disabled');
    }
    
}