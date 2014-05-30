/*
This file contains the elements of a quiz, and loads them in a quiz
container used by the main html file.
*/

// Quiz elements
var quiz_elements = [

[1, "Is this the first question?", "yes", 3],
[3, "Is this the sixth question?", "no", 1],
[5, "Is this the third question?", "yes", 5]

];

// Make a blank Quiz object
var quiz = new Quiz();

// Build the quiz
for (i in quiz_elements) {
	quiz.add(quiz_elements[i][0], quiz_elements[i][1],
			 quiz_elements[i][2], quiz_elements[i][3]);
}
