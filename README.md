# Jeopardy #

Jeopardy is an HTML5/CSS3/Ecmascript5 port of the popular gameshow, Jeopardy.  It attempts to mimic as close a possible the style of play and game rules that contestants of the show follow when playing the game.  This project has been setup such that it can be used in a classroom, but any large setting where there is one presenter and a group of players would work.



## Game Setup ##

### Entering Questions ###

The game is being designed to support WebSQL and the SQLite implementation of client side storage, however this part is not yet feature complete.  For testing and development purposes, static data is currently stored in an array in the `DataContext.js` file.  Here, any categories and data can be added or changed so that they show up on the screen.  Once the WebSQL implementation is done, however, it will be capable of pulling data from the database and displaying it to the screen.

### Game Options ###

An interface will allow the game presenter to choose from several different game variations.  Because this project is still in its infancy, there are no options to choose from.  In future releases, however, features can be added such as choosing the type of answering (see 'Game Play: Answering Questions'), which categories to include in a round, placement of Daily Doubles, etc.

### Running the Game ###

There is currently a basic index page that can be used to navigate to either the data management page or the game play page.  Choosing the game play page will take you to the traditional Jeopardy style grid.  If players are using buzzers (see 'Game Play: Answering Questions'), each contestant will need to navigate to the Contestant page and sign in with a unique username.  From there each contestant will be able to "buzz in" when he/she knows the correct answer.



## Game Play ##

### Choosing Questions ###

Currently, only the presenter can choose a question.  Ideally this would mean that in a group setting the current person in control would simply state the desired question (as they do in the game), however it is ultimately up to the presenter to decide which square to click on.

### Answering Questions ###

Because the game is currently meant to be played in a group setting, there are two ways questions can be answered.  When a server running `node.js` is not available, simply raising hands is the only reliable way of answering questions.  However, if a server running `node.js` is available, websockets can be used to allow each contestant to have their own buzzer.  Each contestant will need to load the `Contestant` html page and enter a unique username.  This will link the user to the `node.js` server and buzz in.  When a contestant is the first person to answer a question, every user (including the presenter) that is connected to the server will be notified.  In this version the user is required to verbally respond to the question, so it is up to the presenter to determine a correct answer.

### Scoring ###

The current implementation offers no method for tracking contestant responses and scores.  This must therefore be done by hand.  However, a future release will include scores being displayed on the presenter's computer and (ideally) on the contestant's computer.



## Future Features ##

These are in no particular order and are not guaranteed to be included, but are just ideas for future implementations.

1. Ability to answer questions by writing the answer in a simple text box.
2. Group answering - Ability to have multiple people answer the question regardless of who buzzed in first.
3. Category select - The presenter can choose which categories should be included in each round instead of being generated randomly.
4. Allow contestants to choose which question to answer next from their own computer.
5. Selecting between spoken answers and answering the question on the contestants' computers.
6. Playing the game from a single computer - Contestants can buzz in from the presenter's computer.
7. Scoring showing on the contestants' and presenter's computers.
8. Daily Doubles - Ability for the contestants to wager money and answer the question alone.
9. Final Jeopardy - A single question that no one buzzes in for, but that everyone can answer.  This will require contestants to answer from their own computers in multiplayer server mode, and so will require feature 1 to be implemented first.  Games played from the same computer will require a new interface.