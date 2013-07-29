/*
Description: 中文轉拼音

Python version Author: Chui-Wen Chiu <sisimi.pchome@gmail.com>
License: PYTHON SOFTWARE FOUNDATION LICENSE
Reference:
[1] phone.cin.utf8(http://cle.linux.org.tw/trac/attachment/wiki/GcinTablesXcin01/phone.cin.utf8?format=raw)
*/
(function(window, document, undefined) {	
	var zuinHelper = function (){
	}
	var cinUrl = "phone.cin.utf8";
	zuinHelper.isInit = false;
	this.step = 0;
	zuinHelper.keyname = [];
	zuinHelper.chardef = [];
	zuinHelper.phonedef = [];
	zuinHelper.onReady = function(callback){
		if(zuinHelper.isInit) return callback();
		$.ajaxSetup({
		beforeSend: function (xhr) {
			xhr.overrideMimeType("text/html; charset=utf8");
			}
		});
		var cinLines;
		$.get(cinUrl, function(data) {
			zuinHelper.isInit = true;
			cinLines = data.split('\n');
			parseCin(cinLines);
			return callback();
		});
	}
	var parseCin = function(arr){
		var code, word, phone, step;
		for(var i=0; i<arr.length; i++){
			var line = arr[i];
			switch($.trim(line)){
				case '%keyname  begin':
					step = 1;
					continue;
				case '%keyname  end':
					continue;

				case '%chardef  begin':
					step = 2;
					continue;

				case '%chardef  end':
					continue;
			}
			if(step == 0)
				continue;

			if(step == 1){
				//注音音符
				var tmp = line.split('  ');
				code = $.trim(tmp[0]);
				phone = $.trim(tmp[1]);
				zuinHelper.keyname[code] = phone;
			}
			else if(step == 2){
				//單字拼音
				var tmp = line.split('\t');
				code = $.trim(tmp[0]);
				word = $.trim(tmp[1]);
				if(zuinHelper.chardef[word]==undefined){
					zuinHelper.chardef[word] = code;
				}else{
					zuinHelper.chardef[word] += '|' + code;
				}
				if(zuinHelper.phonedef[code]==undefined){
					zuinHelper.phonedef[code] = word;
				}else{
					zuinHelper.phonedef[code] += '|' + word;
				}
			}
		}
	}
	
	zuinHelper.parse = function(word){
		var optArray = [];
		var ipt = $.trim(word); 
		var code;
		for(var j=0; j<word.length; j++){
			var codes = zuinHelper.chardef[ipt[j]];
			var opt = '';
			if(codes){
				var codeArray = codes.indexOf('|')>-1 ? codes.split('|') : [codes];
				for(var k=0; k<codeArray.length; k++){
					code = codeArray[k];
					if(opt && opt !== '')
						opt += '|';
					for(var i=0; i<code.length; i++){
						opt += zuinHelper.keyname[code[i]];
					}
				}
				optArray.push(opt + ' ');
			}else{
				opt = ipt[j];
				optArray.push(opt);
			}
		}
		return optArray.join('');
	}
	zuinHelper.findSame = function(word){
		if (word.length>1) {
			throw 'input word length should 1!';
		}
		var optArray = [];
		var ipt = $.trim(word); 
		var zuin = zuinHelper.chardef[ipt];
		var zuins = [];
		try{
			zuins = zuin.indexOf('|')>-1 ? zuin.split('|') : [zuin];
		}
		catch(ex){}
		for(var i=0; i<zuins.length; i++){
			var codes = zuinHelper.phonedef[zuins[i]];
			var opt = '';
			if(codes){
				var codeArray = codes.indexOf('|')>-1 ? codes.split('|') : [codes];
				for(var k=0; k<codeArray.length; k++){
					optArray.push(codeArray[k]);
				}
			}
		}
		return optArray;
	}
	//DomReady.ready(zuinHelper);
	// Expose html5media to the global object.
	window.zuinHelper = zuinHelper;
	
})(this, document);
/*
var p = zuinHelper;
p.onReady(function(){
	console.log(p.parse('邱垂汶單于'));
	p.parse($('body').text().trim());
});
*/