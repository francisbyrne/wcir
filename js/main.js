"use strict"

// global namespace
var wcir = {};

// helper function for getting field values by name
wcir.getFieldValue = function (fieldName) {
	var results = $('#wc-form :text[name="' + fieldName + '"]').fieldValue();
	switch(results.length) {
		case 0:
			return null;
			break;
		case 1:
			return parseInt(results[0]);
			break;
		default:
			return results;
			break;
	}
};

// calculator object
var calc = {};

// calculation variables and default values
calc.capital 					= 10000;
calc.salary 					= 30000;
calc.salaryIncrease 	= 0.05;
calc.expenses 				= 20000;
calc.expensesIncrease = 0.04;
calc.avgDividendYield	= 0.04;

// returns the number of years it takes for dividend income = annual expenses
calc.getRetirementYears = function () {

	var netIncome = 0,
		years 			= 0,
		capital			= calc.capital,
		salary 			= calc.salary,
		expenses 		= calc.expenses;

	while (netIncome < expenses) {
		years++;
		if ( years > 100 )
			return null;

		capital += salary - expenses;
		salary  *= Math.pow(1 + this.salaryIncrease, years);
		expenses *= Math.pow(1 + this.expensesIncrease, years);
		netIncome = capital * this.avgDividendYield;
	}

	return years;
};



$(document).ready(function() {

	// hide the results until we have some
	$('#result').hide();

	// ajaxify the form
	$('#wc-form').ajaxForm(function() {

		// get the calculation inputs
		calc.salary = wcir.getFieldValue('salary');
		calc.capital = wcir.getFieldValue('capital');

		// calculate the number of years to retirement
		var result = calc.getRetirementYears();
		if (result) 
			$('#resultValue').html(result);

		// now display results
		$('#result').show();

	});
})