# Jeopardy #

Jeopardy is an HTML5/CSS3/Ecmascript5 port of the popular gameshow, Jeopardy.  It attempts to mimic as close as possible
the style of play and game rules that contestants of the show follow when playing the game.  This project has been setup
such that it can be used in a classroom, but any large setting where there is one presenter and a group of players would
work.


## Navigation ##

The main page has two options - data management and game play.  Data management will take you to a database representation
page where you can enter data into the tables for game play.  The game play page will first take you to a setup page where
you can configure the game.

## Game Setup ##

### Entering Questions ###

##### Server Side #####

The data management page shows representations of the tables used in the game.  You can add rows or modify existing rows
using the interface, similar to what you would do with a database WYSIWYG editor.  Currently, you will need to manually
assign categories to each question using the intermediate table so that they can be associated in the game play.

### Game Options ###

The setup page will currently only allow you to select basic options.  You can request an online game, or a local game
(local game play is currently broken).  With online play you must give a URL where the game should connect (defaults
to the current host location).  You can also select the timer length for each question, and which categories must be
included.  The included categories must appear exactly as they do in the database in order to be selected.  Otherwise,
they will be skipped.

### Running the Game ###

Once the game setup is complete, the traditional game board layout will be shown.  If this is an online game, contestants
can now join using the same URL as was used to connect the game host.  The game may start whenever the host decides,
however, contestants can join whenever they'd like.  In a future release, there will be an option to restrict contestants
joining only before the first question has been selected.

Once the game has been started, questions are selected simply by clicking on the desired questions.  The question will
show up, and the timer will start.  When a contestant buzzes in, the timer is cancelled, and they may answer the
question.  If the question is answered incorrectly, however, the host can restart the timer and continue.

Because this is in early development, there is currently only one round with no special spaces like Double Jeopardy.
In future releases, however, these game mechanics will be included.



## Game Play ##

### Choosing Questions ###

Currently, only the presenter can choose a question.  Ideally this would mean that in a group setting the current person
in control would simply state the desired question (as they do in the game), however it is ultimately up to the presenter
to decide which square to click on.  In future releases the game board will show up on the contestants' computers and the
player currently in control can select the question themselves.

### Answering Questions ###

Because the game is currently meant to be played in a group setting, there are two ways questions can be answered.  When
a server running `node.js` is not available, simply raising hands is the only reliable way of answering questions.
However, if a server running `node.js` is available, websockets can be used to allow each contestant to have their own
buzzer.  Each contestant will need to load the `Contestant` html page and enter a unique username.  This will link the
user to the `node.js` server and buzz in.  When a contestant is the first person to answer a question, every user
(including the presenter) that is connected to the server will be notified.

### Scoring ###

When the contestant buzzes in and correctly answers the question, the score for that question is added to the
contestant's total.  At the end of the game, all users' scores will be sent to the presenter for display.  In future
releases, the presenter will be able to display these scores at will for game events like Daily Doubles.



## Future Features ##

These are in no particular order and are not guaranteed to be included, but are just ideas for future implementations.

1. Ability to answer questions by writing the answer in a simple text box.
2. Group answering - Ability to have multiple people answer the question regardless of who buzzed in first.
4. Allow contestants to choose which question to answer next from their own computer.
5. Selecting between spoken answers and answering the question on the contestants' computers.
6. Playing the game from a single computer - Contestants can buzz in from the presenter's computer.
7. Scoring showing on the contestants' and presenter's computers.
8. Daily Doubles - Ability for the contestants to wager money and answer the question alone.
9. Final Jeopardy - A single question that no one buzzes in for, but that everyone can answer.  This will require
contestants to answer from their own computers in multiplayer server mode, and so will require feature 1 to be
implemented first.  Games played from the same computer will require a new interface.
10. Creating Presenter-less game.  Create a game as a contestant and play against other people on the same or different
computers.  Requires being able to create a session and send that info to other players.  Also requires features 1, 4,
6, and 7 to be implemented first.