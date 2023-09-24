/*
CMPS3141-HCI - AS3-23S1
Collaborators:
Date: Sept.22.23
*/

import { createApp } from "https://mavue.mavo.io/mavue.js";


globalThis.app = createApp({
	data: {
		expenses: [],
		date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().substr(0, 10), //current date
		description: null,
		amount: null,
		currency: "BZD",
		paidBy: null,
		paidFor: null,
		neoChecked: false,
        trinityChecked: false,
        jointChecked: false,
        neoPaid: "",
        trinityPaid: "",
        jointPaid: "",
		jsonData: [] //actual name should be for, but it will run into errors so we will use fort as a replacment
	},

	methods: {
		/**
		 * Currency convert function stub.
		 * In a real app, you would use an API to get the latest exchange rates,
		 * and we'd need to support all currency codes, not just MXN, BZD and GTQ.
		 * However, for the purposes of this assignment lets just assume they travel near by so this is fine.
		 * @param {"MXN" | "BZD" | "GTQ"} from - Currency code to convert from
		 * @param {"MXN" | "BZD" | "GTQ"} to - Currency code to convert to
		 * @param {number} amount - Amount to convert
		 * @returns {number} Converted amount
		 */
		currencyConvert(from, to, amount) {
			const rates = {
				BZD: 1,
				MXN: 8.73,
				GTQ: 3.91
			};

			return amount * rates[to] / rates[from];
		},

		isDateValid(dateStr) {
			return !isNaN(new Date(dateStr));
		},
		unselectOthers() {
            this.jointChecked = false;
        },
        unselectJoint(){
            
			this.neoChecked = false;
            this.trinityChecked = false;
        },

		addRowsToTable() {
			let jsonData;
			fetch('https://raw.githubusercontent.com/UB-CMPS3141/cmps3141-as3-css-app-23s1-Jcastel2014/main/expenses/data.json')
    		.then((response) => response.json())
    		.then((json) => {
				jsonData=json;

				var tableBody = document.createElement('tbody');
				var rows = [];

				jsonData.forEach((item, index) => {

					let date 		= "none";
					let description = item.title;
					let cost 		= 0;
					let currency	= "BZD";
					let paidBy 		= "empty";
					let paidFor 	= "empty";
					

					//this checking is used for the old json format
					if(item.trinity_paid) {
						paidBy 	= "Trinity";
						paidFor	= "Trinity";
						cost	= item.trinity_paid
					}
					if(item.neo_paid) {
						paidBy 	= "Neo";
						paidFor	= "Neo";
						cost	= item.neo_paid
					}
					if(item.trinity_paid && item.neo_paid) {
						paidBy 	= "Neo and Trinity";
						paidFor	= "Joint";
						cost	= item.neo_paid + item.trinity_paid;
					}
					if(item.trinity_paid_for_neo) {
						paidBy 	= "Trinity";
						paidFor	= "Neo";
						cost	= item.trinity_paid_for_neo
					}
					if(item.neo_paid_for_trinity) {
						paidBy 	= "Neo";
						paidFor	= "Trinity";
						cost 	=  item.neo_paid_for_trinity
					}
					if(item.date) {
						
						date		= item.date;
						description	= item.description;
						cost		= item.amount;
						currency	= item.currency;
						paidBy		= item.paidBy;
						paidFor		= item.paidFor;

					}
					

					if(item.title) {
					let isJoint = item.title;
					if(isJoint.toLowerCase().includes("joint")) {
						paidFor = "Joint";
					}
				}


				
					var row = `
				
					<tr>
						<td>${date}</td>
						<td>${description}</td>
						<td>${cost}</td>
						<td>${currency}</td>
						<td>${paidBy}</td>
						<td>${paidFor}</td>
						<td></td>
					</tr>
					`;

					rows.push(row);

					


				});

				for (let i = rows.length - 1; i >= 0; i--) {
					tableBody.innerHTML += rows[i];
				}
	
				console.log(tableBody);
	
				var table = document.getElementById("table");
				table.appendChild(tableBody);
			})
			.catch((error) => {
				console.error('Error fetching json:', error);
				
			})

			
			
		},

		async getGitHubFileSHA() {
			const githubAccessToken = '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';
	
			const githubApiUrl = 'https://api.github.com/repos/UB-CMPS3141/cmps3141-as3-css-app-23s1-Jcastel2014/contents/expenses/data.json';const headers = {
                "Authorization": `Bearer ${githubAccessToken}`,
                "Accept": "application/vnd.github.v3+json"
            };
            const response = await fetch(githubApiUrl, {
                method: "GET",
                headers: headers
            });

            if (response.status === 200) {
                const data = await response.json();
                return data.sha;
            } else {
                console.error("Failed to fetch file SHA from GitHub.");
                return null;
            }
		},

		async fetchUpdatedJsonData() {
			try {
				const response = await fetch('https://raw.githubusercontent.com/UB-CMPS3141/cmps3141-as3-css-app-23s1-Jcastel2014/main/expenses/data.json');
				if (response.ok) {
					const json = await response.json();
					this.jsonData = json;
				} else {
					console.error('Error fetching updated JSON data from GitHub:', response.status);
				}
			} catch (error) {
				console.error('Error fetching updated JSON data from GitHub:', error);
			}
		},

		async addExpense() {


			const githubAccessToken = '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';

			this.expenses.push({
				date: this.date,
				description: this.description,
				amount: this.amount,
				currency: this.currency,
				paidBy: this.paidBy,
				paidFor: this.paidFor,
			
			  });

			  console.log({
				
				description: this.description,
				amount: this.amount,
				currency: this.currency,
				paidBy: this.paidBy,
				paidFor: this.paidFor
			  });

			  console.log(this)
			  const githubData = JSON.stringify(this.expenses, null, 2);
			  const utf8Data = unescape(encodeURIComponent(githubData));
			  const sha = await this.getGitHubFileSHA();
			  const githubApiUrl = 'https://api.github.com/repos/UB-CMPS3141/cmps3141-as3-css-app-23s1-Jcastel2014/contents/expenses/data.json';			  const headers = {
				  "Authorization": `Bearer ${githubAccessToken}`,
				  "Accept": "application/vnd.github.v3+json"
			  };
			  const response = await fetch(githubApiUrl, {
				  method: "PUT",
				  headers: headers,
				  body: JSON.stringify({
					  message: "Update data.json",
					  content: btoa(utf8Data),
					  sha: sha 
				  })
			  });
  
			  if (response.status === 200) {
				  console.log("Data pushed to GitHub successfully.");
				  this.fetchUpdatedJsonData();
			  } else {
				  console.error("Failed to push data to GitHub.");
			  }
			
		},

		checkBoxChecker() {
			const neoCheckbox = document.getElementById('NeoPaid');
			const trinityCheckbox = document.getElementById('TrinityPaid');
			const jointCheckbox = document.getElementById('JointPaid');

			if(neoCheckbox.checked && trinityCheckbox.checked) {
				console.log("both");
			}
			if (neoCheckbox.checked) {
				console.log('Neo is selected');
			}
		
			if (trinityCheckbox.checked) {
				console.log('Trinity is selected');
			}
		
			if (jointCheckbox.checked) {
				console.log('Joint is selected');
			}

		}

	


	},





	created() {
		this.addRowsToTable();
	  },

	computed: {
		total_balance () {
			let total = 0;

			for (let expense of this.expenses) {
				let trinity_paid = expense.trinity_paid ?? 0;
				let neo_paid = expense.neo_paid ?? 0;
				let trinity_paid_for_neo = expense.trinity_paid_for_neo ?? 0;
				let neo_paid_for_trinity = expense.neo_paid_for_trinity ?? 0;

				total += (trinity_paid - neo_paid)/2 + trinity_paid_for_neo - neo_paid_for_trinity;
			}

			return total;
		}
	}
}, "#app");
