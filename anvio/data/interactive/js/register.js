/**
 *  functions for anvi'o interactive interface
 *
 *  Author: Tobias Paczian <tobiaspaczian@googlemail.com>
 *  Copyright 2015, The anvio Project
 *
 * This file is part of anvi'o (<https://github.com/meren/anvio>).
 *
 * Anvi'o is a free software. You can redistribute this program
 * and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU General Public License
 * along with anvi'o. If not, see <http://opensource.org/licenses/GPL-3.0>.
 *
 * @license GPL-3.0+ <http://opensource.org/licenses/GPL-3.0>
 */

function initContent () {
    //	  grecaptcha.render('recap', { 'sitekey' : '6Lf1FL4SAAAAAO3ToArzXm_cu6qvzIvZF4zviX2z' });
};

function checkMatch() {
    if (document.getElementById('inputPassword').value !== document.getElementById('inputRepeatPassword').value) {
	alert('passwords do not match');
	document.getElementById('inputPassword').value = '';
	document.getElementById('inputRepeatPassword').value = '';
	$('#inputPassword').focus();
    }
}

function checkAvailability(which) {
    var params = {
	//	"response": grecaptcha.getResponse()
    };
    if (which == 'email') {
	params['email'] = document.getElementById('inputEmail').value;
    } else {
	params['login'] = document.getElementById('inputLogin').value;
    }
    jQuery.post("/checkAvailability", params, function (result) {
	if (result.hasOwnProperty('email')) {
	    if (result.email == 'ok') {
		document.getElementById('inputEmail').parentNode.parentNode.className = 'form-group has-success';
	    } else {
		document.getElementById('inputEmail').parentNode.parentNode.className = 'form-group has-error';
		alert(result.email);
	    }
	} else if (result.hasOwnProperty('login')) {
	    if (result.login == 'ok') {
		document.getElementById('inputLogin').parentNode.parentNode.className = 'form-group has-success';
	    } else {
		document.getElementById('inputLogin').parentNode.parentNode.className = 'form-group has-error';
		alert(result.login);
	    }
	}
    }).fail(function(result){
	
    });
}

function performRegistration() {
    // first check if all required fields are filled out
    var required = [ 'Email', 'Firstname', 'Lastname', 'Login', 'Password' ];
    for (var i=0; i<required.length; i++) {
	if (! document.getElementById('input'+required[i]).value) {
	    $('#input'+required[i]).focus();
	    alert(required[i]+' is a required field');
	    return;
	}
    }

    // check if email has the required format
    if (! document.getElementById('inputEmail').value.match(/\@/)) {
	alert('invalid email address');
	return;
    }
    
    // perform the submission
    document.getElementById('submit').setAttribute('disabled', 'disabled');
    jQuery.post("/requestAccount", {
	"email": document.getElementById('inputEmail').value,
	"firstname": document.getElementById('inputFirstname').value,
	"lastname": document.getElementById('inputLastname').value,
	"login": document.getElementById('inputLogin').value,
	"affiliation": document.getElementById('inputAffiliation').value,
	"password": document.getElementById('inputPassword').value,
//	"response": grecaptcha.getResponse()
      }, function (result) {
	  document.getElementById('submit').removeAttribute('disabled');
	  if (result.hasOwnProperty('ERROR')) {
	      alert("Your registration failed: "+result.ERROR);
	  } else {
	      document.getElementById('main').innerHTML = "<h3>Registration Successful</h3><div class='alert alert-success col-sm-6'><p>Your registration has been submitted successfully. You will received a confirmation at the registered email address shortly.</p><p>Click on the link in that email to confirm your account.</p></div>";
	  }
      }).fail(function(result){
	  if (result.hasOwnProperty('ERROR')) {
	      alert("Your registration failed: "+result.ERROR);
	  } else {
	      alert('An error occured during your registration');
	  }
      });
}

