function MonthPicker(options) {
	if (!(this instanceof MonthPicker)) {
		return new MonthPicker();
	}
	this.monthList = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
	this.el = options.el;
	this.targets = document.querySelectorAll(options.el);
	this.bgColor = options.bgColor || '#ff7359';
	this.textColor = options.textColor || '#fff';
	this.defaultYear = options.year || new Date().getFullYear();
	
	this.init();
}
MonthPicker.hidePicker = function() {
	var picker = document.querySelector('.month-picker-wrap[data-state="show"]');
	picker.setAttribute('data-state', 'hide');
	picker.style.display = 'none';
}
MonthPicker.prototype.init = function() {
	var thiz = this;
	var targets = this.targets;

	if (!targets.length) return;
	targets.forEach(function(target) {
		thiz.targetWrapping(target);
	});

	document.addEventListener('click', function(e) {
		console.log(e.target.className.split(' '));
		var classNameList = e.target.className.split(' ');

		if (classNameList.indexOf( thiz.el.replace(/[.||#]/gi, '') ) !== -1 || document.querySelector('.month-picker-wrap[data-state="show"]').contains(e.target)) {
			return;
		}
		
		MonthPicker.hidePicker();
	});
}
MonthPicker.prototype.setValue = function (wrapper, value) {
	wrapper.querySelector(this.el).value = value;
}
MonthPicker.prototype.targetWrapping = function(target) {
	var wrapper = document.createElement('div');
	wrapper.style.position = 'relative';
	wrapper.setAttribute('data-year', this.defaultYear);

	target.parentNode.insertBefore(wrapper, target);
	wrapper.appendChild(target);
	wrapper.appendChild(this.createPicker(wrapper));

	// set events 
	target.addEventListener('focus', function() {
		var picker = wrapper.querySelector('.month-picker-wrap');
		picker.style.display = 'block';
		picker.setAttribute('data-state', 'show');
	});
}
MonthPicker.prototype.createPicker = function(wrapper) {
	var picker = document.createElement('div');
	picker.className = 'month-picker-wrap';
	picker.setAttribute('style', 'display: none; position: absolute; left: 0; top: 100%; margin-top: -1px; padding: 16px 12px 12px; width: 194px; border: 1px solid #a7a6a6; box-sizing: border-box; font-size: 16px; text-align: center; background-color: #fff; z-index: 999;');
	picker.append(
		this.createYearArea(wrapper),
		this.createMonthArea(wrapper)
	);

	return picker;
}
MonthPicker.prototype.createYearArea = function(wrapper) {
	var yearArea = document.createElement('div');

	var btnPrev = document.createElement('button');
	var prevImg = document.createElement('img');
	var btnNext = document.createElement('button');
	var nextImg = document.createElement('img');
	var yearText = document.createElement('span');

	btnPrev.setAttribute('style', 'appearance: none; outline: none; border: none; background: transparent; vertical-align: middle; cursor: pointer;');
	btnNext.setAttribute('style', 'appearance: none; outline: none; border: none; background: transparent; vertical-align: middle; cursor: pointer;');

	prevImg.src = './ic-prev.svg';
	prevImg.width = '24';
	prevImg.alt = '이전';
	nextImg.src = './ic-next.svg';
	nextImg.width = '24';
	nextImg.alt = '다음';

	btnPrev.appendChild(prevImg);
	btnNext.appendChild(nextImg);

	yearText.style.verticalAlign = 'middle';
	yearText.textContent = this.defaultYear;
	yearArea.append(btnPrev, yearText, btnNext);

	// set events
	btnPrev.addEventListener('click', function() {
		var y = wrapper.getAttribute('data-year');

		wrapper.setAttribute('data-year', +y - 1);
		yearText.textContent = +y - 1;
	});
	btnNext.addEventListener('click', function() {
		var y = wrapper.getAttribute('data-year');

		wrapper.setAttribute('data-year', +y + 1);
		yearText.textContent = +y + 1;
	});

	return yearArea;
}
MonthPicker.prototype.createMonthArea = function(wrapper) {
	var thiz = this;
	var monthArea = document.createElement('ul');
	monthArea.setAttribute('style', 'overflow: hidden; list-style: none; margin-top: 8px; font-size: 14px;');

	this.monthList.forEach(function (v, i) {
		var li = document.createElement('li');
		li.setAttribute('style', 'float: left; padding: 4px 0; width: 25%; cursor: pointer;');
		li.setAttribute('data-month', i + 1);
		li.textContent = v;

		// set li event
		li.onmouseover = function() {
			this.style.backgroundColor = thiz.bgColor;
			this.style.color = thiz.textColor;
		}
		li.onmouseout = function() {
			this.style.backgroundColor = 'transparent';
			this.style.color = 'inherit'
		}
		monthArea.appendChild(li);
	});

	// set event
	monthArea.addEventListener('click', function(e) {
		if (e.target.tagName.toLowerCase() === 'li') {
			var li = e.target;
			var y = wrapper.getAttribute('data-year');
			var m = li.getAttribute('data-month');
			
			var value = y + '-' + (m < 10 ? '0' + m : m);
			thiz.setValue(wrapper, value);
			MonthPicker.hidePicker();
		}
	});
	return monthArea;
}