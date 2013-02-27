"use strict"

// global namespace
var wcir = {};

// calculation variables and default values
wcir.capital 					= 10000;
wcir.salary 					= 40000;
wcir.salaryIncrease 	= 0.05;
wcir.expenses 				= 20000;
wcir.expensesIncrease = 0.04;
wcir.avgDividend 			= 0.04

// helper function for getting field values by name
wcir.getFieldValue = function(fieldName) {
	var results = $('#wc-form :text[name="' + fieldName + '"]').fieldValue();
	switch(results.length) {
		case 0:
			return null;
			break;
		case 1:
			return results[0];
			break;
		default:
			return results;
			break;
	}
};

// calculate when the dividend income reaches the annual expenses



$(document).ready(function() {

	// ajaxify the form
	$('#wc-form').ajaxForm(function() {

		wcir.salary = wcir.getFieldValue('salary');
		wcir.capital = wcir.getFieldValue('capital');

	});
})