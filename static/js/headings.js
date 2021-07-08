$(document).ready(function() {
    $("#content > h2, #content > h3, #content > h4, #content > h5, #content > h6").each(function( index ) {
        var headingID = $(this).attr("id");
        var headingLink = $("<a class='heading-link' href='#" + headingID + "'><i class='far fa-link'></i></a>");
        $(this).append(headingLink); 
    });

    if ($("h2").length > 1) {
        $("#pageNav").prepend("<p class='pageNavHeading'>On This Page</p><ul class='nav cd-sidenav-nav'></ul>");
        $("#content > h2, #content > h3, #content > h4, #content > h5, #content > h6").each(function( index ) {
            var headingTitle = $(this).text();
            var headingID = $(this).attr("id");
            var sidenavLink = $("<li><a class='sidenav-link-level-" + $(this)[0].tagName + "' href='#" + headingID + "'>" + headingTitle + "</a></li>");
            $('.cd-sidenav-nav').append(sidenavLink);
        });
    }

    $(window).on('scroll', function() {
        var scrollTop = $(this).scrollTop();
        $("#content > h1, #content > h2, #content > h3, #content > h4, #content > h5, #content > h6").each(function() {
            var headingID = $(this).attr("id");
            var headingTopOffset = $(this).offset().top;  
            if (headingTopOffset - 30 < scrollTop ) {
                $('.cd-sidenav-nav li a').removeClass("active-sidenav-link");
                $('.cd-sidenav-nav').find('a[href="#' + headingID + '"]').addClass("active-sidenav-link");
            }
        });
    });
 
    $('.heading-link').click(function(){
        $('html,body').animate({scrollTop: ($(this).offset().top - 70)}, 'slow');
    });    
});