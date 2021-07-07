$(document).ready(function() {
    $("#content > h2, #content > h3, #content > h4, #content > h5, #content > h6").each(function( index ) {
        var $headingTitle = $(this).text();
        var $headingID = $(this).attr("id");
        var $headingLink = $("<a class='heading-link' href='#" + $headingID + "'><i class='far fa-link'></i></a>");
        var $sidenavLink = $("<li><a class='sidenav-link-level-" + $(this)[0].tagName + "' href='#" + $headingID + "'>" + $headingTitle + "</a></li>");
        $(this).append($headingLink);
        $('.cd-sidenav-nav').append($sidenavLink);
    });


    
    $('.heading-link').click(function(){
        $('html,body').animate({scrollTop: ($(this).offset().top - 70)}, 'slow');
    });    
});