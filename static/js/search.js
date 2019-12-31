$(document).ready(function() {
    $(window).keydown(function(event){
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    $(document).click(function() {
        // hides search results if user clicks outside them
        if (!($(".search-results").is(":hover")) && !($("form").is(":hover")) ) {
            $('.search-results').removeClass('d-block'); 
            $('.search-results').empty();
        }
    });

    $.getJSON("/index.json", function(json) {
        index = elasticlunr(function () {
            this.addField('title');
            this.addField('content');
            this.addField('description');
            this.setRef('ref');
        });

        $.each(json, function (key, val) {
            index.addDoc(val);
        });
    });

    var timer;
    $(document).on('keyup change', 'input[name=search]', function() {
        clearTimeout(timer);

        var text = $(this).val().toLowerCase();
        if (!text.length) {
            $('.search-results').removeClass('d-block');

            return;
        }

        results = [];
        timer = setTimeout(function() {
            results = index.search(text);

            if (results.length) {
                $('.search-results').empty();
                $(results).each(function(index) {
                    var $result_title = $('<span class="result-title" />');
                    $result_title.html(this.doc.title);

                    var $result_summary = $('<span class="result-summary" />');
                    $result_summary.html(this.doc.content.substring(0,80));

                    var $result_link = $('<a />');
                    $result_link.append($result_title).append($result_summary);
                    $result_link.attr('href', this.ref);

                    var $result_item = $('<div class="result-item" />');
                    $result_item.append($result_link);
                    
                    $('.search-results').append($result_item);
                });
            }
            else {
                var $result_title = $('<span class="result-title" />');
                $result_title.html('No results found for query "' + text + '"');

                var $result_item = $('<div class="result-item" />');
                $result_item.append($result_title);

                $('.search-results').html($result_item);
            }

            $('.search-results').addClass('d-block');
        }, 200);

    });
});