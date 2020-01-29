$(document).ready(function() {
    $("h2").each(function( index ) {
        var $headingID = $(this).attr("id");
        var $headingLink = $("<a class='heading-link' href='#" + $headingID + "'><i class='far fa-link'></i></a>");
        $(this).append($headingLink);
    });
    
    $('.heading-link').click(function(){
        $('html,body').animate({scrollTop: ($(this).offset().top - 70)}, 'slow');
    });    
});