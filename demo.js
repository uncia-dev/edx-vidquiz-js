/*
This file contains the elements of a quiz, and loads them in a quiz
container used by the main html file.
*/

// Quiz elements
var quiz_elements = [

[2, "Hello! This is supposed be a question, yes?", "yes", 3],
[11, "What does edX aim to create?", "virtual classrooms", 1],
[18, "So yeah, JS applications do work in edX! Just needs a lot of tweaking to make it work!", "pass", 100000],

];

// Make a blank Quiz object
var quiz = new Quiz();

// Build the quiz
for (i in quiz_elements) {
	quiz.add(quiz_elements[i][0], quiz_elements[i][1],
			 quiz_elements[i][2], quiz_elements[i][3]);
}