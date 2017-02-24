//JQuery section

$(document).ready(function(){
	var guessboxes=$('#main').find('.guess');
	var a='test';
	var NewGame=newGame();
	$('#hintnumbers').text(NewGame.provideHint());
	function fillguessboxes(){
		var i=0;
		guessboxes.each(function(){//each() is best way to iterate over DOM elements
			var guesselem=NewGame.pastGuesses[i];
			var span=$(this).find('span');//This is the actual text within the guessboxes
			if(typeof(guesselem)!='undefined'){
				span.addClass('float');
				span.text(guesselem);
				span.animate({'top':'5px','opacity':1},600);
			}
			else{
				span.removeClass('float');
				span.removeAttr("style");
				span.text('-');
			};
			i++;
		})
		//Alternate codes that worked!!  The numbers refer to the corresponding code at the bottom of comments
		/*  (1) worked by traversing the DOM to access the 
		appropriate guessboxes (the li nodes).  This wasn't a very elegant solution however. */

		/* (2) worked by iterating over NewGame.pastGuesses, and then
		filling the guessboxes accordingly, but it was even more problematic because
		an empty pastGuesses array would not erase past guesses in the guessboxes.*/
	};

	function gameEnd(){//disables buttons and changes reset button
		$('#submit, #hint').prop("disabled",true);//(3) for old code... also $(this).add('#hint').prop("disabled",true) also works (if you want $this instead of #submit)
		$('#reset').text('Again?');		
	}

	function makeAGuess(){
		var inp=+$('#player-input').val();//Remember must make sure it is a number
		$('#player-input').val('');
		var outcome=NewGame.playersGuessSubmission(inp)//You can also leave inp as string, and then use parseInt(inp, 10) as guesssubmission argument
		if(NewGame.isLower()){$('#subtitle').text("Guess Higher!");}else{$('#subtitle').text("Guess Lower!");}
		$('#title').text(outcome);
		fillguessboxes();

		if(outcome=='You Win!'){
			$('#subtitle').text('It took you only '+(NewGame.pastGuesses.length+1)+' guesses.  Way to go!');
			gameEnd();
		}
		else if(outcome=='You Lose.'){
			$('#subtitle').text('Jeese you suck!!!');
			gameEnd();
		}
	}


	$('#submit').on('click',function(){//can also do $('#submit').click(function(e){makeAGuess();})// is the 'e' really necessary?
           makeAGuess();
	})


	$('#player-input').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess();
        }
    })


	$('#reset').on('click',function(){
		NewGame=newGame();
		$('#title').text('Play the Guessing Game!');
		$('#subtitle').text('Guess a number between 1 and 100');
		fillguessboxes();
		$('#submit, #hint').prop("disabled",false);//(3)

		$(this).text('reset');
		$('#hintsdiv').slideUp();
		$('#hintnumbers').text(NewGame.provideHint());
	})

	$('#hint').on('click',function(){
		$('#hintsdiv').slideToggle();
	})


});




//Guessing Game Javascript section


function existsinarray(num,arr){
	for(var i=0;i<arr.length;i++){
		if(arr[i]==num){
			return true
		}
	}
	return false
}

function generateWinningNumber(){
	return Math.floor(Math.random()*100+1);
}

function shuffle(arr){
	var Grptoshuffle=arr.length;
	while(Grptoshuffle>0){
		var i=Math.round(Math.random()*(Grptoshuffle-1))//this is the index of the random element
		//of the array (specifically of the still to-be-shuffled/remaining elements group)

		/*
		console.log('i is '+i);
		console.log('random element is '+arr[i])
		console.log('last element of remaining roup is '+arr[Grptoshuffle-1])
		*/

		//the following 3 lines simply swaps the last element of the to-be-shuffled group with the randomly
		//picked element (arr[i])

		var tempelement=arr[i];
		arr[i]=arr[Grptoshuffle-1];
		arr[Grptoshuffle-1]=tempelement;

		/*
		console.log('Array post-swap '+arr)
		*/

		Grptoshuffle-=1;//The number of remaining elements to be shuffled dwindles after each iteration.
		//Because of this, the last element that was replaced will be outside the scope of this whole random
		//picking and swapping mechanism at the next iteration
	}
	return arr;
}

function Game(){
	this.playersGuess=null;
	this.pastGuesses=[];
	this.winningNumber=generateWinningNumber();
}

function newGame(){
	return new Game();
}

Game.prototype.difference=function(){return Math.abs(this.playersGuess-this.winningNumber);};
Game.prototype.isLower=function(){return this.playersGuess<this.winningNumber;};
Game.prototype.checkGuess=function(){
	//return this.difference();
	if(this.playersGuess==this.winningNumber){
		return 'You Win!';
	}
	else if(existsinarray(this.playersGuess,this.pastGuesses)){
		return 'You have already guessed that number.';
	}
	else{
		this.pastGuesses.push(this.playersGuess);
		if(this.pastGuesses.length>=5){
			return 'You Lose.';
		}
		if(this.difference()>=50){//100>difference>=50
			return "You're ice cold!";
		}
		else{
			if(this.difference()>=25){//50>difference>=25
				return "You're a bit chilly.";
			}
			else{
				if(this.difference()>=10){//25>difference>=10
					return "You're lukewarm.";
				}
				else{
					return "You're burning up!";
				}
			}
		}
	}
}


Game.prototype.playersGuessSubmission=function(newguess){
	if(newguess>100 || newguess<1 || typeof(newguess)!='number'){
		throw 'That is an invalid guess.';
	}
	else{
		this.playersGuess=newguess;
		return this.checkGuess.call(this);
	}
}

Game.prototype.provideHint=function(){
	return shuffle([this.winningNumber,generateWinningNumber(),generateWinningNumber()]);
}




/*



(1)
		var currentguessbox=guessboxes.first();
		for(var i=0;i<guessboxes.length;i++){
			var guesselem=NewGame.pastGuesses[i];
			if(typeof(guesselem)!='undefined'){
				currentguessbox.text(guesselem);
				
			}
			else{
				currentguessbox.text('-');
			}
			currentguessbox=currentguessbox.next();
		}

(2)

		var currentguessbox=guessboxes.first();
		for(var i=0;i<NewGame.pastGuesses.length;i++){
			currentguessbox.text(NewGame.pastGuesses[i]);
				currentguessbox=currentguessbox.next();
			}



(3)

$('#submit, #hint').addClass('disabled'); $('#submit, #hint').removeClass('disabled'); (reset: removeclass, win or lose: addclass)

The above old code makes button look disabled (or not) on a cosmetic level, but
does not actually affect functionally (You can still click it and make it do stuff after adding class 'disabled')
Originally I used this code and then put conditional statements in submit and hint event handlers to make it
only work in the right circumstances, but that ended up adding unnecessary code that could be entirely obviated by
using $('#submit, #hint').prop("disabled",true/false) instead (that code makes the button disabled/enablede both appearance wise
and functionally!).




Other random code:

//JQuery: selecting and changing text by tag:
//For example: changing all the <li> text in your index.html from '-' (as indicated in the original html doc) to "test"
//$('li').text('test')

//selecting and changing text by id:
//For example, changing the text "hint" for the hint button (id='hint') to 'poop'
//$('#hint').text('poop')

//selecting by class is just $('.class').. don't really have a good example to change in index.html but it is pretty
//straightforward

*/