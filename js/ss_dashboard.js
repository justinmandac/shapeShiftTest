$(function () {
    "use strict";
    var set_cookie, cookie, main_container, disp_container, add_container;

    set_cookie     = 'gridSettings'; //name of cookie
    cookie         = $.cookie(set_cookie);
    main_container = '#gridContainer'; //id of container holding main elements
    disp_container = '#disposal'; //id of container that will serve as the disposal bin
    add_container  = '#gallery'; //id of container that holds items that can be added to main_container

    //utilities
    function getGridSettings(container) {
        var children, arr;
        children =  $(container).children();
        arr      = [];

        $.each(children, function (i, val) {
            if (val !== undefined) {
                var data = {
                    left: $(val).css('left'),
                    top: $(val).css('top'),
                    id: $(val).attr('id')
                };
                arr.push(data);
            }

        });

        return JSON.stringify(arr);
    }

    function createGridCookie(container, cookiename) {
        var settings = getGridSettings(container);
        $.cookie(cookiename, settings);
    }

    function initShapeshift(container) {
        $(container).shapeshift({
            align: "left",
            animateOnInit: true,
            minColumns: 3
        });
    }

    function containerBuilder(container, settings) {
        var temp     = '<div class="item" style="top: {top}; left:{left}" id="{id}"></div>';

        //empty container
        $(container).empty();
        $.each(settings, function (i, val) {
            var item = temp.replace(/\{top\}/g, val.top).replace(/\{left\}/g, val.left).replace(/\{id\}/g, val.id);
            $(container).append(item);
        });

    }
    //reconstructs HTML from cookie information
    if (cookie !== undefined) {
        console.log('Saved settings' + cookie);
        containerBuilder(main_container, JSON.parse(cookie)); //load containers first
        //add function for loading content based on ids
    }

    initShapeshift(main_container);
    $(disp_container).shapeshift({
        align: "left",
        animateOnInit: true,
        minColumns: 3,
        enableTrash: true
    });
    $('#gallery').shapeshift({
        align: "left",
        animateOnInit: true,
        minColumns: 3,
        dragClone: true
    });
    $('.container').on('ss-drop-complete', function (e, selected) {
        //create cookie
        createGridCookie(main_container, set_cookie);
        console.log('Cookie contents' + $.cookie(set_cookie));
        console.log(e);

    });

    $(main_container).on('mousedown', function (e) {
        console.log('Dragging in progress.');
        $(disp_container).css('visibility', 'visible');
        $(main_container).addClass('span8');
        $(disp_container).addClass('span4');
        $(main_container).trigger('ss-rearrange');
    });

    $(main_container).on('ss-rearranged', function (e) {
        $(disp_container).css('visibility', 'hidden');
        $(main_container).removeClass('span8');
        $(disp_container).removeClass('span4');
    });

    $(disp_container).on('ss-trashed', function (e) {
        console.log('Dragging done.');
        $(disp_container).css('visibility', 'hidden');
        $(main_container).removeClass('span8');
        $(disp_container).removeClass('span4');
    });
    $(disp_container).on('ss-trashed', function (e, selected) {
        //create cookie
        createGridCookie(main_container, set_cookie);
    });
    $('#clear-cookie').click(function () {
        $.remove('gridSettings');
    });
    $('#show-cookie').click(function () {
        console.log($.cookie('gridSettings'));
    });
    $('#create-cookie').click(function () {
        createGridCookie(main_container, set_cookie);
    });
    $('#load-content').click(function () {
        $(main_container).trigger('ss-destroy');
        $(main_container).html($('#def-content').html());
        initShapeshift(main_container);
    });
});
