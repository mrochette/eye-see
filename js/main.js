/*************/
/* FUNCTIONS */
/*************/

//    SETUP WEB APP
function setInnerWrapperHeight() {
    var winHeight = $(document).height();
    var winWidth = $(document).width();
    var wrapperHeight = winHeight - 180;
    var innerWrapperHeight = winHeight - 211;
    var slideHeight = innerWrapperHeight - 20;
    var numberSlides = $('ul#slidesContainer li').length;
    var slidesContainerHeight = innerWrapperHeight * numberSlides;
        $('#mask').css({
        'height' : winHeight,
        'width' : winWidth
    });

    $('#wrapper').css('height', wrapperHeight);
    $('#innerWrapper').css('height', innerWrapperHeight);
    $('#slidesContainer').css('height', slidesContainerHeight);
        $('.slide').each(function(){
            $(this).css('height', slideHeight);
    });
    setupExercises();
    exerciseTriggers();
    loadRolladex();
}

//  LOAD WORDS IN ROLLADEX AND FUNCTIONNALITY
function loadRolladex() {
    var tmpWord;
    $.ajax({
        url: './documents/words.xml',
        type: 'GET', 
        dataType: 'xml',
        success: function(returnedXMLResponse){
            $(returnedXMLResponse).find('word').each(function(){
                tmpWord = $(this).text();
                $('#rouletteContainer').append('<li class="js-descriptiveWord">' + tmpWord + '</li>');
            })
        }  
    });
    
    roladexCarousel();
    //  WORD SELECTION FUNCTIONALITY
    selectWords();
}

//  MASK AND MODAL LOAD FUNCTION
function openModal(content) {    
    var winHeight = $(document).height();
    var winWidth = $(document).width();


    $('#dialog').html(content);

    var dialogHeight = $('#dialog').css('height').replace(/[^-\d\.]/g, '');
    var dialogWidth = $('#dialog').css('width').replace(/[^-\d\.]/g, '');


    if( dialogHeight > winHeight)
    {
        var dialogHeight =  winHeight - 300;

        $('#dialog img').css('height', dialogHeight);

    }
    else if( halfImgHeight > winWidth)
    {
        var dialogWidth =  winWidth - 300;

        $('#dialog img').css('width', dialogWidth);
    }
        
    var dialogHeight = $('#dialog').css('height').replace(/[^-\d\.]/g, '');
    var dialogWidth = $('#dialog').css('width').replace(/[^-\d\.]/g, '');

    var halfImgHeight = Math.round(dialogHeight/2);
    var halfImgWidth = Math.round(dialogWidth/2);
    var dialogTop = Math.abs(halfImgHeight) * -1;
    var dialogLeft = Math.abs(halfImgWidth) * -1;

    $('#dialog').css({
       'margin-left' : dialogLeft,
        'margin-top' : dialogTop
    });

    $('#mask, #dialog').fadeIn('fast');
}

//  MASK AND DIALOG CLOSE TRIGGER
function modalClose() {
    $('#mask, #dialog').click(function(){
        $('#mask, #dialog').fadeOut();
    });
}

function roladexCarousel() {
    $('#rouletteInnerWrapper .arrow').click(function() {
        var RC      = $('#rouletteContainer');
        var RIWH    = $('#rouletteInnerWrapper').height();
        var CWH     = RC.find('li:first-child').outerHeight() + 36; 
        var IV      = (CWH * 7) + 528;
        var NIV     = Math.abs(IV) * -1;        
        
        //  IF PRESSING THE UP ARROW
        if( $(this).attr('id') == 'roulette-up' )
        {
            var movedItems = RC.find('li:lt(7)');
            
            $('#rouletteContainer').animate({'top': NIV}, function(){
                $(this).css('top', '-528px').append(movedItems);
            });
            
        }
        
        //  IF PRESSING THE DOWN ARROW
        else
        {
            var movedItems = RC.find('li').slice(-7);
            
            $('#rouletteContainer').animate({'top': '0'}, function(){
                $(this).css('top', '-528px').prepend(movedItems);
            });
        }
            
        
    })
}

function selectWords() {
    $(document).on('click', '#rouletteContainer li', function(e) {       
        if( $(this).hasClass('chosenWord') )
        {
            $(this).removeClass('chosenWord');
        }
        else {
            if( $('.chosenWord').length > 4 )
            {
                alert('You have already picked 5 words.  Please de-select a word to choose this word.');
            }
            else
            {
                $(this).addClass('chosenWord');
            }
        }
    });
}

//  SETUP EXERCISE PAGES
function setupExercises() {

    //  LAYOUT THE CARROUSSELS
    $('li.exercise-slide').each(function() {
        var slideCount =  $(this).children('img[src$="-exercise.png"]').length;
        var exerciseQuestion = $(this).children('.exercise-question');
        var questionHeight = exerciseQuestion.height() + exerciseQuestion.css('margin-top') + exerciseQuestion.css('margin-bottom');
        var questionHeight = $(this).children('.exercise-question').height() + 60;
        var slideHeight = $(this).height() - questionHeight;
        var slideWidth = $(this).width();
        var innerCarousselWidth = slideWidth * slideCount;
        
        var maximgHeight = slideHeight - 115;

        $('img[src$="-exercise.png"]').each(function(){
            $(this).delay(300).css('max-height', maximgHeight);
        });

        if( $(this).children('img[src$="-exercise.png"]').length > 1 )
        {
            $(this).children('img[src$="-exercise.png"]').wrapAll('<div class="js-caroussel" style="height:' + slideHeight + 'px"><ul class="js-innerCaroussel" style="left: 0; height:' + slideHeight + 'px; width:'+ innerCarousselWidth +'px"></ul></div>').each(function(){               
                var imageWrapperWidth = $(this).css('width');
                $(this).wrap('<li class="js-carousselSlide" style="height:' + slideHeight + 'px"><div class="imageWrapper" style="width:' + imageWrapperWidth + '"></div></li>');
            });
        }
    });
    
    //  POPULATE THE FAVORITE VISUAL DESIGN LIST
    $('#design-list').html(function(){
        var exerciseSlideCount = $('li.exercise-slide').length;
        
        for (i=0; i < exerciseSlideCount; i++)
        {
            
            var conceptNumber = i + 1;
            
            $('#design-list').append('<li id="concept' + conceptNumber + '" name="Visual ' + conceptNumber + '" class="favorite-concept" style="background-image: url(./images/exercises/v' + conceptNumber + '-exercise.png"></li>');
        }
    });
}


//	TEMPORARY TRANSITION TRIGGER
function forcedTransition() {
    $('#header').click(function(){
                    nextSlideTransition();
    });
}


//  SLIDE TRANSITION
function nextSlideTransition() {

    //  RANDOMIZE THE ROLLADEX
    var wordCounter     = $(document).find('.js-descriptiveWord').length;
    var randomNumber    = 1 + Math.floor(Math.random() * wordCounter);
    var movedItems      = $('#rouletteContainer li').slice(randomNumber);                
    $('#rouletteContainer').prepend(movedItems);


    //  MOVE SLIDE
    var slideHeight     = $('#innerWrapper').height();
    var currentPosition = $('#slidesContainer').css('top').replace(/[^-\d\.]/g, '');
    var newPosition     = currentPosition - slideHeight;
    
    if( $('#visualNavigation:visible').length > 0)
    {    
        $('#visualNavigation').fadeOut("fast");
        $('#visualNavigation').html("")
    }        

    $('#slidesContainer').animate({top: newPosition },500, function(){
        var nextSlide = $('.activeSlide').next('li.slide');
        var nextSlideExerciseImageCount = nextSlide.find('img[src$="-exercise.png"]').length;
        var visualDesignNumber = nextSlide.index();
        
        if( nextSlideExerciseImageCount > 0 )
        {
            //  IF THE NEXT SLIDE HAS MORE THAN 1 VISUAL
            if( nextSlideExerciseImageCount > 1 )
            {
                // IF THE PREVIOUS SLIDE HAD MORE THAN 1 VISUAL
                $('#visualNavigation').html(function(){
        
                    for (i=0; i < nextSlideExerciseImageCount; i++)
                    {
                        $('ul#visualNavigation').append('<li class="visualNavigation-button">list</li>');
                        $('ul#visualNavigation li:first-child').addClass('activeVisual');
                    }
                    $(this).delay(500).fadeIn();
                });
                
                nextSlide.each(function(){
                    $(this).prepend('<div class="js-exercise-title"><h3>Visual Design ' + visualDesignNumber + '</h3><span class="childNumber">Screen 1</span></div>');
                });
            }
    
            else if( nextSlideExerciseImageCount === 1 )
            {
                nextSlide.prepend('<div class="js-exercise-title"><h3>Visual Design ' + visualDesignNumber + '</h3></div>');
            }
            

            if( nextSlide.hasClass('exercise-slide') )
            {
                nextSlide.append('<div class="slide-wordBox" id="slide-wordBox' + visualDesignNumber + '"><div class="mainBox"><h4>Chosen Words</h4><span id="slide-wordBox'+ visualDesignNumber +'-words" class="slide-wordBox-words">Please choose 5 words for this slot</span><a class="rouletteTrigger" href="javaScript:void(0);">Add/modify words</a></div><div class="nextSlideContainer"><a class="nextSlideButton" href="javaScript:void(0);"><span class="firstLine">Proceed</span><span class="secondLine">to the next Design</span></a></div><form id="visualForm' + visualDesignNumber + '"></form></div>');
            }           
        }
        
        else if( nextSlide.hasClass('excercise-favoriteDesign') )
        {
            nextSlide.append('<div class="slide-wordBox" id="slide-favoriteDesign"><div class="mainBox"><h4>Chosen Design</h4><span class="slide-favoriteDesign-designNumber">Please choose a design</span></div><div class="nextSlideContainer"><a class="nextSlideButton" href="javaScript:void(0);"><span class="submitExercise">Submit</span></a></div><form id="visualForm-design"></form></div>');
        }
        
        
        nextSlide.find('.slide-wordBox').fadeIn();
        
        $('.activeSlide').removeClass('activeSlide').next('li.slide').addClass('activeSlide');
        $('.activeSlide .imageWrapper').each(function(){
            $(this).append('<a class="zoomIn">Zoom In</a>');
        });
        $('.activeSlide .js-exercise-title').delay(100).fadeIn();
    });
}


//  EXERCISE TRIGGERS
function exerciseTriggers() {
    
    $('.imageWrapper').mouseenter(function(e){
        $(this).find('.zoomIn').fadeIn();
    }).mouseleave(function(e){
        $(this).find('.zoomIn').fadeOut();
    });


    //  ZOOM IN IMAGE
    $('.imageWrapper').find('img').click(function(){
        var imgPath = $(this).attr('src'); 
        openModal('<img src="' + imgPath + '" />');
    });

    //  CLICKING ON "SHOW" OR "HIDE" ROULETTE
    $(document).on("click", 'a.rouletteTrigger', function(e){
        var slideRouletteTrigger = $('.activeSlide .slide-wordBox a.rouletteTrigger');
        var rouletteWidth = $('#roulette').width() + 20;
        var rouletteActualPosition = $('#roulette').css('left');
        var activeWordBox = $('.activeSlide .slide-wordBox');
        
        //  IF THE ROULETTE IS VISIBLE
        if( $(this).hasClass('rouletteActive') )
        {
            $('a.rouletteActive').each(function(){
                $(this).removeClass('rouletteActive');
            });
            slideRouletteTrigger.html('Add/modify words');
            hideRoulette();

            //  IF THERE A WORDS CHOSEN WHEN HIDING THE ROULETTE
            if( $('#roulette').find('.chosenWord').length > 0)
            {
                var selectedWordCount = $('.chosenWord').length;

                //  REMOVE PREVIOUS ENTRIES
                if( activeWordBox.find('form input').length > 0 )
                {
                    activeWordBox.find('form input').each(function(){
                        $(this).remove();
                    });
                }

                //  CLEAR THE LIST OF WORDS OR THE INSTRUCTIONS

                activeWordBox.find('.slide-wordBox-words').html('');

                //  POPULATE NEW LIST
                $('.chosenWord').each(function(i) {
                    var currentWordBoxWords = activeWordBox.find('.slide-wordBox-words');
                    var currentText = currentWordBoxWords.text();
                    var tmpWord = $(this).text();

                    if( i === 0)
                    {
                        currentWordBoxWords.html(tmpWord);
                    }
                    else
                    {
                        currentWordBoxWords.html(currentText + ', ' + tmpWord);
                    }
                });

                //  IF THE USER HAS CHOSEN ALL 5 WORDS
                if( $('#roulette').find('.chosenWord').length > 4)
                {  
                    $('.slide-wordBox:visible').addClass('js-completedSlide');
                    $('.nextSlideContainer').fadeIn();
                }
                
                //  IF USER HAS CHOSEN LESS THAN 5 WORDS
                else if( $('.chosenWord').length < 5 )
                {
                    //  BETWEEN 1-4 WORDS CHOSEN
                    if( $('.js-completedSlide').length > 0 )
                    {
                        $('.js-completedSlide').removeClass('js-completedSlide');
                        $('.nextSlideContainer').fadeOut();
                    }
                }
            }
    
            //  IF USER HAS CHOSEN NO WORDS
            else
            {
                activeWordBox.find('.slide-wordBox-words').html('Please choose 5 words for this slot');
                if( $('.slide-wordBox').hasClass('js-completedSlide'))
                {
                    $('.js-completedSlide').removeClass('js-completedSlide');
                    $('.nextSlideContainer').fadeOut();
                }
            }
        }
        //  IF THE ROULETTE IS NOT VISIBLE
        else
        {
            $('a.rouletteTrigger').each(function(){
                $(this).addClass('rouletteActive');
            });
            slideRouletteTrigger.html('Hide List');
            $('#roulette').animate({'margin-left': '0'});
        }
    });

    //  COMPLETE EXERCISE SLIDE
    $(document).on("click", '.slide-wordBox a.nextSlideButton', function(e){
                
        //  CLEAR THE CHOSENWORD CLASS
        if( $(this).parents('.exercise-slide').length > 0 )
        {
            $('.chosenWord').each(function(){
                $(this).removeClass('chosenWord');
            });
        }
        nextSlideTransition();
    });
}


//  HIDE ROULETTE FUNCTION
function hideRoulette() {
    var rouletteWidth = $('#roulette').width() + 20;
    var negativeRouletteWidth = Math.abs(rouletteWidth) * -1;
    $('#roulette').animate({
        'margin-left': negativeRouletteWidth
    });
}


//  VISUALS SLIDES
function visualDesignsCaroussel() {
    $(document).on("click", '.visualNavigation-button', function(e){
        var activeVisual = $('.activeVisual').index();
        var selectedVisual = $(this).index();
        var visualSlideWidth = $('.activeSlide').width();
        var currentVisualPosition = $('.activeSlide ul.js-innerCaroussel').css('left').replace(/[^-\d\.]/g, '');
        var visualScreenNumber = $(this).index() + 1;

        $('.activeSlide').find('span.childNumber').fadeOut('fast', function(){
            $(this).html('Screen ' + visualScreenNumber).delay(100).fadeIn('fast');
        });
        
        //  IF SELECTING VISUAL WHICH COMES BEFORE CURRENT
        if( activeVisual > selectedVisual )
        {
            
            var slideMultiplier = activeVisual - selectedVisual ;
            var slideDifference = slideMultiplier * visualSlideWidth;
            var newPosition = Math.abs(slideDifference) - Math.abs(currentVisualPosition);
        }
        
        else if( activeVisual == selectedVisual )
        {
        }
        //  IF SELECTING VISUAL WHICH COMES AFTER CURRENT
        else {
            var slideMultiplier = selectedVisual - activeVisual;
            var slideDifference = slideMultiplier * visualSlideWidth;
            var newPosition = currentVisualPosition - slideDifference;
        }
        $('.activeSlide').find('ul.js-innerCaroussel').animate({left: newPosition });
        $('.activeVisual').removeClass('activeVisual');
        $(this).addClass('activeVisual');
    });
}


//  CLICKING ONE OF THE PREFERRED DESIGNS
$(document).on('click', '.favorite-concept', function(e){
    
    if(!$(this).hasClass('js-selected-favorite-concept'))
    {
        var chosenDesign = $(this).attr('name');
        
        if( $('.js-selected-favorite-concept').length > 0 )
        {
            $('.js-selected-favorite-concept').removeClass('js-selected-favorite-concept');
        }
        
        if(!$('#slide-favoriteVisual-box').hasClass('js-completedSlide'))
        {
            $('#slide-favoriteVisual-box').addClass('js-completedSlide');
        }
        
        $(this).addClass('js-selected-favorite-concept');        
        
        $('.slide-wordBox:visible').addClass('js-completedSlide');
        $('.slide-favoriteDesign-designNumber').html("You have chosen "+ chosenDesign);
        $('.nextSlideContainer').fadeIn();
    }
});



//    LOGIN
function loginClick() {
    $('#loginWrapper .login-role').click(function(){

        if( $(this).hasClass('js-activeButton') )
        {
            $('.js-activeForm form').slideUp("fast", function(){
                $('.js-activeForm h2').slideDown("fast", function(){
                    $('.js-activeButton').removeClass('js-activeButton');
                    $('.js-activeForm').removeClass('js-activeForm');
                });
            });                
        }
								
        else if( $(this).hasClass('js-activeForm') )
        {}            
        else
        {
            $(this).addClass('js-activeButton');
            $(this).siblings('.login-role').addClass('js-activeForm');
            $('.js-activeForm h2').slideUp("fast", function(){
                            $('.js-activeForm form').slideDown("fast");
            });
        }

    });
}


//	LOGIN FUNCTIONS
function temporaryLoginAction() {
    
    //  CLEAR FIELS
    $(".login-role input[type=text]")
    .each(function(){
        $(this).addClass('js-original-value').data("defaultValue", this.value); 
    })
    .on("focus", function(){
        if(this.value == this.defaultValue)
        {
            $(this).val("");
            $(this).removeClass('js-original-value');
        }        
    })
    .on("blur", function(){
        if ( this.value == "" )
        {
            this.value = $(this).data("defaultValue");
            $(this).addClass('js-original-value');
        }
    });
    
    $('a.login-button').click(function(){
        var sessionType = $(this).parents('.login-role').attr('id');
        var field1= "";
        var field2 = "";

        if(sessionType == "researcher")
        {
            var field1 = 'project#: ' + $('#projectCode').val();
            var field2 = $('#particpiantName').val();
        }
        
        else
        {
            var field1 = 'Macadamian Super User';
            var field2 = $('#researcherUserName').val();
        }

        if( $("#"+sessionType).find('input.js-original-value').length > 0 )
        {
                        alert('Please fill in all the information');
        }
        else
        {
                        $('#header #field1').attr('value', field1);
                        $('#header #field2').attr('value', field2);
                        $('#header #sessionInfo').fadeIn();
                        nextSlideTransition();
        }
    });
}


/************/
/* ON READY */
/************/
$(document).ready(function() {
    setInnerWrapperHeight();
    loginClick();
    visualDesignsCaroussel();
    modalClose();
    
    temporaryLoginAction();
    forcedTransition();
});