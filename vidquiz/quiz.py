"""
Python version of quiz.js
Will be integrated into an edX XBlock
"""


class QuizQuestion():
    """
    A question on the quiz with which the student interacts
    """

    _tries = 1  # Tries the student has left to answer question
    _question = ''  # The question that is asked
    _answer = ''  # The answer to the question being asked
    _result = False  # Did the student pass or fail this question?
    _touched = False  # Did the student attempt or visit this question?

    def __init__(self, question='', answer='', tries=3):
        """Constructor that takes a question, answer and the number of tries a student gets when answer a question"""
        self._question = question
        self._answer = answer
        if tries > 0:
            self._tries = tries

    def get_question(self):
        """Return question"""
        return self._question

    def get_answer(self):
        """Return answer"""
        return self._answer

    def get_tries(self):
        """Return tries"""
        return self._tries

    def get_result(self):
        """Return result"""
        return self._result

    def touched(self):
        """Return touched"""
        return self._touched

    def touch(self):
        """Touch this question"""
        self._touched = True

    def submit(self, answer):
        """Submit and evaluate student answer"""

        if not self._touched:

            self._tries -= 1  # decrement tries
            self._result = self.evaluate(answer)  # evaluate answer
            if self._tries == 0 or self._result:
                self._touched = True

        return answer

    def evaluate(self, answer):
        """Evaluate student answer"""
        # For now, it's a direct string comparison
        # Customize for your own needs
        return self._answer == answer

    def skip(self):
        """Student skips this question; touch this question"""
        self._tries = 0
        self._touched = True

    def __str__(self):
        """Print instance variables of this question"""
        return "Question: " + self._question + ", Answer: " + self._answer + ", Result: " + str(self._result) +\
              ", Tries left: " + str(self._tries) + ", Was it attempted? " + str(self._touched)
