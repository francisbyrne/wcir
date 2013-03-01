"use strict"

// global namespace
var wcir = {};

// helper function for getting field values by name
wcir.getFieldValue = function ( fieldName ) {
	var results = $( '#wc-form :text[name="' + fieldName + '"]' ).fieldValue();
	switch( results.length ) {
		case 0:
			return null;
			break;
		case 1:
			return parseInt( results[0] );
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

	var netIncome = 	0,
		years 			= 	0,
		capital 		= 	calc.capital,
		salary 			= 	calc.salary,
		expenses 		= 	calc.expenses;

	while ( netIncome < expenses ) {
		years++;
		if ( years > 100 )
			return null;

		capital += salary - expenses;
		salary  += salary * this.salaryIncrease;
		expenses += expenses * this.expensesIncrease;
		netIncome = capital * this.avgDividendYield;

		$( '#detail-table' ).append(
			'<tr><td>' 
			+ years + '</td><td>' 
			+ Math.round( capital ) + '</td><td>' 
			+ Math.round( salary ) + '</td><td>' 
			+ Math.round( expenses ) + '</td><td>' 
			+ Math.round( netIncome ) + '</td></tr>'
		)
	}

	return {
		netIncome: Math.round( netIncome ),
		years:     years,
		capital:   capital,
		salary:    salary,
		expenses:  expenses
	};
};



$(document).ready( function() {

	// hide the results until we have some
	$( '#result' ).hide();

	// ajaxify the form
	$( '#wc-form' ).ajaxForm(function() {

		// populate details table header
		$( '#detail-table' ).html(
			'<tr><th>Year</th><th>Capital</th><th>Salary</th><th>Expense</th><th>Dividend Income</th></tr>'
		);

		// get the calculation inputs
		calc.capital 	= wcir.getFieldValue( 'capital' );
		calc.salary 	= wcir.getFieldValue( 'salary' );
		calc.expenses = wcir.getFieldValue( 'expenses' );

		// calculate the number of years to retirement
		var result = calc.getRetirementYears();
		if ( result.years ) 
			$('#result-years').html( result.years );
		else
			$( '#result-years' ).html( '∞' );

		if (result.netIncome) 
			$( '#result-income' ).html( result.netIncome );
		else
			$( '#result-income' ).html( '0' );

		// now display results
		$( '#result' ).show();

	});
})