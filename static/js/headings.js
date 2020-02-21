$(document).ready(function() {
    $("#content > h2, #content > h3, #content > h4, #content > h5, #content > h6").each(function( index ) {
        var $headingID = $(this).attr("id");
        var $headingLink = $("<a class='heading-link' href='#" + $headingID + "'><i class='far fa-link'></i></a>");
        $(this).append($headingLink);
    });
    
    $('.heading-link').click(function(){
        $('html,body').animate({scrollTop: ($(this).offset().top - 70)}, 'slow');
    });    
});