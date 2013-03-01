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

wcir.putField = function ( selector, content, error ) {
	if ( content )
		$( selector ).html( content );
	else
		$( selector ).html( error );
};

// calculator object
var calc = {};

// calculation variables and default values
calc.capital 					= 10000;	// current capital
calc.salary 					= 30000;	// annual salary, after tax
calc.salaryIncrease 	= 0.05;		// annual salary increase
calc.expenses 				= 20000;	// total annual expenses
calc.expensesIncrease = 0.04;		// annual expenses increase
calc.avgDividendYield	= 0.04;		// average yearly dividend yield
calc.capitalGain			= 0.05;		// annual capital appreciation, excludes dividend assuming no DRIP

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

		$( '#breakdown-table' ).append(
			'<tr class="breakdown-row"><td>' 
			+ years + '</td><td class="currency">' 
			+ Math.round( capital ) + '</td><td class="currency">' 
			+ Math.round( salary ) + '</td><td class="negative-currency">' 
			+ Math.round( expenses ) + '</td><td class="currency">' 
			+ Math.round( netIncome ) + '</td></tr>'
		);
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

	// ajaxify the form
	$( '#wc-form' ).ajaxForm(function() {

		// clear table data
		$( '.breakdown-row' ).remove();

		// get the calculation inputs
		calc.capital 	= wcir.getFieldValue( 'capital' ) * 1000;
		calc.salary 	= wcir.getFieldValue( 'salary' ) * 1000;
		calc.expenses = wcir.getFieldValue( 'expenses' ) * 1000;

		// calculate the number of years to retirement
		var result = calc.getRetirementYears();

		// populate DOM with results and assumptions
		wcir.putField( '#result-years', result.years, '∞' );
		wcir.putField( '#result-income', result.netIncome, '0' );
		wcir.putField( '#salary-increase', calc.salaryIncrease * 100, '?' );
		wcir.putField( '#expenses-increase', calc.expensesIncrease * 100, '?' );
		wcir.putField( '#dividend-yield', calc.avgDividendYield * 100, '?' );
		// wcir.putField( '#capital-gain', calc.capitalGain * 100, '?' );

		// now display results
		$( '#result' ).show();

		// show details button
		$( '#show-details' ).click( function() {
			$( '#details' ).show();
		});

	});
})