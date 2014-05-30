/*
A QuizQuestion object
*/

/*
Constructor takes in a question and answer, and optionally the number of tries
for a question (default 3)
*/
function QuizQuestion(question = '', answer = '', tries = 3) {

	var tries = (tries > 0) ? tries : 1; // tries left; force to be at least 1
	var question = question; // question being asked
	var answer = answer; // answer to the question
	var result = false; // student result (fail by default)
	var touched = false; // flag for whether or not student dealt with this
						   // question

	/* Getter for tries */
	this.getTries = function() {
		return tries;
	};

	/* Getter for question */
	this.getQuestion  = function() {
		return question;
	};

	/* Getter for answer */
	this.getAnswer  = function() {
		return answer;
	};

	/* Getter for result */
	this.getResult = function() {
		return result;
	};

	/* Set status of this question to touched */
	this.touch = function() {
		touched = true;
	};

	/* Getter for touched */
	this.isTouched = function() {
		return touched;
	};

	/* Submit student answer and return validity of answer */
	this.submit = function(ans = '') {

		// Only process submission if the question was never attempted
		if (!touched) {

			tries--; // decrement tries
			result = this.validate(ans); // validate answer
			if (tries == 0 || result) this.touch();

		}

		return result;
	};

	/*
	Validate student answer; to be used for more precise or lenient validation
	*/
	this.validate = function(ans = '') {
		// For now it's just a direct string comparison
		return (answer === ans);
	};

	/* Student skips the question. Sets tries to 0 and touched to true */
	this.skip = function() {
		tries = 0;
		this.touch();
	};

	/* For development purposes: Output QuizQuestion variables */
	this.listVars = function() {
		return "[Question: " + question + ", Answer: " + answer +
				 ", Result: " + result + ", Tries left: " + tries + ", Was it attempted? " + touched + "]";
	};

};

/*
Controller for QuizQuestion object
*/

/*
Constructor takes a QuizQuestion object, a Popcorn object controlling a video,
and an array of IDs for the elements that make up the form for questions (see 
below).
*/
function QuizController(question, popcorn, elements) {

	var question = question; // QuizQuestion currently manipulated
	var popcorn = popcorn; // popcorn object that manipulates video
	var elements = elements; // elements of the question form,
							 // in case you want to customize element IDs

	/* Strings to be displayed; customize for your own uses */
	var str_WrongAnswer = "Sorry, your answer was not correct.";
	var str_TriesLeft = "Tries left: ";
	var str_NoTriesLeft = "No more tries left.";
	var str_Correct = "Correct! ";
	var str_QuizAnswer = "The answer is: \"" + question.getAnswer() + "\".";
	var str_AlreadyDone = "You have already attempted this question.";
	var str_AlreadyAttempted = "You have already attempted this question.";
	
	/* Components of the elements arrays
		elements[0] - Div containing question form
		elements[1] - Question
		elements[2] - Answer
		elements[3] - Student Answer field
		elements[4] - Tries field
		elements[5] - Submit Button
		elements[6] - Skip Button
		elements[7] - Continue Button
		elements[8] - Video area
	*/

	$("#"+elements[1]).text(question.getQuestion()); // set question
	$("#"+elements[2]).text(""); // keep answer text blank at first
	$("#"+elements[3]).text(""); // keep student answer box blank at first
	$("#"+elements[7]).hide(); // hide Continue button by default

	// Did the student already complete this question?
	if (question.isTouched()) {

		// The student answered correctly before; show the answer
		if (question.getResult()) $("#"+elements[2]).text(str_AlreadyDone + 
			" " + str_QuizAnswer);
		// The student did not answer correctly; don't show the answer
		else $("#"+elements[2]).text(str_AlreadyAttempted);

		$("#"+elements[3]).hide(); // hide textbox
		$("#"+elements[5]).hide(); // hide submit button
		$("#"+elements[6]).hide(); // hide skip button
		$("#"+elements[7]).show(); // show continue button

	}

	/*
	Resets question form to a blank state
	*/
	this.reset = function() {

		// Clear fields
		$("#"+elements[1]).text(""); // clear question
		$("#"+elements[2]).text(""); // clear answer
		$("#"+elements[3]).val(""); // clear student_answer
		$("#"+elements[4]).text(""); // clear tries
		// Reset hide and show for relevant fields
		$("#"+elements[3]).show(); // show student_answer field
		$("#"+elements[5]).val("Submit"); // show "Submit" again
		$("#"+elements[5]).show(); // show submit button
		$("#"+elements[6]).show(); // show skip button
		$("#"+elements[7]).hide(); // hide continue button

	};

	/*
	Show Quiz / Pause and hide video
	*/
	this.show = function() {
		$("#"+elements[8]).hide();
		popcorn.pause();
		$("#"+elements[0]).show();
	}

	/*
	Hide Quiz / Resume and show video
	*/
	this.hide = function() {
		$("#"+elements[8]).show();
		popcorn.play();		
		$("#"+elements[0]).hide();
	}

	/*
	Submit answer and provide feedback
	*/
	this.submit = function() {

		$("#"+elements[5]).val("Resubmit"); // change submit button text
		$("#"+elements[6]).hide(); // hide skip button
		$("#"+elements[7]).show(); // show continue button

		// Only accept answers if the question was never attempted
		if (!question.isTouched()) {

			$("#"+elements[4]).show(); // hide tries

			// Give the student the bad news
			if (question.getTries() == 1) {
				$("#"+elements[4]).text(str_NoTriesLeft);
				$("#"+elements[5]).hide(); // hide submit button

			// Still some tries left, so display them
			} else {
				$("#"+elements[4]).text(str_TriesLeft + (question.getTries() - 1));
			}

			// Submit student answer
			if (question.submit($("#"+elements[3]).val())) { // correct answer
				$("#"+elements[2]).text(str_Correct + str_QuizAnswer); // display answer
				$("#"+elements[3]).hide(); // hide student answer
				$("#"+elements[4]).hide(); // hide tries
				$("#"+elements[5]).hide(); // hide submit button
			} else { // wrong answer
				$("#"+elements[2]).text(str_WrongAnswer); // display error
			}

		};

	};

	/*
	Skip question, hide question form and resume video
	*/
	this.skip = function() {
		question.skip(); // set question to skipped state
		this.resume(); // do what question_resume does
	};

	/*
	Hide question form and continue playing video
	*/
	this.resume = function() {
		question.touch(); // touch question
		this.hide(); // hide question and show video
		this.reset(); // clear question form
	};

};
/*
Container for QuizEntries
*/
function Quiz() {

	/* Use [<time>:QuizQuestion] format */
	var entries = [];

	/* Getter for QuizEntries */
	this.grab = function() {
		return entries;
	}

	/*
	Create QuizQuestion that triggers at trigger_time (in seconds).
	*/
	this.add = function(trigger_time=0, question='',
							 answer='', tries=3) {

		entries.push([trigger_time, 
					new QuizQuestion(question, answer, tries)]);

	};

	/*
	For developer purposes: display all entries from this container
	*/
	this.print = function() {
		for (i in entries) {
			console.log("[Time: " + entries[i][0] + ', QuizQuestion: ' + 
						entries[i][1].listVars() + "]");
		};
	};

};

/*
Function that is assigned to each trigger event during the video.
Used for controlling a Quiz Entry at the triggered time.
*/
popQuiz = function (quiz, corn, elements) {

	var current_quiz = new QuizController(quiz, corn, elements);

	current_quiz.show();

	// Student pressed Submit
	$("#"+elements[5]).click(function() {
		current_quiz.submit();
	});

	// Student pressed Continue
	$("#"+elements[6]).click(function() {
		current_quiz.resume();
	});

	// Student pressed Skip
	$("#"+elements[7]).click(function() {
		current_quiz.skip();
	});

};
