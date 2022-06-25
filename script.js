"use strict"

var game = (function() {
	function setSessionStorage(){
		var quantity = localStorage.getItem('numbers');
		var arr=fillArrayWithNumbers(quantity);
		sessionStorage.setItem('counter', quantity);

		sessionStorage.setItem('numbersArray', arr);
		sessionStorage.setItem('choosenNumbers', []);
		sessionStorage.setItem('bingo', false);
	}


	function endOfGame(result){
		var container = document.getElementById("container");
		var res = document.getElementById("result");
		container.classList.toggle("main");
		if(result==="loose"){
			container.classList.toggle("loose");
			res.innerHTML="Unfortunately, you lost.";
		}else{
			container.classList.toggle("won");
			res.innerHTML="Congratulations Player x you have won!";
		}
	}

	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max-min)+min);
	}



	function generateCards(dimension, quantity, numbers){
		for(var i = 0;i<quantity;i++){
			var newCard = document.createElement('div');
			newCard.className = "card";
			newCard.addEventListener("click", function(ev){    
	    		chooseNumber(ev.target);
	  		}); 

			document.getElementsByClassName("cards-field")[0].appendChild(newCard);
			generateCard(dimension, numbers, i);
		}
		addProperties(quantity, dimension);
	}

	function addProperties(quantity, dimension){
		for(var i=0;i<quantity; i++){
			for(var j=0; j<dimension*dimension;j++){
				var numberIndex=100*i+j;
				var number = document.getElementsByClassName("card")[i].children[j];
				//number.addEventListener("click", game.chooseNumber);
				number.index=numberIndex;
			}
		}
	}

	function fillArrayWithNumbers(n){
		var arr=[];
		for(var i=0; i<n; i++){
			arr[i]=i+1;
		}
		return arr;
	}


	function generateCard(dimension, numbers, cardNumber){
		var i,j;
		var arr=fillArrayWithNumbers(numbers);
		var range = parseInt(numbers/dimension);

		for (i = 0; i < dimension; i++) {
			range--;
			for (j = 0; j < dimension; j++){
				if (i == 2 && j == 2){
					continue;
				}
				var index = getRandomInt(range*j, range*j+range+1);
				var newNumber = document.createElement("p");
				var value = document.createTextNode(arr[index]);
				newNumber.className = "number-box";
				if(dimension===3){
					newNumber.className += " d3";
				}
				newNumber.appendChild(value);
				document.getElementsByClassName("card")[cardNumber].appendChild(newNumber);
				arr.splice(index,1);
			}
		}
	}
	


	function checkVictory(index){
		var dimensions = parseInt(localStorage.getItem('dimensionNumber'));
		var usedNumbers = sessionStorage.getItem('choosenNumbers').split(',');
		var elementsInRowCounter=1;
		var elementsInColumnCounter=1;
		if(usedNumbers.length>0){
			usedNumbers.forEach(function(value){
					if(parseInt(value)===index){
						value=index;
					}else{
						if(parseInt(index/100)===parseInt(parseInt(value)/100)){
							var correctIndex=index%100;
							var correctValue = parseInt(value)%100;
							var row=0, column=dimensions-1;
							var indexRow = parseInt(correctIndex/dimensions);
							var valueRow = parseInt(correctValue/dimensions);
							var indexColumn = correctIndex - indexRow*dimensions;
							var valueColumn = correctValue - valueRow*dimensions;
							if(indexRow===valueRow){
								elementsInRowCounter++;
								console.log(elementsInRowCounter);
							}
							if (indexColumn===valueColumn) {
								elementsInColumnCounter++;
								console.log(elementsInColumnCounter);	

							}
							if(elementsInRowCounter===dimensions || elementsInColumnCounter===dimensions){
								if(document.getElementsByClassName("card")[0]){
									sessionStorage.setItem('bingo', true);
									}

								//sessionStorage.setItem('bingo', true);
							}
						}
					}
			});
		}	
		usedNumbers[usedNumbers.length]=index;
		sessionStorage.setItem('choosenNumbers', usedNumbers);
	}

	function chooseNumber(element){
		var myNumber = parseInt(element.innerHTML);
		var bingoNumber = parseInt(document.getElementById("number").innerHTML);
		var numberIndex = element.index;

		if(bingoNumber===myNumber){
			if(document.getElementsByClassName("card")[0]){
			element.className += " chosenNumber";
			// player 1 hits js pop-up
			alert("Player 1 hits!");
			checkVictory(numberIndex);
			}

			/*if(document.getElementsByClassName("card")[1]){
				element.className += " chosenNumber";
				// player x hits js pop-up
				alert("Player 2 hits!");
				checkVictory(numberIndex);
				}*/
		}
	}

	return{
		countRange: function(){
			var dimensionNumber = document.getElementById("dimension").value;
			var min = 100;
			var max = 100;
			var numbers = document.getElementById("numbers");

			numbers.min=min;
			numbers.max=max;
			numbers.value = min;
		},

		setValues: function (){
			var dimensionNumber = parseInt(document.getElementById("dimension").value);
			var cardsNumber = parseInt(document.getElementById("cards").value);
			var numbers = document.getElementById("numbers");
			var quantity = parseInt(numbers.value);
			var min = parseInt(numbers.min);
			var max = parseInt(numbers.max);
			//in case if user entered wrong values
			if(quantity < min){
					numbers.value = min;
					quantity = min;
			}
			if(quantity > max){
				numbers.value = max;
				quantity = max;
			}

			localStorage.setItem('dimensionNumber', dimensionNumber);
			localStorage.setItem('cardsNumber', cardsNumber);
			localStorage.setItem('numbers', quantity);
			setSessionStorage();

			document.getElementById('container').classList.toggle("main");
			generateCards(dimensionNumber, cardsNumber, quantity);
		},

		showSettings: function () {
			document.getElementsByClassName("cards-field")[0].innerHTML = '';
			document.getElementById('container').classList.toggle("main");
		},

		generateNumber: function (){
			var quantity = parseInt(sessionStorage.getItem('counter'));
			var index = getRandomInt(0, quantity);
			var arr = sessionStorage.getItem('numbersArray').split(',');
			var number = document.getElementById('number');
			number.className = "number";
			number.innerHTML=arr[index];
			quantity--;
			sessionStorage.setItem('counter', quantity);
			if(quantity<0){
				endOfGame("loose");
			}
			arr.splice(index, 1);
			sessionStorage.setItem('numbersArray', arr);
		},

		isBingo: function (){
			var result = sessionStorage.getItem('bingo');
			if(document.getElementsByClassName("card")[0]){
				if(result==="true"){
					alert('Player 1 has won the game!');
					endOfGame("won");
				}else{
					var number = document.getElementById('number');
					number.className = "answer";
					number.innerHTML = "Not bingo yet";
				}
			}
			if(document.getElementsByClassName("card")[1]){
				if(result==="true"){
					alert('Player 2 has won the game!');
					endOfGame("won");
				}else{
					var number = document.getElementById('number');
					number.className = "answer";
					number.innerHTML = "Not bingo yet";
				}
			}
			/*if(result==="true"){
				alert('Player x has won the game!');
				endOfGame("won");
			}else{
				var number = document.getElementById('number');
				number.className = "answer";
				number.innerHTML = "Not bingo yet";
			}*/
		}
	}
}());
