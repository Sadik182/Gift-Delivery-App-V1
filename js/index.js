//==================================index.js==================================//

var debug = false;
var authenticated = false;


$(document).ready(function () {

	//localStorage.removeItem("allUsers");
	//localStorage.removeItem("allOrders");
	
	if (!localStorage.allUsers) {
	  
		if (debug) alert("Users not found - creating a default user!");
		
		var userData = {email:"admin@domain.com",password:"admin",firstName:"CQU",lastName:"User",state:"QLD",phoneNumber:"0422919919", address:"700 Yamba Road", postcode:"4701"};
		
		var allUsers = [];
		allUsers.push(userData); 
		
		if (debug) alert(JSON.stringify(allUsers));  
		localStorage.setItem("allUsers", JSON.stringify(allUsers));

	} else {
        
		if (debug) alert("Names Array found-loading.."); 		
		
		var allUsers = JSON.parse(localStorage.allUsers);    
		if (debug) alert(JSON.stringify(allUsers));
	} 



	/**
	----------------------Event handler to process login request----------------------
	**/
	
	$('#loginButton').click(function () {

		localStorage.removeItem("inputData");

		$("#loginForm").submit();

		if (localStorage.inputData != null) {

			var inputData = JSON.parse(localStorage.getItem("inputData"));
			var allUsers = JSON.parse(localStorage.getItem("allUsers"));	

			allUsers.forEach(function(userData){		
			
				if (inputData.email == userData.email && inputData.password == userData.password) {
					authenticated = true;
					alert("Login success");
					localStorage.setItem("userInfo", JSON.stringify(userData));
					$.mobile.changePage("#homePage");
				} 
			}); 	
			
			if (authenticated == false){
				alert("Login failed");
			}

			$("#loginForm").trigger('reset');
		}	
	})


	/**
	 * -------------Start Event Handler to Process Sign up ----------------------
	 */
	$('#registerForm').submit(function (e) {

		e.preventDefault(); // to prevent the default form submisson

		if($("#registerForm").valid()) {
			var formData = $(this).serializeArray();
			var newUser = {};
			formData.forEach(function (data) {
				newUser[data.name] = data.value;

			});

			var allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

			// to check email is exist or not

			var emailExists = allUsers.some(function (user) {
				return user.email === newUser.email

			});

			if(emailExists) {
				alert("This email already registered! Please use different Email");
			} else {
				allUsers.push(newUser);
				localStorage.setItem("allUsers", JSON.stringify(allUsers));
				alert("New User Registration Successful!");
				$.mobile.changePage("#homePage")
			}
		}
	});


	/**
	 * Validation Rules for Sign up Page
	 */

	$("#registerForm").validate({
		focusInvalid: false,
		onkeyup: false,

		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [6, 12]
			},
			firstName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			lastName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
				
			},
			address: {
				required: false,
				rangelength: [1, 25]
			},
			postcode: {
				required: true,
				posttxt: true
			},
		},
		/* Validation message */
		messages: {
			email: {
				required: "Please enter your correct email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Password must be between {6} and {12} characters.")
			},
			firstName: {
				required: "Please enter your first name",
				rangelength: $.validator.format("First name must be between {1} and {15} characters.")
			},
			lastName: {
				required: "Please enter your last name",
				rangelength: $.validator.format("Last name must be between {1} and {15} characters.")
			},
			phoneNumber: {
				required: "Please enter your phone number",
				
			},
			address: {
				rangelength: $.validator.format("Address must be between {1} and {25} characters.")
			},
			postcode: {
				required: "Please enter your postcode"
			},
		},
	});


	// Validation methods for custom rules
	$.validator.addMethod("validateName", function(value, element) {
		return this.optional(element) || /^[a-zA-Z]+$/.test(value);
	}, "Name must contain only letters");

	$.validator.addMethod("mobiletxt", function(value, element) {
		return this.optional(element) || /^[0-9]{10}$/.test(value);
	}, "Please enter a valid phone number");

	$.validator.addMethod("posttxt", function(value, element) {
		return this.optional(element) || /^[0-9]{4}$/.test(value);
	}, "Please enter a valid postcode");


	/**
	 * End of Sign up process
	 */

	

	 $("#loginForm").validate({// JQuery validation plugin
		focusInvalid: false,  
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var inputData = {};
			formData.forEach(function(data){
				inputData[data.name] = data.value;
			})

			localStorage.setItem("inputData", JSON.stringify(inputData));		
		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			}
		},
		/* Validation message */
		messages: {
			email: {
				required: "Please enter your email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			}
		},
	});
	/**
	--------------------------end--------------------------
	**/	


	/**
	------------Event handler to respond to selection of gift category-------------------
	**/
	$('#itemList li').click(function () {
		
		var itemName = $(this).find('#itemName').html();
		var itemPrice = $(this).find('#itemPrice').html();
		var itemImage = $(this).find('#itemImage').attr('src');
		
		localStorage.setItem("itemName", itemName);
		localStorage.setItem("itemPrice", itemPrice);
		localStorage.setItem("itemImage", itemImage);

	}) 

	/**
	--------------------------end--------------------------
	**/	


	/**
	--------------------Event handler to process order confirmation----------------------
	**/

	$('#confirmOrderButton').on('click', function () {
		
		localStorage.removeItem("inputData");

		$("#orderForm").submit();

		if (localStorage.inputData != null) {

			var orderInfo = JSON.parse(localStorage.getItem("inputData"));

			orderInfo.item = localStorage.getItem("itemName")
			orderInfo.price = localStorage.getItem("itemPrice")
			orderInfo.img = localStorage.getItem("itemImage")

			var userInfo = JSON.parse(localStorage.getItem("userInfo"));

			orderInfo.customerEmail = userInfo.email;

			orderInfo.orderNo = Math.trunc(Math.random()*1000000);
			
			localStorage.setItem("orderInfo", JSON.stringify(orderInfo));

			if (debug)	alert(JSON.stringify(orderInfo));

			var allOrders = [];

			if (localStorage.allOrders != null) 
				allOrders = JSON.parse(localStorage.allOrders); 

			allOrders.push(orderInfo);

			localStorage.setItem("allOrders", JSON.stringify(allOrders));

			if (debug) alert(JSON.stringify(allOrders));			

			$("#orderForm").trigger('reset');
			
			$.mobile.changePage("#orderConfirmationPage");
		}	
	})


	$("#orderForm").validate({  // JQuery validation plugin
		focusInvalid: false, 
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var inputData = {};

			formData.forEach(function(data){
				inputData[data.name] = data.value;
			});
			
			localStorage.setItem("inputData", JSON.stringify(inputData));				
		},
		
		/* validation rules */
		
		rules: {
			firstName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			lastName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
			},
			address: {
				required: true,
				rangelength: [1, 25]
			},
			postcode: {
				required: true,
				posttxt: true
			},
		},
		/* Validation Message */

		messages: {
			firstName: {
				required: "Please enter your firstname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			lastName: {
				required: "Please enter your lastname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			phoneNumber: {
				required: "Phone number required",
			},
			address: {
				required: "Delivery address required",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			postcode: {
				required: "Postcode required",

			},
		}
	});


	/**
	--------------------Event handler to perform initialisation before the Login page is displayed--------------------
	**/


	$(document).on("pagebeforeshow", "#loginPage", function() {
	
		localStorage.removeItem("userInfo");
	
		authenticated = false;
	});  
	
	/**
	--------------------------end--------------------------
	**/	

	/**
	--------------------Event handler to populate the Fill Order page before it is displayed---------------------
	**/

	$(document).on("pagebeforeshow", "#fillOrderPage", function() {
		
		$("#itemSelected").html(localStorage.getItem("itemName"));
		$("#priceSelected").html(localStorage.getItem("itemPrice"));
		$("#imageSelected").attr('src', localStorage.getItem("itemImage"));

	});  

	/**
	--------------------------end--------------------------
	**/	


	/**
	--------------------Event handler to populate the Order Confirmation page before it is displayed---------------------
	**/

	$(document).on("pagebeforeshow", "#orderConfirmationPage", function() {
		
		$('#orderInfo').html("");

		if (localStorage.orderInfo != null) {

			var orderInfo = JSON.parse(localStorage.getItem("orderInfo"));

			$('#orderInfo').append('<br><table><tbody>');
			$('#orderInfo').append('<tr><td>Order no: </td><td><span class=\"fcolor\">' + orderInfo.orderNo + '</span></td></tr>');	
			$('#orderInfo').append('<tr><td>Customer: </td><td><span class=\"fcolor\">' + orderInfo.customerEmail + '</span></td></tr>');	
			$('#orderInfo').append('<tr><td>Item: </td><td><span class=\"fcolor\">' + orderInfo.item + '</span></td></tr>');	
			$('#orderInfo').append('<tr><td>Price: </td><td><span class=\"fcolor\">' + orderInfo.price + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Recipient: </td><td><span class=\"fcolor\">' + orderInfo.firstName + ' ' + orderInfo.lastName + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Phone number: </td><td><span class=\"fcolor\">' + orderInfo.phoneNumber + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Address: </td><td><span class=\"fcolor\">' + orderInfo.address + ' ' + orderInfo.postcode + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Dispatch date: </td><td><span class=\"fcolor\">' + orderInfo.date + '</span></td></tr>');
			$('#orderInfo').append('</tbody></table><br>');
		}
		else {
			$('#orderInfo').append('<h3>There is no order to display<h3>');
		}
	});  


	/**
	--------------------------end--------------------------
	**/	

	

});


