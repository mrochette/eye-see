$(document).ready(function(){

    listenercarouselNavigation();
    listenerEnalargeImage();
    listenerCloseDialog();
    listenerWorldListTrigger();
    listenerWordBoxSelect();
    
    populateEvaluation();
    
    // once all the ajax requests are completed
    $(document).ajaxComplete(function(event,request, settings) {
        setupCarouselArrows();
        loadSteps();
        setupActiveSlides();
        setupCarousel();
        setupWordBoxSize();
        hideWordBox();
    });

    $(window).resize(function() {
        setupCarousel();
        setupWordBoxSize();
    });

});

function populateEvaluation(){
    $.ajax({
        url: './assets/words.xml',
        type: 'GET', 
        dataType: 'xml',
        success: function(returnedXMLResponse){
            
            loadWordList(returnedXMLResponse);
            loadExercises(returnedXMLResponse);
        }  
    });
}

function loadWordList(returnedXMLResponse) {
    var tmpWord;
    
    $(returnedXMLResponse).find('word').each(function(){
        tmpWord         = $(this).text();
        
        $('#wordDrawer ul').append('<li class="js-descriptiveWord"><a class="js-word">' + tmpWord + '</a></li>');
        
        
        var tmpWordWidth    = $('#wordDrawer ul li:last-child').width();
        
    });
}

function loadExercises(returnedXMLResponse) {
    var exerciseCount   = 0;
    var totalExercises  = $(returnedXMLResponse).find('exercise').length;
    $(returnedXMLResponse).find('exercise').each(function(){
        exerciseCount += 1;
        
        var message = $(this).find('message').text();
        
        var exerciseSlide = '<li id="visual' + exerciseCount + '" class="carousel visualSet level1"><div class="exerciseQuestion"><h2>Question</h2><p>' + message + '</p></div><ul class="level2">';
        
        var visualSlideClount = 0;
        
        $(this).find('visual').each(function(){
            visualSlideClount += 1;
           
            $(this).find('image').each(function(){
            
                var imageSlide = '<li id="visual' + exerciseCount + '-image' + visualSlideClount + '" class="visual level2"><div class="imageContainer"><img src="assets/images/exercises/';
            
                
                var imageEnd = $(this).text() + '" /><div class="enlarge" /></li>';
                
                imageSlide = imageSlide + imageEnd;
                exerciseSlide += imageSlide;
            });
            
        });
        
        exerciseSlide += '</ul>';
        exerciseSlide += '<div class="slideNavigation"><div class="mainBox"><h4>Chosen Words</h4><span class="slide-wordBox-words" id="slide-wordBox1-words">Please choose 5 words for this slot</span></div><div class="nextSlideContainer"><a class="nextSlideButton js-carouselTrigger" href="javaScript:void(0);">';
        
        // if this is the last exercise
        if( exerciseCount == totalExercises )
        {
            exerciseSlide += '<span class="firstLine">Submit</span><span class="secondLine">your evaluation</span></a></div><form id="visualForm1"></form></div></li>';
        }
        else
        {
            exerciseSlide += '<span class="firstLine">Proceed</span><span class="secondLine">to the next Design</span></a></div><form id="visualForm1"></form></div></li>';
        }
        
        
        
        
        $('#exerciseCarousel > ul.level1').append(exerciseSlide);
        
        
        
        
        // if this is the last exercise
        if( exerciseCount == totalExercises )
        {
            
            
            // if there is a preferred screen, load it
            if(  $(returnedXMLResponse).find('preferred').length > 0 )
            {
                
            }
            
            // add submit submit screen
            var submitScreen = '<li id="submitScreen" class="level1"><div class="exerciseMessage"><h2>Thank you!</h2><p>Your evaluation information has been sent to your researcher.  Thank you for your time!</p></div><ul id="evaluation"></ul></div></li>';
        
            $('#exerciseCarousel > ul.level1').append(submitScreen);
        }
    });
}

function setupCarouselArrows() {
    $('#exerciseCarousel').find('ul.level2').each(function(){
    
        // if there is more than one visual, add arrows
        if( $(this).find('li').length > 1 )
        {   
            $(this).parent().append('<a class="arrow left js-disabled js-carouselTrigger"></a><a class="arrow right js-carouselTrigger"></a>');
        }
        
    });
}

function loadSteps() {
    var slides          = $(document).find('.visualSet').length;
    var preferred       = $('#preferred').length;
    var length = 0;
        
    for ( i=0; i< slides; i++ ) {
      
        length = length + 1;
      
        $('#steps').append('<li id="stepVisual' + length + '">Visual Option' + length + '</li>');
    }
    
    if( preferred > 0 )
    {
        $('#steps').append('<li id="stepPreferred">Preferred Visual</li>');
    }
}

function setupActiveSlides() {
    $('body').find('.carousel > ul > li:first-child').each(function(){
        $(this).addClass('js-active')
    });
}

function setupCarousel() {
    
    var windowH     = $(window).height();
    var headerH     = $('#header').height();
    var headerO     = $('#header').offset()
    var carouselH   = windowH - headerO.top - 120;
    var portViewH   = windowH - headerH - headerO.top - 40;
    var portviewW   = $('#exerciseCarousel').width();
    var slideC      = $(document).find('#exerciseCarousel > ul > li').length + 1;
    var slideW      = $(document).find('li.level2').width();
    var imageH      = portViewH - $(document).find('.slideNavigation').outerHeight() - 75;
    
    // setup the height of the main carousel to occupy the window height - the header
    $(document).find('#exerciseCarousel, .level1').each(function(){
        $(this).height(portViewH);
    });
    
    // force max-height on wordDrawer
    $('#wordDrawer .content .inner').css('max-height', carouselH);
    
    // setup secondary carousels height to portViewH - slideNavigation
    $(document).find('.level2, .imageContainer').each(function() {

        $(this).css('height', imageH);
        
        if( $(this).hasClass('visual') )
        {
            var img     = $(this).find('img');
            var imgH    = img.height();

            img.css({
                'width' : 'auto',
                'height' : imageH
            });
        }
    });
    
    // make the first carousel height match the total height of all of the slides
    $(document).find('#exercisecarousel > ul').height(slideC);
    
    // make the secondary carousels width match the total width of visuals
    $(document).find('.carousel .carousel').each(function(){
        var visualL     = $(this).find('.visual').length;
        var carouselW   = visualL * portviewW;
        
        $(this).find('ul').width(carouselW);
        
    });
   
    setupNotesPosition(carouselH);
}

function setupNotesPosition(height) {
    var carouselH = height;
    
    $('.js-descriptiveWord').each(function(){
        // reset the notes
        $(this).removeClass('js-topNotes');
        
        var position        = $(this).offset();
        var topPosition     = position.top + 100;
        var threshold       = carouselH;
        
//        alert(topPosition + ' ' + threshold);
       
        if( topPosition > carouselH )
        {
            $(this).addClass('js-topNotes');
        }
        
    });
}

function setupWordBoxSize() {
    var longestWord = 0;
    
    $('.js-descriptiveWord').each(function(){
        var thisWidth = $(this).width();
        
        if( thisWidth > longestWord )
        {
            longestWord = thisWidth;
        }
        
    }).each(function(){
        
        $(this).width(longestWord);
     
    });
}


function hideWordBox() {
    $('#wordDrawer').css({
        'margin-bottom' : '-35px',
        'visibility' : 'visible'
    });
    
    $('#wordDrawer .content').css({
        'display' : 'none'
    });
}

function captureScreenEvaluation() {
    var visualID            = $('#steps .js-active').text();
    var activeSlide         = $('#steps .js-active').attr('id').slice(4).toLowerCase();
    var selectedWords       = $('#wordDrawer').find('li.js-selected');
    var firstImage          = $('#'+ activeSlide + ' li.level2:first-child .imageContainer img').attr('src');
    
    var visualEvaluation    = '<li><h2>' + visualID + '</h2><img src="' + firstImage + '" />';
    
    selectedWords.each(function(){
        var word            = $(this).find('.js-word').text();
        var notes           = $(this).find('.js-notes textarea').val();
        
        // if the notes are empty, make the notes message say that the user did not add any notes
        if( notes == '' )
        {
            notes = '<span class="accent">No explanation for this word choice.</span>'
        }
        
        
        visualEvaluation    += '<span class="js-chosenWordContainer"><h3>' + word + ':</h3><span class="js-wordReason">' + notes + '</span></span>';
        
    });
    
    visualEvaluation        += '</li>'
    
    $('#evaluation').append(visualEvaluation);
}

function resetWordDrawer() {
    $('#wordDrawer').find('.js-selected').each(function(){
        $(this).removeClass('js-selected js-active js-lastSelected');
    });
    
    $('#wordDrawer').find('.js-notes').each(function(){
        $(this).find('textarea').remove().end().append('<textarea />');
    });
    
    
    $('#wordDrawer').find('.js-wordOptions').each(function(){
        $(this).remove();
    });
    
}

function listenercarouselNavigation() {
    $(document).on('click', '.js-carouselTrigger', function(){
        
        // if user clicks on a carousel arrow
        if( $(this).hasClass('arrow') )
        {
            // if the arrow is not disabled
            if(! $(this).hasClass('js-disabled') )
            {
                // disable active slide's arrows
                $('li.js-active .js-carouselTrigger.arrow').each(function(){
                    $(this).addClass('js-disabled');
                });
                
                var parentC     = $(this).siblings('ul');
                var rightArrow  = parentC.siblings('.right');
                var leftArrow  = parentC.siblings('.left');
                
                var slideW      = parentC.find('li').outerWidth() + 84;
                var currentM    = parentC.css('margin-left').replace(/[^-\d\.]/g, '');
                var active      = parentC.find('.js-active');
                
                
                 // if the user clicked on the right arrow
                if( $(this).hasClass('right') )
                {
                    var newM    = Math.abs(currentM) - Math.abs(slideW);
                    active.removeClass('js-active').next('li').addClass('js-active');
                }
                else
                {
                    var newM    = Math.abs(slideW) - Math.abs(currentM);
                    active.removeClass('js-active').prev('li').addClass('js-active');
                }
                
                // animate the carousel in the correct direction and then verify if the arrows should be enabled or disabled
                parentC.css('left', '0').animate({
                    'margin-left' : newM
                }, 'slow', function(){
                    active      = parentC.find('.js-active');

                    // if there is another visual to the right
                    if( active.next('li').length > 0 )
                    {
                        
                        rightArrow.removeClass('js-disabled');
                        
                    }
                    // if there is no visual to the right
                    else
                    {
                        rightArrow.addClass('js-disabled')
                    }
                    
                    // if there is another visual to the left
                    if( active.prev('li').length > 0 )
                    {
                        
                        // if the left arrow is disabled, enable it
                        if( leftArrow.hasClass('js-disabled') )
                        {
                            leftArrow.removeClass('js-disabled');
                        }
                    }
                    // if there is no visual to the right
                    else
                    {
                        // if the right arrow is not disabled, disable it
                        if(! leftArrow.hasClass('js-disabled') )
                        {
                            leftArrow.addClass('js-disabled')
                        }
                    }
                });
                
                
                
            }
            
        }
        
        
        // if the user is completing a slide
        else
        {
            var activeSlide     = $('#exerciseCarousel > ul > li.js-active');
            var nextSlide       = activeSlide.next('li');
            var nextSlideL      = nextSlide.length;
            var slideID         = activeSlide.attr('id');
            var activeStep      = $('#steps li.js-active');
            var proceed         = true;
            
            // disable next slide button
            $(this).removeClass('js-carouselTrigger');
            
            activeSlide.removeClass('js-active').slideUp();
            
            //  if the exercise steps has no active step, make the first step active
            if(! $('#steps li.js-active').length > 0 )
            {
                $('#steps > li').filter(':visible:first').addClass('js-active');
            }
            // if there is an active step in the exercise steps
            else
            {
                
                // capture screen evaluation and add it to the submit screen
                captureScreenEvaluation();
                
                // make the active step complete
                activeStep.addClass('js-completed').removeClass('js-active');
                
                // if there is a step after the active step, make the next one active
                if( nextSlideL > 0 )
                {
                    activeStep.next('li').addClass('js-active');
                }
                // if the active slide is the last one, make the steps js-submitted
                else
                {
                    $('#steps').addClass('js-submitted');
                    $('#steps li').each(function(){
                        $(this).removeClass('js-completed');
                    });
                }
            }
                        
            // reset the word drawer
            resetWordDrawer();
            
            nextSlide.addClass('js-active');
            
            var drawerMargin  = $('#wordDrawer').css('margin-bottom');
            
            // if the next slide has visuals
            if( nextSlide.hasClass('visualSet') )
            {
                $('#wordDrawer').animate({
                    'margin-bottom' : '0'
                });
            }
            // if the next slide is not for visuals
            else
            {           
                $('#wordDrawer').animate({
                    'margin-bottom' : '-35px'
                });
            }
            
            if( nextSlide.attr('id') == 'submitScreen' )
            {
                $('#steps li').each(function(){
                    $(this).toggle('slide');
                });
                $('#steps li#completeMessage').slideDown();
                
                
            }
        }    
    });
}

function openDialog(content) {    
    var winHeight   = $(document).height();
    var winWidth    = $(document).width();


    $('#dialog').html(content);

    var dialogHeight        = $('#dialog').css('height').replace(/[^-\d\.]/g, '');
    var dialogWidth         = $('#dialog').css('width').replace(/[^-\d\.]/g, '');

    var dialogHeightMax     = winHeight - 300;
    var dialogWidthMax     = winHeight - 300;

    if( dialogHeight >= dialogHeightMax)
    {
        var dialogHeight =  winHeight - 60;

        $('#dialog img').css('height', dialogHeight);

    }
    if( halfImgHeight >= dialogWidthMax)
    {
        var dialogWidth =  winWidth - 60;

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

function listenerEnalargeImage() {

    $(document).on('mouseenter', '.visual .imageContainer img', function(){
    
        $(this).next('.enlarge').fadeIn();
    
    });

    $(document).on('mouseleave', '.visual .imageContainer img', function(){
        $(this).next('.enlarge').fadeOut();
    });

    $(document).on('click', '.visual .imageContainer img', function(){
        var src     = $(this).attr('src');
        var content = '<img src="' + src + '" />';
        
        openDialog(content);
    });
}

function listenerCloseDialog() {
    $(document).on('click', '#mask, #dialog', function(){
        $('#mask, #dialog').fadeOut(function(){
            $('#dialo').html('');
        });
        
    });
}

function listenerWorldListTrigger() {
    $(document).on('click', '#wordDrawer .trigger', function(){
        
        if( $('#wordDrawer .content').is(':visible') )
        {
            $(this).text('Add/modify words')
            $('#wordDrawer .content').slideUp();
            associateWordBoxToVisual();
        }
        else
        {
            $(this).text('Hide words');
            $('#wordDrawer .content').slideDown();
        }
        
    });
}

function associateWordBoxToVisual() {
    var activeWordBox = $('.level1.js-active .slideNavigation');
    
    // if the user has selected words
    if( $('#wordDrawer').find('.js-selected').length > 0)
    {
        var selectedWordCount = $('.js-selected').length;

        // if there are words listed in activeWordBox, remove them
        if( activeWordBox.find('form input').length > 0 )
        {
            activeWordBox.find('form input').each(function(){
                $(this).remove();
            });
        }

        //  CLEAR THE LIST OF WORDS OR THE INSTRUCTIONS
        activeWordBox.find('.slide-wordBox-words').html('');

        //  populate the new list of chosen words
        $('.js-selected a.js-word').each(function(i) {
            var currentWordBoxWords = activeWordBox.find('.slide-wordBox-words');
            var currentText = currentWordBoxWords.text();
            var tmpWord = $(this).text();

            // if this is the first word populated, add only the word
            if( i === 0)
            {
                currentWordBoxWords.html(tmpWord);
            }
            
            // if this is not the first word, add the current text plus a comma and the current word
            else
            {
                currentWordBoxWords.html(currentText + ', ' + tmpWord);
            }
        });

        //  if the user has chosen 5 words, make the next slide container visible
        if( $('#wordDrawer').find('.js-selected').length > 4)
        {
            $('.level1.js-active .slideNavigation').addClass('js-completedSlide');
            $('.level1.js-active .nextSlideContainer').fadeIn();
        }
        
        //  if the user has chosen less than 5 words
        else if( $('.js-selected').length < 5 )
        {
            $('.js-completedSlide').removeClass('js-completedSlide');
            $('.nextSlideContainer').fadeOut();
        }
    }

    //  if the user has chosen no words, revert to initial setup
    else
    {
        activeWordBox.find('.slide-wordBox-words').html('Please choose 5 words for this slot');
        
        // if the next slide box is visible, remove it from view
        if( $('.slide-wordBox').hasClass('js-completedSlide'))
        {
            $('.js-completedSlide').removeClass('js-completedSlide');
            $('.nextSlideContainer').fadeOut();
        }
    }
}

function listenerWordBoxSelect() {
    
    // when clickin any elements within js-descriptiveWord, make that parent li the last selected
    $(document).on('click', '#wordDrawer .js-descriptiveWord *', function(){
        var parent = $(this).parents('.js-descriptiveWord');
    
        if( parent.siblings('.js-lastSelected').length > 0 ) {
            parent.siblings('.js-lastSelected').removeClass('js-lastSelected');
        }
        
        parent.addClass('js-lastSelected');
    });
    
    
    // when user clicks on a word
    $(document).on('click', '#wordDrawer .js-descriptiveWord a.js-word', function(){
        var parent = $(this).parent('.js-descriptiveWord');
        
        
        // if the user has not picked five words
        if( $('#wordDrawer .js-selected').length < 5 )
        {
            
            // if the word is not selected, make it selected
            if(! parent.hasClass('js-selected') )
            {
                parent.addClass('js-selected');
                
                // if the word does not have word options, add them
                if(! parent.find('.js-wordOptions').length > 0 )
                {
                    var wordOptions = '<div class="js-wordOptions"><a class="js-editBox"></a><a class="js-remove"></a><div class="js-notes"><p>Please explain why you chose this word:</p><textarea /></div>';
                    
                    parent.append(wordOptions);
                }
                
                // if the word has word options, show them
                else
                {
                    parent.find('.js-wordOptions').show();
                }
            }
        }
        
        // if the user has picked five words
        else
        {
            // if the clicked word is not one of the selected words, warn the user
            if(! $(this).parents('.js-selected').length > 0 )
            {
                alert('You may only select up to 5 words per visual.  Please un-select a word to select a new one.');    
            }
        }
    });
    
    // when uesr clicks the word remove button, remove the word options and the select state
    $(document).on('click', '#wordDrawer .js-wordOptions a.js-remove', function(){
        
        var parent = $(this).parents('.js-selected');
        
        parent.removeClass('js-selected');
        parent.find('.js-wordOptions').hide();
        
    });
    
    
    // when user clicks the word edit button
    $(document).on('click', '#wordDrawer .js-wordOptions a.js-editBox', function(){
        
        var parent     = $(this).parents('.js-wordOptions');
        
        // if the word was already open to write notes, hide the notes
        if( parent.hasClass('js-editActive') )
        {
            parent.removeClass('js-editActive');
            parent.find('.js-notes').slideUp();
            
        }
        // show the user the notes box
        else
        {
            // hide other word notes that are already open
            $(document).find('.js-editActive').each(function(){
                $(this).removeClass('js-editActive');
                $(this).find('.js-notes').slideUp();
            });
            
            parent.find('.js-notes').slideDown();
            parent.addClass('js-editActive');
        }
    });
    
}