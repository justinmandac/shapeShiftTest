$(function () {
    var set_cookie     = 'gridSettings'; //name of cookie
    var cookie         = $.cookie(set_cookie);
    var main_container = '#gridContainer'; //id of container holding main elements
    var disp_container = '#disposal'; //id of container that will serve as the disposal bin
    var add_container  = '#gallery'; //id of container that holds items that can be added to main_container

    //utilities
    function getGridSettings(container) {
        var children  = $(container).children();
        var arr       = [];

        $.each(children, function(i,val){
            var data = {
                left: $(val).css('left'),
                top: $(val).css('top'),
                id: $(val).attr('id')
            };
            arr.push(data);

        });

        return JSON.stringify(arr);
    }

    function createGridCookie(container, cookiename){
        var settings = getGridSettings(container);
        $.cookie(cookiename, settings);
        console.log('Cookie created:'+settings);

    }

    function initShapeshift(container){
       $(container).shapeshift({
            align:"left",
            animateOnInit: true,
            minColumns: 3
        });
    }

    function containerBuilder(container, settings){
        var temp     = '<div class="item" style="top: {top}; left:{left}" id="{id}"></div>';

        //empty container
        $(container).empty();
        $.each(settings, function(i, val) {
            var item = temp.replace(/\{top\}/g,val.top).replace(/\{left\}/g,val.left).replace(/\{id\}/g,val.id);
            $(container).append(item);
        });

    }
    //reconstructs HTML from cookie information
    if(cookie != undefined){
        var settings = JSON.parse($.cookie('gridSettings'));
        containerBuilder(main_container,settings); //load containers first
        //add function for loading content based on ids
    }

    initShapeshift(main_container);
    //initShapeshift('#disposal');
    $('#disposal').shapeshift({
            align:"left",
            animateOnInit: true,
            minColumns: 3,
            enableTrash: true
    });
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
