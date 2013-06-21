$(document).ready(function() {       
    // Load home page
    changePage();
    
    // Listeners
    navigationListener();
    carouselListeners();    
    window.onresize = function(event) {
      
    }
});