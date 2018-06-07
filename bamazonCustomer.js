// Required NPM
var mysql = require("mysql");
var inquirer = require("inquirer");

// Connect to MySQL
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "NewPassword",
  database: "bamazon"
})

// Connect to DB
connection.connect(function(err) {
  if (err) throw err;
	console.log("You are connected to Bamazon!");
	createTable();
})

// Organizes DB into a table
var createTable = function(){
	connection.query("SELECT * FROM products", function(err, res){
		for(var i=0; i<res.length; i++){
			console.log(res[i].item_id+" || "+res[i].product_name+" || "+res[i].department_name+" || "+res[i].price+" || "+res[i].stock_quantity+"\n");
		}
		inputPrompt(res);
	})
}

// Prompt for customer to input item type
// Items from DB
var inputPrompt = function(res){
	inquirer.prompt([{
		type:"input",
		name:"choice",
		message:"What will you be buying today?"
	}]).then(function(answer){
		var correct = false;

		// Loop that runs through list of items
		for(var i=0; i<res.length; i++){
			if(res[i].product_name==answer.choice){
				correct=true;
				var product=answer.choice;
				var id=i;

				// Prompt user for quantity
				inquirer.prompt({
					type:"input",
					name:"num",
					message:"How many do you want?",
					validate: function(value){
						if(isNaN(value)==false){
							return true;
						} else {
							return false;
						}
					}

				// Selected item is deducted from total quanity
				// Confirms purchase
				// Notifies customer if purchase is invalid
				}).then(function(answer){
					if((res[id].stock_quantity-answer.num)>0){
						connection.query("UPDATE products SET stock_quantity='"+(res[id].stock_quantity-answer.num)+"' WHERE product_name='"+product+"'", function(err,res2){
							console.log("CHA-CHING---You've bought the product! No refunds!");
							createTable();
						})
					} else {
						console.log("Your selection's invalid!");
						inputPrompt(res);
					}
				})
			}
		}
	})
}