jQuery(function(){
	var v = $.ex.flexFixed.version;
	$('h1').after('<h2>'+(v ? ('Version '+v) : 'Old Version')+'</h2>');
});

var DEMO_adjustContainerHeight = function(){
	$('div.main-contents p').each(function(idx){
		if(idx < 9) $(this).remove();
	});
}

var DEMO_overWindowHeight = function(){
	var html = $('div.main-contents div').html();
	$('div.main-contents div').html(html + html )
	var html = $('div.ext-contents ul').html();
	$('div.ext-contents ul').html(html + html)
	$('div.ext-contents li > a').each(function(idx){
		$(this).text($(this).text()+'-'+idx);
	});
}


var DEMO_dynamicLayout = function(){
	var item = '<a class="del" href="#">×</a> <a class="add" href="#">＋</a>';
	var item2 = '<div><p>Lorem ipsum... ' + item + '</p></div>';
	var item3 = '<div style="margin-left:200px"><p>Lorem ipsum... ' + item + '</p></div>';
	$('div.sub-contents li,div.ext-contents li').append(' '+item);
	$('div.main-contents p').prepend(item);
	$('div.sub-contents-wrapper,div.ext-contents-wrapper').prepend(item2).append(item2);
	$('div.main-contents-wrapper').prepend(item3).append(item3);
	$('div.header').append(item2);
	$('div.footer').prepend(item2);
	$('a.del').live('click',function(){
		$(this).parent().remove();
		return false;
	});
	$('a.add').live('click',function(){
		$(this).parent().clone().appendTo($(this).parent().parent());
		return false;
	});
}



