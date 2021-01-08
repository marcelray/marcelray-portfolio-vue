// Lightweight helper functions to avoid jQuery
class mrlib {
	static query( selector ) {
		return document.querySelectorAll(selector);
	}
	static show(selector) {
		mrlib.query(selector).forEach((item)=>{
			item.style.display = 'block';
		});
	}
	static hide(selector) {
		mrlib.query(selector).forEach((item)=>{
			item.style.display = 'none';
		});
	}
	static addClass(selector,class_) {
		mrlib.query(selector).forEach((item)=>{
			item.classList.add(class_);
		});
	}
	static removeClass(selector,class_) {
		mrlib.query(selector).forEach((item)=>{
			item.classList.remove(class_);
		});
	}
	static css(selector,property,value) {
		mrlib.query(selector).forEach((item)=>{
			item.style[property] = value;
		});
	}
}
