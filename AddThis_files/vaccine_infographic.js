// vaccine_infographic.js

!function ($) {


	$(function () {
		// initialize skrollr if the window width is large enough

		if ($(window).width() > 801) {
		  skrollr.init({
		  	smoothScrolling: true,
		  	smoothScrollingDuration: 600,
		     easing: {
		        sin: function(p) {
		           return (Math.sin(p * Math.PI * 2 - Math.PI/2) + 1) / 2;
		        },
		        cos: function(p) {
		           return (Math.cos(p * Math.PI * 2 - Math.PI/2) + 1) / 2;
		        }
		     }
		  });
		} else {
		  $('.scroll-canvas').hide();
		}

		// disable skrollr if the window is resized below 768px wide
		$(window).on('resize', function () {
		  if ($(window).width() <= 800) {
		    skrollr.init().destroy(); // skrollr.init() returns the singleton created above
			  $('.scroll-canvas').hide();
		  } else {
		  	skrollr.init({
		  	   easing: {
		  	      sin: function(p) {
		  	         return (Math.sin(p * Math.PI * 2 - Math.PI/2) + 1) / 2;
		  	      },
		  	      cos: function(p) {
		  	         return (Math.cos(p * Math.PI * 2 - Math.PI/2) + 1) / 2;
		  	      }
		  	   }
		  	});
		  	$('.scroll-canvas').show();
		  }
		});



	  	//global vars for boards
		var board1 = d3.select('.board-one');
		var board2 = d3.select('.board-two');
		var board3 = d3.select('.board-three');
		var board4 = d3.select('.board-four');
		var board5 = d3.select('.board-five');
		var board6 = d3.select('.board-six');
		var syringeAnimationFired = false;
		var mobileSize = 500;

	  	//data sets
	  	var data = window.diseaseData[0];

	  	var $graphOne;
	  	var $graphTwo;
	  	var $graphThree;
	  	var $graphFour;
	  	var $graphFive;
	  	var $graphSix;
		var firedGraphOne = false;
		var firedGraphTwo = false;
		var firedGraphThree = false;
		var firedGraphFour = false;
		var firedGraphFive = false;
		var firedGraphSix = false;
		var infographOffset = 500;
		var infographicHidden;
		var wowInitialized = false;


		function showMobile() {
			var width = $(window).width();
			var rowOne = d3.select('.row-one');
			var rowTwo = d3.select('.row-two');

			if (width <= mobileSize) {
				d3.select('.mobile-row').classed('hidden', false);
				rowOne.classed('hidden', true);
				rowTwo.classed('hidden', true);
			} else {
				rowOne.classed('hidden', false);
				rowTwo.classed('hidden', false);
			}
		}

		//left button
		$('#left-mobile-select').on('click', function(){
			var $lastThree = $('.mobile-nav').slice(3, 6);
			$('.mobile-nav:first').before($lastThree);
			$.each($('.mobile-nav'), function(index, item) {
				$(item).removeClass('show').addClass('hide');
				if(index == 0 || index == 1 || index == 2) {
					$(item).removeClass('hide').addClass('show')
				}
			})
		});
		//right button
		$('#right-mobile-select').on('click', function(){
			var $firstThree = $('.mobile-nav').slice(0, 3);
			$('.mobile-nav:last').after($firstThree);
			$.each($('.mobile-nav'), function(index, item) {
				$(item).removeClass('show').addClass('hide');
				if(index == 0 || index == 1 || index == 2) {
					$(item).removeClass('hide').addClass('show')
				}
			})
		});


 		// all scroll events: render graphs, animations, etc...
 		$(window).on('scroll', function(e) {
 			var fired = false;
 			var top = e.currentTarget.scrollY;
 			var width = $(window).width();

 			// global variable
 			infographicHidden = $('.infographic:hidden').is(':hidden') ? true : false;

 			// animation events that fire only once...acts like WOW
 			if (!fired && !infographicHidden && width >= mobileSize) {
 				$('.row-one, .row-two').removeClass('hidden');

 				$graphOne = $('.graph-one').offset().top - infographOffset;
 				$graphTwo = $('.graph-two').offset().top - infographOffset;
 				$graphThree = $('.graph-three').offset().top - infographOffset;
 				$graphFour = $('.graph-four').offset().top - infographOffset;
 				$graphFive = $('.graph-five').offset().top - infographOffset;
 				$graphSix = $('.graph-six').offset().top - infographOffset;

 				if (top >= $graphOne && !firedGraphOne) {
 					new Graph(data.diphtheria.disease, board1);
 					firedGraphOne = true;
 				}
 				if (top >= $graphTwo && !firedGraphTwo) {
 					new Graph(data.diphtheria.vaccine, board2);
 					firedGraphTwo = true;
 				}
 				if (top >= $graphThree && !firedGraphThree) {
 					new Graph(data.measles.disease, board3);
 					firedGraphThree = true;
 				}
 				if (top >= $graphFour && !firedGraphFour) {
 					new Graph(data.measles.vaccine, board4);
 					firedGraphFour = true;
 				}
 				if (top >= $graphFive && !firedGraphFive) {
 					new Graph(data.diphtheria.disease, board5);
	 				firedGraphFive = true;
 				}
 				if (top >= $graphSix && !firedGraphSix) {
 					new Graph(data.diphtheria.vaccine, board6);
 					firedGraphSix = true;
 				}
 			}

 			if (!fired && !infographicHidden && width < mobileSize) {
 				showMobile();

 				$graphFive = $('.graph-five').offset().top - infographOffset;
 				$graphSix = $('.graph-six').offset().top - infographOffset;

				if (top >= $graphFive && !firedGraphFive) {
		  	 		new MobileGraph(data.diphtheria.disease, board5);
		  	 		firedGraphFive = true;
				}
				if (top >= $graphSix && !firedGraphSix) {
		  			new MobileGraph(data.diphtheria.vaccine, board6);
		  			firedGraphSix = true;
		  		}
 			}

			setTimeout(function() {
				fired = true;
			}, 1000)

			if (!wowInitialized && !infographicHidden) {
				// initialize wow for scroll animation
				var wow = new WOW({
				    boxClass:     'wow',      // animated element css class (default is wow)
				    animateClass: 'animated', // animation css class (default is animated)
				    mobile:       false,       // trigger animations on mobile devices (default is true)
				    live:         true,       // act on asynchronously loaded content (default is true)
				    callback:     function(box) {
				      // the callback is fired every time an animation is started
				      // the argument that is passed in is the DOM node being animated
				      var transformOrigin = box.getAttribute('data-transform-origin');
				      if (transformOrigin) {
				      	box.style.webkitTransformOrigin = transformOrigin;
				      	box.style.msTransformOrigin = transformOrigin;
				      	box.style.transformOrigin = transformOrigin;
				      }
				    },
				    scrollContainer: null // optional scroll container selector, otherwise use window
				});
				wow.init();
				wowInitialized = true;
			}
 		});

 		// click events for mobile graph
	  	$(".mobile-row .slide-viewer .slide-group").on("click", function(e) {
	  		var currentDisease = e.target.dataset.disease;
	  		var currentDiseaseData = data[currentDisease].disease;
	  		var currentVaccineData = data[currentDisease].vaccine;
	  		var currentDiseaseID = e.target.id; 

  			if (currentDiseaseID === 'diphtheria-mobile' || 
  				currentDiseaseID === 'tetanus-mobile' || 
  				currentDiseaseID === 'pertussis-mobile') {
  				d3.select('.vaccine-type')
  					.text('DTAP')
  			}
  			else {
  				d3.select('.vaccine-type')
  					.text('MMR')		
  			}

			$(this).closest('.mobile-row').find('.tooltip-mobile').remove();

			showHideSources(currentDisease);

			var mobileGraph1 = new MobileGraph(currentDiseaseData, board5);
			var mobileGraph2 = new MobileGraph(currentVaccineData, board6);
		});

		function showHideSources(selection) {
			var firstThreeLetters = selection.substring(0,3);

			d3.selectAll('.graph-five .source-mobile a').classed('hidden', true);

			d3.select('.' + firstThreeLetters + '-mobile').classed('hidden', false);
			d3.select('.' + firstThreeLetters).classed('hidden', false);
		}

		//click events for row one graph
	  	$(".row-one .disease-items span").on("click", function(e) {
	  		var currentDisease = e.currentTarget.dataset.disease;
	  		var currentDiseaseData = data[currentDisease].disease;
	  		var currentVaccineData = data[currentDisease].vaccine;
	  		var $graphRow = $(this).closest('.graph-row');

			$graphRow.find('.tooltip').remove();
			$graphRow.find('.mobile-sources').addClass('hidden');

			showHideSources(currentDisease);

			var graph1 = new Graph(currentDiseaseData, board1);
			var graph2 = new Graph(currentVaccineData, board2);
		});

	  	// click events for row two graph
	  	$(".row-two .disease-items span").on("click", function(e) {
	  		var currentDisease = e.currentTarget.dataset.disease;
	  		var currentDiseaseData = data[currentDisease].disease;
	  		var currentVaccineData = data[currentDisease].vaccine;
	  		var $graphRow = $(this).closest('.graph-row');

			$graphRow.find('.tooltip').remove();
			$graphRow.find('.mobile-sources').addClass('hidden');

			showHideSources(currentDisease);

			var graph3 = new Graph(currentDiseaseData, board3);
			var graph4 = new Graph(currentVaccineData, board4);
		});



/*============================ graph ====================*/
		function Graph(disease, location) {
			this.gVar = {
				width:  $(window).width() / 2,
				height: board1.style('height'),
				margin: 20,
				h: 500,
			}
			this.gVar.w = this.gVar.width;

			this.disease = disease;
			this.location = location;

			this.renderGraph();
		};

		Graph.prototype.renderGraph = function() {
			this.location.selectAll('g').remove();

			this.gVar.xScale = d3.scale
				.ordinal()
				.domain(d3.range(this.disease.length))
				.rangeRoundBands([this.gVar.margin, this.gVar.w - this.gVar.margin], 0.90);

			this.gVar.yScale = d3.scale
				.linear()
				.domain([1000000, 0])
				.range([this.gVar.h - this.gVar.margin, this.gVar.margin]);

			this.renderAxis();
		};

		Graph.prototype.renderAxis = function() {
			this.createYAxis();
		}

		Graph.prototype.createYAxis = function() {
			var that = this;

		   	this.yAxis = d3.svg.axis() 
			   	.scale(this.gVar.yScale)
				.orient("left")
				.ticks(3)
				.tickFormat(function(d, i) {
					return that.gVar.h - (d / 1000000) - 499;
				})

			this.appendYAxis();
		}
		
		Graph.prototype.appendYAxis = function() {
			this.location.append("g")
				.attr("class", "y-axis")
				.attr("transform", "translate(" + (this.gVar.margin + 20) + ",0)")
				.call(this.yAxis)
				.append("text")
				.text("Million people") 
				.attr("transform", "rotate (-90, -22, 0) translate(-110)");

			this.appendYAxisTicks();
		}

		Graph.prototype.appendYAxisTicks = function() {
			var that = this;

			this.location.selectAll('g.y-axis g.tick')
				.append("line")
					.classed('grid-line', true)
					.attr('x1', 0)
					.attr("x2", this.gVar.width)
					.attr("y1", 0)
					.attr("y2", 0)

			for (var j = .333; j <= 1; j += .445) {
				this.location.selectAll('g.y-axis')
					.append('g')
						.classed('grid-minor', true)
						.append('line')
							.classed('grid-line', true)
							.attr('x1', 0)
							.attr('x2', this.gVar.width)
							.attr('y1', function(d, i) { 
								return that.gVar.h * j - that.gVar.margin;
							})
							.attr('y2', function(d, i) {
								return that.gVar.h * j - that.gVar.margin;
							})
			}

			this.renderBars();
		}

		Graph.prototype.renderBars = function() {
			var that = this;

			//Create bars by adding a g element for anchor
			this.location.selectAll("g.rect-container")
				.data(this.disease)
				.enter()
				.append("g")
					.attr('class', 'rect-container')
					.append('rect')
						.classed('the_rects_one rect', true)
						.attr("x", function(d, i) {
							return that.gVar.xScale(i);
						})
						.attr("y", function(d) { return that.gVar.h; })  
						.attr("width", function(d,i) {
							if(that.disease.length ==  '1') {
								return 13;
							} else
							return that.gVar.xScale.rangeBand(); 
						})
						.transition()
						.ease('bounce')
						.delay(function (d,i){ return i * 75;})
						.duration(2000)
						.attr("height", function(d) {
							return that.gVar.yScale(d.amount - 40000);
						})
						.attr("y", function(d) {
							return that.gVar.h - that.gVar.yScale(d.amount);
						})
						.attr("fill", function(d) { 
							return getFillColor(d.severity);
						})

			this.renderCircles();
		};

		Graph.prototype.renderCircles = function() {
			var that = this;

			this.location.selectAll("g.rect-container")
				.append('circle')
					.classed('circle', true)
					.attr('id', 'myCir')
					.style("fill", "transparent")
					.style('stroke', function(d) {
						return getFillColor(d.severity);
					})
					.style('stroke-width', 2)
					.attr('r', 0)
					.attr('cy', function(d, i) {
						return that.gVar.h;
					})
					.attr('cx', function(d,i) {
						if(that.disease.length == '1') {
							return gVar.xScale(i) + (that.gVar.xScale.rangeBand(d.amount) / 2) - 15;
						} else
						return that.gVar.xScale(i) + (that.gVar.xScale.rangeBand(d.amount) / 2);
					})
					.transition()
					    .delay(function (d,i){ return (i * 75); })
			 			.duration(2000)
			 			.ease('bounce')
						.each(function(d,i) {
							that.renderToolTips(d, i, this);
						})
						.attr("cx", function(d, i) {
							if(that.disease.length == '1') {
								return that.gVar.xScale(i) + (that.gVar.xScale.rangeBand(d.amount) / 2) - 15;
							} else
							return that.gVar.xScale(i) + (that.gVar.xScale.rangeBand(d.amount) / 2);
						})
						.attr("cy", function(d) {
							if(that.disease.length == '1') {
								return that.gVar.h - that.gVar.yScale(d.amount) - that.gVar.xScale.rangeBand() + 30;
							} else
							return that.gVar.h - that.gVar.yScale(d.amount) - (that.gVar.xScale.rangeBand() * .75);
						})
						.attr("r", function(d,i) {
							if(that.disease.length == '1') {
								return 13;
							} else
							return that.gVar.xScale.rangeBand() * .75; 
						})
		};

		Graph.prototype.renderToolTips = function(data, idx, thisContext) {
			var width = parseInt($('.triangle-border').css('width'));

			if(data.amount >= 900000) {
				this.height = parseInt(this.gVar.yScale(data.amount) - 300, 10);
			} else {
				this.height = parseInt(this.gVar.yScale(data.amount) + 4, 10);	
			}

			this.delay = idx * .20;

			this.html = "<div class='tooltip triangle-border wow animated bounceInUp' data-wow-delay='" + this.delay + "s'" + 
				"data-wow-duration='2s' data-wow-offset='-1000' style='position: absolute; background: " + backgroundSelect(this.location) +
				";left: " + parseInt(this.gVar.xScale(idx) - (width / 2) + (this.gVar.xScale.rangeBand() / 2), 10) + "px; bottom: " + 
				(this.height - 10) + "px;'>" +
		  		"<p class='symptom'>" + data.symptom + "</p>" +
		  		"<span class='value-two' style='color: " + getFillColor(data.severity) + ";'>" + data.amount / 10000 + "%</span>" +
		  		"<span class='man-icon'></span>" +
		  		"<span class='value'>" + data.amount.toLocaleString() + "</span>" +
				"</div>";

			$(thisContext).closest('.board-svg').append(this.html)
		};



/*============================ mobile graph ====================*/
		function MobileGraph(disease, location) {
			this.gVar = {
				width: $(window).width(),
				height: board1.style('height'),
				margin: 20,
				axisAdder: 150 

			};
			this.gVar.h = this.gVar.width;
			this.gVar.w = this.gVar.width + 270;

			this.disease = disease;
			this.location = location;

			this.renderMobileGraph();
		}

		MobileGraph.prototype.renderMobileGraph = function(){
			this.location.selectAll('g').remove();

			this.gVar.xScale = d3.scale
				.ordinal()
				.domain(d3.range(this.disease.length))
				.rangeRoundBands([this.gVar.margin, this.gVar.w - this.gVar.margin], 0.90);

			this.gVar.yScale = d3.scale
				.linear()
				.domain([1000000, 0])
				.range([this.gVar.h - this.gVar.margin, this.gVar.margin]);

			this.renderMobileAxis();
		};

		MobileGraph.prototype.renderMobileAxis = function() {
			this.createMobileYAxis();
		}

		MobileGraph.prototype.createMobileYAxis = function() {
		   	this.yAxis = d3.svg.axis() 
			   	.scale(this.gVar.yScale)
				.orient("left")
				.ticks(3)
				.tickFormat(function(d, i) {
					return -(d / 1000000) + 1;
				})

			this.appendMobileYAxis();
		}

		MobileGraph.prototype.appendMobileYAxis = function() {
			this.location.append("g")
				.attr("class", "y-axis")
				.attr("transform", "translate(" + (this.gVar.margin + 35) + ",0)")
				.call(this.yAxis)
				.append("text")
				.text("Million people") 
				.attr("transform", "rotate (-90, -22, 0) translate(-380)");
			
			this.appendMobileYAxisTicks();
		}

		MobileGraph.prototype.appendMobileYAxisTicks = function() {
			var that = this;

			this.location.selectAll('g.y-axis g.tick')
				.append("line")
					.classed('grid-line', true)
					.attr('x1', 0)
					.attr("x2", this.gVar.width + this.gVar.axisAdder)
					.attr("y1", 0)
					.attr("y2", 0)

			for (var j = .333; j <= 1; j += .445) {
				this.location.selectAll('g.y-axis')
					.append('g')
						.classed('grid-minor', true)
						.append('line')
							.classed('grid-line', true)
							.attr('x1', 0)
							.attr('x2', this.gVar.width + this.gVar.axisAdder)
							.attr('y1', function(d, i) { 
								return that.gVar.h  * j - that.gVar.margin;
							})
							.attr('y2', function(d, i) {
								return that.gVar.h * j - that.gVar.margin;
							})
			}
			
			this.renderMobileBars();
		}

		MobileGraph.prototype.renderMobileBars = function() {
			var that = this;

			//Create bars by adding a g element for anchor
			this.location.selectAll("g.rect-container")
				.data(this.disease)
				.enter()
				.append("g")
					.attr('class', 'rect-container')
					.append('rect')
						.classed('the_rects_one rect', true)
						.attr("x", function(d, i) {
							return that.gVar.xScale(i);
						})
						.attr("y", function(d) { return that.gVar.h; })  
						.attr("width", function(d,i) {
							return that.gVar.xScale.rangeBand(); 
						})
						.transition()
							.ease('bounce')
							.delay(function (d,i){ return i * 200;})
							.duration(2000)
							.attr("height", function(d) {
								return that.gVar.yScale(d.amount - 40000);
							})
							.attr("y", function(d) {
								return that.gVar.h - that.gVar.yScale(d.amount);
							})
							.attr("fill", function(d) { 
								return getFillColor(d.severity);
							});

			this.renderMobileCircles();
		};

		MobileGraph.prototype.renderMobileCircles = function() {
			var that = this;

			this.location.selectAll("g.rect-container")
				.append('circle')
					.classed('circle', true)
					.attr('id', 'myCir')
					.style("fill", "transparent")
					.style('stroke', function(d) {
						return getFillColor(d.severity);
					})
					.style('stroke-width', 4 )
					.attr('r', 0)
					.attr("cy", function(d) {
						return that.gVar.h;
					})
					.attr('cx', function(d,i) {
						return that.gVar.xScale(i);
					})
					.transition()
						.delay(function (d,i) { return i * 200; })
						.ease('bounce')
			 			.duration(2000)
			 			.each(function(d,i) {
			 				that.renderMobileToolTips(d, i, this);
			 			})
						.attr("cx", function(d, i) {
							return that.gVar.xScale(i) + (that.gVar.xScale.rangeBand(d.amount) / 2);
						})
						.attr("cy", function(d) {
							return that.gVar.h - that.gVar.yScale(d.amount) - that.gVar.xScale.rangeBand();
						})
						.attr("r", function(d,i) {
							return that.gVar.xScale.rangeBand(); 
						})
		};

		MobileGraph.prototype.renderMobileToolTips = function(data, idx, thisContext) {
			var height;

			if(data.amount >= 900000) {
				height = parseInt(this.gVar.yScale(data.amount) - 90, 10);
			} else {
				 height = parseInt(this.gVar.yScale(data.amount) + 180, 10);	
			}

			this.html = "<div class='tooltip-mobile mobile-triangle-border left' style='position: absolute; background: "+ backgroundSelect(this.location)+"; left: " + 
						parseInt(this.gVar.xScale(idx) - 67, 10) + "px; bottom: " + height + "px;'>" +
				  		"<p class='symptom'>" + data.symptom + "</p>" +
				  		"<span class='value-two' style='color: " + getFillColor(data.severity) + ";'>" + data.amount / 10000 + "%</span>" +
				  		"<div class='tooltip-text'>" +
				  		"<span class='man-icon'></span>" +
				  		"<span class='value'>" + data.amount + "</span>" +
				  		"</div>" +
					"</div>";

			$(thisContext).closest('.board').append(this.html)
		};


		function backgroundSelect(location) {
			if(location == board1 || location == board3 || location == board5) {
				return '#192229';
			} else {
				return '#20292F';
			}
		};

		function getFillColor(severity) {
			if (severity.severe) {
				return 'rgb(228, 64, 70)';
			} else if (severity.mild) {
				return 'rgb(223,200,63)';
			} else {
				return 'rgb(217,140,81)';
			}
		}



		//toggle class for selected diseases for graph
		$('.disease-nav').on('click', function(e) {
			e.preventDefault();
			$(this).siblings().removeClass('diseaseSelected');
			$(this).addClass('diseaseSelected');
		});

		$('.ingredient-item').on('click', function(e) {
			e.preventDefault();
			$(this).siblings().addBack().removeClass('selected');
			$(this).addClass('selected');

			$('.ingredient-selected').removeClass('ingredient-selected');
			var targetIngredient = e.target.dataset.ingredientNum;
			$('#' + targetIngredient).addClass('ingredient-selected');
		});

		// handle infographic toggling show/hide
		$('.post-preview').on('click', function(e) {
			var hidden = $('.vac-infographic').css('display') === 'none' ? true : false;
			var $overlay = $('.header-section .overlay');
			var $canvas = $('.header-section, .scroll-canvas');
			var $tagline = $('.header-section .tagline');
			var timing = 2000;

			window.scrollBy(0,1);
			$canvas.animate(function() {
				height: '100vh'
			}, 1000);

			// slide the infographic up/down, depending on current state
			$('.vac-infographic').slideToggle({
				duration: timing, 
				start: function() {
					if (!hidden) {
						$('html,body').animate({scrollTop: 0}, timing);
						// show overlay on scroll-canvas
						$overlay.removeClass('open');
						// shrink scroll-canvas size by removing expand class
						// $canvas.removeClass('expand');
						// set infographicHidden variable
						infographicHidden = true;
					} else {
						// remove overlay on scroll-canvas
						$overlay.addClass('open');
						// grow scroll-canvas size by appending expand class
						// $canvas.addClass('expand');
						// set infographicHidden variable
						infographicHidden = false;
					}
				}
			});
		});

		$('.slider-buttons').on('click', function(e) {
			var targ = e.target.id;
			var $parentSlider = $(this).closest('.slider');

			if (targ === 'left') {
				sliderLeft($parentSlider);
			} else {
				sliderRight($parentSlider);
			}
		});

		// scroll through ingredient items, left
		function sliderLeft($parentSlider) {
			$parentSlider.find('.selected').animate({opacity: 0}, function() {
				var $firstSliderTarget = $parentSlider.find('.slider-targets').children().eq(0);
				var $firstSliderItem = $parentSlider.find('.slider-items').children().eq(0);

				$firstSliderTarget.removeClass('selected');
				$firstSliderItem.removeClass('ingredient-selected');

				$firstSliderTarget.appendTo($parentSlider.find('.slider-targets'));
				$firstSliderItem.appendTo($parentSlider.find('.slider-items'));

				$parentSlider.find('.slider-targets').children().css('opacity', 1).eq(0).addClass('selected');
				$parentSlider.find('.slider-items').children().eq(0).addClass('ingredient-selected')
			});
		}

		// scroll through ingredient items, right
		function sliderRight($parentSlider) {
			$parentSlider.find('.selected, .ingredient-selected').animate({opacity: 0}, function() {
				var $firstSliderTarget = $parentSlider.find('.slider-targets').children().eq(0);
				var $firstSliderItem = $parentSlider.find('.slider-items').children().eq(0);

				$firstSliderTarget.removeClass('selected');
				$firstSliderItem.removeClass('ingredient-selected');

				$firstSliderTarget.siblings().eq(-1).prependTo($parentSlider.find('.slider-targets')).css('opacity', 1);
				$firstSliderItem.siblings().eq(-1).prependTo($parentSlider.find('.slider-items'));

				$parentSlider.find('.slider-targets').children().eq(0).addClass('selected');
				$parentSlider.find('.slider-items').children().eq(0).addClass('ingredient-selected')
			});
		}

	});

}(window.jQuery);
