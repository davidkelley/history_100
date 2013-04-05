define([], function()
{
	var render = function(template, data, step) {
		for (var key in data) {
			template = template.replace(new RegExp('{'+key+'}','g'), data[key]);
		}
		
		if (typeof(step) == "function") {
			return step(template) || template;
		}
		
		return template;
	};
	
	return function(template, objects, step) {
		if(Object.prototype.toString.call( objects ) === '[object Array]') {
			var result = [];
			for (var i in objects) {
				result.push(render(template, objects[i], step));
			}
			return result;
		} else {
			return render(template, objects, step);
		}
	}
});
