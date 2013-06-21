$(document).ready(function(){
    placeholder();
});

//  FUNCTION TO REPRODUCE THE HTML5 PLACEHOLDER ATTRIBUTE WHICH IS NOT SUPPORTED BY IE8
function placeholder() {
    
    // select all elements which have the attribute "placeholder"
    $('[placeholder]').each(function(event) {
        var placeholder = $(this).attr('placeholder');
        
        // identify that it has a placeholder for ie8
        $(this).val(placeholder).addClass('js-placeholder');
    });
    
    // when users focus on an element that has the attribute placeholder
    $(document).on('focus', '[placeholder]', function(event) {
        
        // get the placeholder value and the element's value
        var placeholder = $(this).attr('placeholder');
        var currentVal  = $(this).val();
        
        // if the current value is the same as the placeholder, remove the value so users can start typing
        if( currentVal == placeholder )
        {
            $(this).val('').removeClass('js-placeholder');
        }
    });
    
    // when users unfocus from a placeholder element
    $(document).on('blur', '[placeholder]', function(event) {
        
        // get the placeholder value and the element's value
        var placeholder = $(this).attr('placeholder');
        var currentVal  = $(this).val();
        
        // if the current value is null, put the placeholder so users know what the input is for
        if( currentVal == '' )
        {
            $(this).val(placeholder).addClass('js-placeholder');
        }
    });
}