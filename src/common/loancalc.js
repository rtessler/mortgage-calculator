import app from './app'
import config from './config'
//import { config } from 'process';

export function executeFunctionByName(functionName, context /*, args */) {

	    let args = Array.prototype.slice.call(arguments, 2);
	    let namespaces = functionName.split(".");
	    let func = namespaces.pop();

	    for (let i = 0; i < namespaces.length; i++) {
	        context = context[namespaces[i]];
	    }
	    return context[func].apply(context, args);
	}
	
export function addCommas(nStr) {	
		nStr += '';
		let x = nStr.split('.');
		let x1 = x[0];
		let x2 = x.length > 1 ? '.' + x[1] : '';
		let rgx = /(\d+)(\d{3})/;

		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}

		return x1 + x2;
	}	
	
export function removeCommas(str) {

		if (!str)
			return "";
			
		return str.replace(/\,/g, "");
	}

	// see: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
	
	function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
	
export function format(x, fmt) {

	    switch (fmt) {
	        case "C":
						return config.CURRENCY_SYMBOL + numberWithCommas((Math.round(x * 100) / 100))
	            //return app.currency_symbol + addCommas(x.toFixed(2));
			}
			
			return ''
	}

export function getVal(e) {

	    let val = removeCommas(e.val())
	    val = parseFloat(val);

	    if (isNaN(val))
	        return 0;

	    return val;
	}

export function getInt(e) {

	    let val = parseInt(e.val());

	    if (isNaN(val))
	        return 0;

	    return val;
	}

export function resultToString(arr)
	{
		let str = "";
		
		for (var i = 0; i < arr.length; i++)
		{
			str += arr[i].key;
			str += ": \t\t";
			str += arr[i].value;
			str += "\r\n";		
		}
		
		return str;
	}


				
//function changeImages(baseurl)
//{
//	$(".calc .info img").attr("src", baseurl + "images/info.png");
//	$(".calc .print img").attr("src", baseurl + "images/print.png");
//	$(".calc .save img").attr("src", baseurl + "images/save.png");
//	$(".calc .email img").attr("src", baseurl + "images/email.png");	
//}	

	