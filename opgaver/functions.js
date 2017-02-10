$(function() {

	$.get("gloser.xml", function(data) {

		var gloseData = $(data).find("glose");
		var gloser = {};
		var rundeAntal = Math.ceil(gloseData.length / 10);
		gloser.fremmedsprog = [];
		gloser.dansk = [];

		for (var i = 0; i < rundeAntal; i++) {
			gloser.fremmedsprog[i] = [];
			gloser.dansk[i] = [];

			if (i == 0) {
				$("#button").append("<div class='button" + (i + 1) + " buttons active' rel='" + (i + 1) + "'>" + (i + 1) + "</div>");
			} else {
				$("#button").append("<div class='button" + (i + 1) + " buttons' rel='" + (i + 1) + "'>" + (i + 1) + "</div>");
			}
			$(".cover").append("<div id='runde" + (i + 1) + "' class='runder'><div id='glosecontainer" + (i + 1) + "' class='glosecontainere cf'></div><br><div id='fremmedsprogcontainer" + (i + 1) + "' class='fremmedsprogcontainere cf'></div>");
		}

		for (var i = 0; i < gloseData.length; i++) {
			var runde = Math.floor(i / 10);
			gloser.fremmedsprog[runde].push("<div class='fremmedsproggloser'>" + $(gloseData[i]).find("fremmedsprog").text() + "</div><div id='glose" + (i + 1) + "' class ='dropzone'></div>");
			gloser.dansk[runde].push("<div id='glose" + (i + 1) + "fremmedsprog' class ='danskegloser'>" + $(gloseData[i]).find("dansk").text() + "<img class='icon' src='' alt='' /><img class='move' src='../images/move.png' alt='' /></div>");
			shuffle(gloser.fremmedsprog[runde]);
			shuffle(gloser.dansk[runde]);
		}


		for (var i = 0; i < gloseData.length; i++) {

			var runde = Math.floor(i / 10);

			$("#glosecontainer" + (runde + 1)).append(gloser.fremmedsprog[runde][i % 10]);
			$("#fremmedsprogcontainer" + (runde + 1)).append(gloser.dansk[runde][i % 10]);
		}

		makeSlider(rundeAntal);


		$(".danskegloser").draggable({
			cursor: "move",
			snap: ".dropzone",
			snapMode: "inner",
			revertDuration: 200,
			revert: function(event, ui) {
				$(this).data("uiDraggable").originalPosition = {
					top: 0,
					left: 0
				};
				return !event;
			}
		});

		$(".dropzone").droppable({
			tolerance: "intersect",
			drop: function(event, ui) {
				$(this).droppable('option', 'accept', ui.draggable);
				if (ui.draggable.attr("id") == $(this).attr("id") + "fremmedsprog") {
					$(".icon", ui.draggable).attr("src", "../images/correct.png");
					$(".icon", ui.draggable).show();
					$(ui.helper).animate({
						left: parseFloat($(ui.helper).css("left")) + ($(this).offset().left - ui.helper.offset().left) + "px",
						top: parseFloat($(ui.helper).css("top")) - (ui.helper.offset().top - $(this).offset().top) + "px"
					}, 300, function() {
						//callback
					});
				} else {
					$(".icon", ui.draggable).attr("src", "../images/wrong.png");
					$(".icon", ui.draggable).show();
					$(ui.draggable).animate({
						left: parseFloat($(ui.helper).css("left")) + ($(this).offset().left - ui.helper.offset().left) + "px",
						top: parseFloat($(ui.helper).css("top")) - (ui.helper.offset().top - $(this).offset().top) + "px"
					}, 300, function() {
						// callback
					});
				}
			},
			out: function(event, ui) {
				$(this).droppable('option', 'accept', '.ui-draggable-dragging');
				$(".icon", ui.draggable).hide();
			}
		});
	});
});


function makeSlider(runder) {

	$("#button").css("margin-left", ($("#button").width() + $(".side").outerWidth(true)) / 2 * (-1));
	$("#myslide .cover").width(584 * runder);

	$('.buttons').click(function() {
		var integer = $(this).attr('rel');
		$('#myslide .cover').animate({
			left: -584 * (parseInt(integer) - 1)
		});
		$('.buttons').each(function() {
			$(this).removeClass('active');
			if ($(this).hasClass('button' + integer)) {
				$(this).addClass('active');
			}
		});
	});
};

function shuffle(o) {
	for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};