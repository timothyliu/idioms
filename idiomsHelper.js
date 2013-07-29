/*
Description: 成語
*/
(function(window, document, undefined) {	
	var idiomsHelper = function (){
	}
	var fileUrl = "idioms.utf8";
	idiomsHelper.isInit = false;
	this.step = 0;
	idiomsHelper.keyIndex = [];
	idiomsHelper.idioms = [];
	idiomsHelper.onReady = function(callback){
		if(idiomsHelper.isInit) return callback();
		$.ajaxSetup({
		beforeSend: function (xhr) {
			xhr.overrideMimeType("text/html; charset=utf8");
			}
		});
		var cinLines;
		$.get(fileUrl, function(data) {
			idiomsHelper.isInit = true;
			cinLines = data.split('\n');
			parseFile(cinLines);
			return callback();
		});
	}
	var parseFile = function(arr){
		var code;
		idiomsHelper.idioms = arr;
		for(var i=0; i<arr.length; i++){
			var line = arr[i];
			code = line[0];
			if(idiomsHelper.keyIndex[code]==undefined){
				idiomsHelper.keyIndex[code] = i;
			}else{
				idiomsHelper.keyIndex[code] += '|' + i;
			}
		}
	}
	
	idiomsHelper.startWith = function(word, isTest){
		var optArray = [];
		var ipt = $.trim(word); 
		var indexs = idiomsHelper.keyIndex[ipt];
		if(indexs){
			if(isTest) { return ['true']; }
			var indexArray = !(typeof indexs == 'number') && indexs.indexOf('|')>-1 ? indexs.split('|') : [indexs];
			for(var k=0; k<indexArray.length; k++){
				index = indexArray[k];
				opt = idiomsHelper.idioms[index];
				optArray.push(opt);
			}
		}
		return optArray;
	}
	//DomReady.ready(idiomsHelper);
	window.idiomsHelper = idiomsHelper;
	
})(this, document);
/*
var p = idiomsHelper;
p.onReady(function(){
	console.log(p.startWith('一'));
});
*/ 