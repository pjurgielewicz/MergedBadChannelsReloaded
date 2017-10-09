$(document).ready(function() {

	var savedPlots = 0;
	var dateFormat = "dd/mm/yyyy";

	$.post("php/maxRunUtil.php", {}, function(data){
				console.log("CurrMaxRunNum: ");				
				console.log(data);

				// RUN SLIDER
				var initialSliderValues = [270000, 300000];
				var minSliderVal = 261370;
				var maxSliderVal = data + 3000;
				var ticks = [];
				var tickStep = 15000;
				
				for (i = minSliderVal + tickStep; i < maxSliderVal ; i+=tickStep)
				{
					var mainVal = Math.floor(i / tickStep) * tickStep;
					ticks.push(mainVal);
				}

				var slider = $("#slider")[0];
				noUiSlider.create(slider, {
					start: initialSliderValues,
					connect: true,
					step: 1,
					range: {
						'min': minSliderVal, // takes into account padding value
						'max': maxSliderVal
					},
					padding: 3000,

					pips: {
						mode: 'values',
						values: ticks,
						density: 2
					}
				});

				slider.noUiSlider.on("update", function(values, handle){
					$("#runMin").val(values[0].substr(0,6));
					$("#runMax").val(values[1].substr(0,6));
				});

				$("#runMin").val(initialSliderValues[0]);
				$("#runMax").val(initialSliderValues[1]);

				$("#runMin").on("change", function(){
					slider.noUiSlider.set([$(this).val(), null]);
				});
				$("#runMax").on("change", function(){
					slider.noUiSlider.set([null, $(this).val()]);
				});

		   }
		   , "json"
    );

	// TOGGLERS
	$('#runDateToggle').bootstrapToggle('on');
	$('#careAboutRunLength').bootstrapToggle('off');
	$('#expertModeToggle').bootstrapToggle('off');
	$('#linLogToggle').bootstrapToggle('off');

	$("#runDateToggle").change(function(){
		$('#datePicker').toggle();
		$('#runRangePicker').toggle();

		// console.log($("#runDateToggle").parent().hasClass("off"));
	});
	$('#expertModeToggle').change(function(){
		$("#userDataPickingPanelBody").toggle();
		$("#expertDataPickingPanelBody").toggle();

	})
	$('#linLogToggle').change(function(){
		changeAxisType($(this).parent().hasClass('off'));
	});

	// DATEPICKER
	$('.input-daterange').datepicker({
        format: dateFormat,
        weekStart: 1,
        daysOfWeekHighlighted: "0",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        maxViewMode: 3
    });

    var today = moment();
	var todayStr = moment().format(dateFormat.toUpperCase());
	var histDateStr = today.add(-4, 'day').format(dateFormat.toUpperCase());
	// console.log(todayStr);

	$("#datepicker #dateStart").val(histDateStr);
	$("#datepicker #dateEnd").val(todayStr);

	// BUILDING OPTION FOOTERS
	var optionFooterArr = {"Strip" :
							{"Strips" : "Strips",
							 "APVs" : "APVs",
							 "Fibers" : "Fibers",
							 "Modules" : "Modules"},
						   "Pixel" :
						     {"Occupancy" : "Mean Occupancy",
						      "Inefficient" : "Inefficient ROCs",
						      "Dead" : "Dead ROCs",
						      "Inefficientdcols" : "Inefficient DCols",
						      "Noisycols" : "Noisy Cols"
						      }
						}
	var optionNum = 0;
	for (var det in optionFooterArr)
	{
		var obj = ((det === "Strip") ? $("#stripOptionSelection") : $("#pixelOptionSelection"));
		var htmlBuild = "<div class='row'>";

		for (var optionKey in optionFooterArr[det])
		{
			htmlBuild += 	"<div class='col-md-3'>" + 
								"<label><input type='checkbox' id='option-" + optionNum + "-" + optionKey + "'>" + optionFooterArr[det][optionKey] + "</label>" +
							"</div>";
			optionNum += 1;
		}

		htmlBuild += "</div>";
		obj.append(htmlBuild);
	}

	// MINMAX SELECTION BUILDER
	var minmaxSeleectionArr = {"Strip" :
								{"NumberOfCluster" : "# strip clusters",
							   	"NumberOfDigi" : "# strip digis",
							   	"NumberOfOfffTrackCluster" : "# off track clusters",
							   	"StoNCorrOnTrack" : "S/N correlation on track",
							   	"ResidualsMean" : "Residuals Mean"},
							   	// "ResidualsMean2" : "Residuals Mean"},
							   ////////////////////////////////////////////////////
							   "Pixel" : 
							   {"adc" : "ADC",
							   "charge" : "Charge",
							   "size" : "Size",
							   "num_clusters" : "# pixel clusters",
							   "num_digis" : "# pixel digis",
							   
							   "Tsize" : "Track size",
							   "Tcharge" : "Track charge",
							   "TshapeFilter" : "Track shape filter",
							   "Thitefficiency" : "Track hit efficiency",

							   "Tresidual_x" : "Track X-residual",
							   "Tresidual_y" : "Track Y-residual",
							   "Trechitsize_x" : "Rechit X-size",
							   "Trechitsize_y" : "Rechit Y-size",
							   
							   "Tnum_clusters_ontrack" : "# cluster on track",
							   "Tnum_missing" : "# track missing",
							   "Tnum_valid" : "# track valid"}
							   };
	var currOptionID = 11;
	for (var key in minmaxSeleectionArr)
	{
		var htmlBuild = "<div class='col-md-12'>" + key + "</div>";
		// console.log(htmlBuild);

		for (var detValKey in minmaxSeleectionArr[key])
		{
			htmlBuild += "<div class='col-md-8' id='" + detValKey + "-title'>" + minmaxSeleectionArr[key][detValKey] + "</div>" +
						 "<div class='col-md-2'>" + 
						 	"<label><input type='checkbox' id='option-" + currOptionID + "-" + detValKey + "-min'" + ((key === "Strip") ? "style='visibility: hidden;'" : "") + ">" +
						 		// minmaxSeleectionArr[key][detValKey] + 
						 	"</label>" +
						 "</div>" + 
						 "<div class='col-md-2'>" + 
						 	"<label><input type='checkbox' id='option-" + (currOptionID + 1) + "-" + detValKey + "-max'>" +
						 		// minmaxSeleectionArr[key][detValKey] + 
						 	"</label>" +
						 "</div>";

			currOptionID = currOptionID + 2;

			// <label><input type="checkbox" id="option-7-Inefficientdcols"> Inefficient DCols</label>;
		}	

		$("#minmax-selection .row").append(htmlBuild);
	}
	$("#minmax-selection .row").parent().append("<hr/><div class='row' id='minmax-selection-filterArea'> \
		<div class='col-md-3'>Det ID Filter</div> \
		<div class='col-md-9'>\
			<input type='text' id='minmaxDetIDFilter' placeholder='empty or eg. 353309700'></input>\
		</div></row>");

	////////////////////////////////////////////////////////////////

	$("#plotSaveBtn").on('click', function(){
		var img = $('#thePlot')[0].toDataURL("image/png");

		var afake = $("<a></a>").attr("href", img).attr("download", "plot" + savedPlots++ + ".png").css("display", "none").html("Link").appendTo("body");

        $(afake)[0].click();
        window.setTimeout(function () {
            $(afake).remove();
        }, 200);

	});

	$("#resetViewBtn").on('click', function(){
		thisChart.resetZoom();
	});

	$("#careAboutRunLength, #superimposeData").on('change', function()
	{
		$("#plotImages").click();
	});

	$("#plotImages").on("click", function(){
		console.log("Process Started!");
		
		//packing things tight
		var objs = $(".module-selection input[id^='module']:checked");
		console.log(objs.length + " modules to monitor");

		var moduleStr = "";
		for (i = 0; i < objs.length; ++i)
		{
			var sub = $(objs[i]).attr("id").substr(6, 2);
			moduleStr = moduleStr + sub + "/";
		}

		// objs = $(".option-selection input[id^='option']:checked");
		objs = $("#stripOptionSelection, #pixelOptionSelection").find("input[id^='option']:checked");
		console.log(objs.length + " options to monitor");
		var optionStr = "";
		for (i = 0; i < objs.length; ++i)
		{
			var sub = $(objs[i]).attr("id").substr(7, 2);
			if (sub[1] == "-") sub = sub[0];
			optionStr = optionStr + sub + "/";
		}

		if ($("#module60").is(":checked")) //small workaround - inserting fake option
		{
			optionStr = optionStr + "10/";
		}
		// NOW ALMOST THE SAME FOR MINMAX TREND PLOTS
		objs = $(".minmaxPanel input[id^='option']:checked");
		console.log(objs.length + " minmax plots to prepare");
		var minmaxOptionStr = "";
		for (i = 0; i < objs.length; ++i)
		{
			var currID = $(objs[i]).attr("id");
			var currIDSpl = currID.split("-");
			minmaxOptionStr += currIDSpl[2] + "-" + currIDSpl[3] + "/";
		}
		// TMP SOLUTION
		// minmaxOptionStr = "NumberOfCluster-max/NumberOfOfffTrackCluster-max/size-max/";

		var minmaxDetIDFilter = $("#minmax-selection-filterArea #minmaxDetIDFilter").val();
		console.log("minmax option: " + minmaxOptionStr + "\tDETID: " + minmaxDetIDFilter);

		var start = "";
		var end = "";

		var is_expertModeOn = $("#expertModeToggle").parent().hasClass("off") == false;
		var query = "";

		if (is_expertModeOn)
		{
			query = $('#expertQuery').val();
		}
		else
		{
			if ($("#runDateToggle").parent().hasClass("off") == false)
			{
				start = $(".option-selection #runMin").val();
				end = $(".option-selection #runMax").val();

				query = "where r.runnumber between " + start + " and " + end + " ";
			} 
			else
			{
				start = $("#datepicker #dateStart").val();
				end = $("#datepicker #dateEnd").val();

				query = "where r.starttime between to_date('" + start + "', '" + dateFormat + "') and to_date('" + end + "', '" + dateFormat + "') ";
			}
		}

		var is_runByRunOn = $("#careAboutRunLength").parent().hasClass("off");
		var is_superimpose = !$("#superimposeData").parent().hasClass("off");
		var is_beamData = $("#beam-cosmics-switch").parent().hasClass("off");

		var subDataSet = $.trim($("#propmtRecoDataset").val());
		subDataSet = (subDataSet == "") ? ((is_beamData) ? "StreamExpress" : "StreamExpressCosmics" ): subDataSet;
	
		console.log("Complete set of parameters:");
		console.log("\tmodules: " + moduleStr);
		console.log("\toptions: " + optionStr);
		console.log("\tis expert mode on?: " + is_expertModeOn);
		console.log("\tquery content: " + query);
		console.log("\tis beam data on?: " + is_beamData);
		console.log("\tsub data set: " + subDataSet);

		// return;

		$("#plotImages").css("background-image", "url(\"img/magnify.gif\")");

		$.post("php/getDataFromFile.php", {query : query,
										   moduleStr : moduleStr,
										   optionStr : optionStr,

										   minmaxOptionStr : minmaxOptionStr,
										   minmaxDetIDFilter : minmaxDetIDFilter,

										   beamDataOn : is_beamData ? 1 : 0,
										   subDataSet : subDataSet,
										   // subDataSet : "StreamExpress"

										   }, function(data){
												$("#plotImages").css("background-image", "");
												console.log(data);
												
												CreatePlot(data, is_runByRunOn, is_superimpose);

										        $('html, body').animate({
										            scrollTop: $("#plotContainer").offset().top
										        }, 500);

												$("#plotControlPanel").css("display", "block");
												
										   }
										   , "json"
										   );
	});

});