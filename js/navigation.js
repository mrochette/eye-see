function navigationListener() {
    var path;
    
    $(document).on('click', 'a', function(event){
        if( $(this).attr('target') != '_blank' )
        {
            event.preventDefault();
            path = $(this).attr('href');
            changePage(path);            
        }
        
    });
}


function changePage(path) {
    var content = $('#content');
    var time;
    
    if( path == null )
    {
        time = 5000;
        path = 'pages/login.html';
        
        loadContent(content, path);
        
    }
    
    else
    {
        time = 1000;
        
        fadeOutContent();
        setTimeout(function() {
            loadContent(content, path);
        }, 1000);
        window.setTimeout(fadeInContent, time);
    }    
}

function loadContent(content, path) {
    content.load(path, function(){
        //  carousel.js
        setupCarousels();
    });
}

function fadeOutContent(){
    var content = $('#content');
    content.fadeOut();    
}

function fadeInContent() {
    var content = $('#content');
    content.fadeIn();
}

function fadeOutNav() {
    $('#header .nav').fadeOut();
}

function fadeInNav() {
    $('#header .nav').fadeIn();
}