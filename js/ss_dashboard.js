$(function () {
    var set_cookie     = 'gridSettings'; //name of cookie
    var cookie         = $.cookie(set_cookie);
    var main_container = '#gridContainer'; //id of container holding main elements
    var disp_container = '#disposal'; //id of container that will serve as the disposal bin
    var add_container  = '#gallery'; //id of container that holds items that can be added to main_container

    function createGridCookie(container, cookiename){
        var children  = $(container).children();
        var arr       = [];

        for(var i = 0 ; i < children.length; i++) {
            var data = {
                left: $(children[i]).css('left'),
                top: $(children[i]).css('top'),
                id: $(children[i]).attr('id')
            };z
            arr.push(data);
        }

        console.log('Cookie Generated:'+JSON.stringify(arr));
        $.cookie(cookiename,JSON.stringify(arr));

    }

    function initShapeshift(container){
       $(container).shapeshift({
            align:"left",
            animateOnInit: true,
            minColumns: 3
        });
    }

    //reconstructs HTML from cookie information
    if(cookie != undefined){
        var settings = JSON.parse($.cookie('gridSettings'));
        var temp     = '<div class="item" style="top: {top}; left:{left}" id="{id}">';
        var trail    = '</div>';

        $(main_container).empty();

        //load containers first

        for(var i = 0; i < settings.length; i++) {
            var id   = settings[i].id;
            var item = temp.replace(/\{top\}/g,settings[i].top).replace(/\{left\}/g,settings[i].left).replace(/\{id\}/g,id);

            $(main_container).append(item);
            console.log(item+trail);
        }

        //add function for loading content based on ids

    }

    initShapeshift(main_container);
    initShapeshift('#disposal');
    $('.container').on('ss-drop-complete', function(e,selected){
        //create cookie
        createGridCookie(main_container,set_cookie);

    });
    $('#clear-cookie').click(function() {
        $.remove('gridSettings');
    });
    $('#show-cookie').click(function() {
        console.log($.cookie('gridSettings'));
    });
    $('#create-cookie').click(function() {
         createGridCookie(main_container,set_cookie);
    });
    $('#load-content').click(function() {

        console.log('Reinitializing');
        $(main_container).trigger('ss-destroy');

        $(main_container).html($('#def-content').html());

        initShapeshift(main_container);
    });
});
