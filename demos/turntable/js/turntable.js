;(function($){
	var tween = {
	    easeOutSine: function(x) {
	        return Math.sin(x * (Math.PI / 2));
	    },
	    easeInOutSine: function(x) {
	        return -0.5 * (Math.cos(Math.PI * x) - 1);
	    },
	    easeInOutCirc: function(x) {
	        return ((x /= 0.5) < 1) ? (-0.5 * (Math.sqrt(1 - x * x) - 1)):(0.5 * (Math.sqrt(1 - (x -= 2) * x) + 1));
	    },
	    easeOutCirc: function (x) {
	    	return Math.sqrt( 1 - Math.pow( x - 1, 2 ) );
	    },
	    easeOutQuint: function (x) {
	    		return 1 - Math.pow( 1 - x, 5 );
	    	},
	    easeInOutElastic: function (x) {
	    	return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ?
	    		-( Math.pow( 2, 20 * x - 10 ) * Math.sin( ( 20 * x - 11.125 ) * ( 2 * Math.PI ) / 4.5 )) / 2 :
	    		Math.pow( 2, -20 * x + 10 ) * Math.sin( ( 20 * x - 11.125 ) * ( 2 * Math.PI ) / 4.5 ) / 2 + 1;
	    },
	    easeOutExpo: function (x) {
	    		return x === 1 ? 1 : 1 - Math.pow( 2, -10 * x );
	    },
	    easeOutCubic: function (x) {
	    		return 1 - Math.pow( 1 - x, 3 );
	    },
	};
	var prefix = function(p) {
		var style = document.createElement('div').style;
		if (p in style) return p;
		var prefixs = ['webkit', 'Moz', 'ms', 'O'],
		    i = 0,
		    l = prefixs.length,
		    s = '',
		    prefix = '';
		for (; i < l; i++) {
			prefix = prefixs[i];
		    s = prefixs[i] + '-' + p;
		    s = s.replace(/-\D/g, function(match) {
		        return match.charAt(1).toUpperCase();
		    });
		    if (s in style) return '-'+prefix.toLowerCase()+'-';
		}
	};
	console.log(prefix('transform'));
	function Turntable(ele,options) {
		this.element = $(ele);
		this.arc = 0;
		this.defaults = {
			'turntableBgSelector': '',
			'turntableBtnSelector': '',
			'bgWidth': '',
			// width height
			'btnRect': [],
			'duration': 1000,
			'ease': 'easeOutSine',
			'sections': [
				{
					"name":'',
					'text':'',
					'color': ''
				}
			],
		};
		this.options = $.extend({},this.defaults, options);
		this._ease = tween[this.options.ease]||tween.easeInOutCirc;
		this._animating = false;
		this.cache = {};
		// console.log(this._ease);
	}

	Turntable.prototype = {
		init: function(){
			this.setRect();
			this.drawCanvas();
		},
		setRect: function() {
			var $turntableBg = this.turntableBg = this.element.find(this.options.turntableBgSelector),
			    $turntableBtn = this.turntableBtn = this.element.find(this.options.turntableBtnSelector);


			// windowWidth/this.options.bgWidth
			var bgWidth = this.options.bgWidth||$turntableBg.innerWidth(),
				bgHeight = this.options.bgWidth||$turntableBg.innerHeight(),
				btnWidth = this.options.btnRect[0]||$turntableBtn.innerWidth(),
				btnHeight = this.options.btnRect[1]|$turntableBtn.innerHeight();

			var sections = this.options.sections;
			var arc = 2 * Math.PI / (sections.length);

			var windowWidth = $(window).width();
			this.rect = {
				center: {
					x: bgWidth/2,     // 坐标中心
					y: bgHeight/2,		
					r: bgWidth/2		// 画布半径
				},
				bg:{
					width: bgWidth,   // 背景
					height: bgHeight
				},
				btn: {
					width: btnWidth,   // 中间按钮
					height: btnHeight					
				},
				textRadius: bgWidth*150/500,  //文字位置
				arc: arc,      // 每个区域所占角度
				maxWindowWidth: 750,
				bgWindowRatio: bgWidth/windowWidth,
				btnWindowWRatio: btnWidth/windowWidth,
				btnWindowHRatio: btnHeight/windowWidth,
				textRadiusbgWidthRatio: 150/500
			};
			console.log('750',this.rect.bgWindowRatio);
		},
		drawCanvas: function(windowWidth) {
			var bgctx = this.turntableBgctx  = this.turntableBg[0].getContext("2d"),
			    btnctx = this.turntableBtnctx  = this.turntableBtn[0].getContext("2d");
			var sections = this.options.sections,
				bgWidth = windowWidth * this.rect.bgWindowRatio || this.rect.bg.width,
				bgHeight = windowWidth * this.rect.bgWindowRatio || this.rect.bg.height,				
				btnWidth = windowWidth * this.rect.btnWindowWRatio || this.rect.btn.width,
				btnHeight = windowWidth * this.rect.btnWindowHRatio || this.rect.btn.height,

				centerX = bgWidth/2,
				centerY = bgHeight/2,
				arc = this.rect.arc,
				radius = windowWidth ? bgWidth/2:this.rect.center.r;
				textRadius = windowWidth? this.rect.textRadiusbgWidthRatio*bgWidth :this.rect.textRadius;

			console.log("arc",arc);
			bgctx.clearRect(0,0,bgWidth,bgHeight);
			var bgImg = new Image();
			bgImg.onload = function() {
				bgctx.strokeStyle = "rgba(0,0,0,0)";
				bgctx.drawImage(bgImg, 0, 0, bgWidth, bgHeight); 
				var angle = 0;
				for (var i = 0, len = sections.length ; i < len ; i++) {
					angle = i * arc;

					// 传到每个 section 里
					// TO DO

					console.log(angle);
					bgctx.fillStyle = sections[i].color;
					bgctx.beginPath();

					// 绘内填充
					//arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
					bgctx.arc(centerX, centerY, radius-bgWidth*200/500, angle, angle + arc, false);

					// 绘黄边    
					bgctx.arc(centerX, centerY, radius-bgWidth*30/500, angle + arc, angle, true);
					bgctx.stroke();  
					bgctx.fill();
					//锁画布(为了保存之前的画布状态)
					bgctx.save();  

					bgctx.fillStyle = "#000";
					bgctx.translate(centerX,centerY);

					// 垂直正中心 + 每次转的度数
					bgctx.rotate(0.5 * Math.PI + angle + arc/2);

					bgctx.fillText(sections[i].text,-bgctx.measureText(sections[i].text).width / 2,-textRadius);
					// bgctx.fillText(sections[i].text,bgWidth/2+Math.cos(angle-arc/2)*150,bgHeight/2+Math.sin(angle-arc/2)*150);

					bgctx.restore();
				}

			};
			// bgctx.translate(centerX,centerY);
			// bgctx.rotate(0.2);
			bgImg.src = 'images/turnplate-bg.png';

			btnctx.clearRect(0,0,btnWidth,btnHeight);
			var btnImg = new Image();
			btnImg.onload = function() {
				btnctx.drawImage(btnImg, 0, 0, btnWidth, btnHeight); 
			};
			btnImg.src = 'images/turnplate-pointer.png';

			return this;
		},
		animate: function(index,callback) {
			var _self = this,
				arc = this.rect.arc,
				ease = this._ease,
				duration = this.options.duration,
				startTime = +new Date();
			var angleDeg = 0.75*360 - ( arc/2 + index * arc)/Math.PI*180 + 720;
			if (this._animating) {
				return;
			}
			console.log('点击了旋转index',index);
			callback = callback || this.options.onSuccess;
			// var angleDeg = 0.75*360 - ( arc/2 + index * arc)/Math.PI*180 + 720;

			setStyle(this.turntableBg,'transform-origin','50% 50% 0');
			function setTransform(angle) {
			    angle = (angle % 360) || 0;
			    setStyle(_self.turntableBg,'transform','rotate(' + angle + 'deg)');
			}
			function setStyle($el,styleKey,styleValue) {
				if (!_self.cache[styleKey]) {
					_self.cache[styleKey] = prefix(styleKey);
				}
				$el.css(_self.cache[styleKey] || prefix(styleKey),styleValue);
			}
			rotating();
			function rotating(angle) {
				_self._animating = true;
				var nowTime = +new Date(),
				    timestamp = nowTime - startTime,
				    delta = ease(timestamp / duration);
				var callee = arguments.callee;

				setTransform(delta*angleDeg);
				if (timestamp >= duration) {
					clearTimeout(_self.timer);
					_self.arc = 0;
					setTransform(angleDeg);
					_self._animating = false;
					callback($.extend({},_self.options.sections),index);
					return;
				} else {
					_self.timer = setTimeout(rotating, 10);
				}
			}
		},
	};


	$.fn.turntable = function(options,paramArray) {
		var $this,name,instance;
		return this.each(function(){
			$this = $(this);
			name = $.fn.turntable.info.name;
			instance = $this.data(name);

			if ( !instance ) {
				instance = new Turntable(this,options);
				instance.init();
				$(window).on('resize', function(event) {
					setTimeout(function(){
						var windowWidth = $(window).width();
						var canvasBgWidth;
						if (windowWidth>750) {
							canvasBgWidth = 750;
						} else if (windowWidth<320) {
							canvasBgWidth = 320;
						} else {
							canvasBgWidth = windowWidth * 500/750;
						}
						var canvasBtnWidth = canvasBgWidth * 133/500;
						var canvasBtnHeight = canvasBgWidth * 179/500;
						if (instance.turntableBg) {
							instance.turntableBg.attr({
								width: canvasBgWidth+'px',
								height: canvasBgWidth+'px'
							});
						}	
						if (instance.turntableBtn) {
							instance.turntableBtn.attr({
								width: canvasBtnWidth+'px',
								height: canvasBtnHeight+'px'
							});
						}	

						// if (windowWidth>750) {
						// 	windowWidth = 750;
						// } else if (windowWidth<320) {
						// 	windowWidth = 320;
						// } 
						instance.drawCanvas(windowWidth);
					}, 200);
				});
				$this.data(name, instance);
			}

			// return turntable.init();
			typeof options === "string" && typeof instance[options] === "function" && instance[options].call(instance,paramArray);
		});
	};

	$.fn.turntable.info = {
		"version" : "v1.0",
		"name" : "turntable"
	};

})(jQuery);