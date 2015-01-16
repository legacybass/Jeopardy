Jeopardy
========
HTML5 Project to mimic the TV gameshow Jeopardy

Getting Started
---------------

First, make sure you have Node.js installed on your computer. If not, it can be downloaded [here][1].
Secondly, you'll need to have Mongo installed. It can be downloaded [here][2].

Once you have Node and Mongo installed, check out the repo using git.  
`git clone https://github.com/legacybass/Jeopardy.git`  
Conversely, you may also download the repo as a [zip file][3]. 

Once you have the repo, you'll need to install the node dependencies. This is most easily done with the command line and npm. NPM is installed alongside Node, and it should have created an entry so it can be used from anywhere. Dependencies can be installed by running the following command from the folder where the Jeopardy code is located:  
`npm install`

Lastly, Jeopardy uses a build script to compile and prepare the site to run (see [Tech Stack](https://github.com/legacybass/jeopardy/#tech-stack) for more info). After NPM has finished installing, you'll need to run the build script with Gulp. Navigate to the root of the Jeopardy checkout, and run the following line:  
`gulp default`  
You may have to install Gulp into the global space for it to run correctly. If the above command doesn't work, try running the following and repeating the above command:  
`npm install -g gulp`

Running the App
----------------

Once Jeopardy has been setup, you must simply start the server and database. Start your Mongo instance using whatever folders you choose for your database. Any changes to the accessible ports or permissions will need to be updated in the app.js file in Jeopardy. Next, start the server. From the root of the code, run `node app.js` to start the server. You can then navigate to `http://localhost:3000` to see the home page.

The home page is setup with 3 options: manage your data, setup a new game, or join as a contestant. If you are running the app on a single computer, you will either need to allow your computer to be connected to from remote machines, or not use remote contestants. Jeopardy is not currently setup to allow multiple users from one machine, but that is a feature in the works.

Managing Data
-------------

Data management is fairly straightforward. Choose the data management link from the home page (you'll need to log in if you aren't currently) and you'll be taken to the data management page. If you have not created a user, you can register a new user from the login screen. Once on the data management page, you can create new categories and questions using the UI boxes at the bottom of the page.

To edit a category, click on the down arrow next to its name. The data will be pushed into the UI below the categories list where you can then edit the category. You can then select save or cancel. Clicking on the category name will show you all the questions in that category.

Questions can be edited by clicking the pencil icon next to the question. The question data will then be pushed to the UI below, and you can then edit the question.

Playing the Game
----------------

Select Host Jeopardy Game from the home page (you'll need to log in if you aren't currently). You'll be shown the options screen for creating a game. The options include selecting categories you'd like to see, and timers for buzzing in or providing the answer.

#### Selecting Categories
If fewer than 6 categories are selected, randomly selected categories will fill in the blanks (e.g. you select 4 categories that definitely will show up, and the computer will select the other 2). If you select more than 6 categories, the computer will randomly select 6 from the list provided.

#### Timers
The question timer is used to determine how much time a contestant has before the question times out. That is, once a question has been selected, the contestant only has a specific amount of time before they are no longer allowed to buzz in for that question.  
The contestant timer is used to determine how much time a contestant has to answer a question once he or she has buzzed in.

#### The Game Board
Once the options have been selected, click the start game button. It will then take you to the game board. The game board consists of 6 columns with 5 rows each (unless there is insufficient data to fill the area). Simply clicking on the desired square will cause the selection of the question. The question will then be shown enlarged on the screen. After the question timer has been exhausted or a contestant has correctly answered, the question will disappear and a new question can be selected.

#### Rules
The rules are the same as the original game show, but they can be altered for whomever is playing the game. Once a question has been selected, contestants must buzz in. For games involving remote players, they can click their virtual buzzer to buzz in on the server. The host's UI will indicate the first player to buzz in, and the contestant will have until the timer runs out to answer the question. If the answer is incorrect or the timer runs out, other contestants will be able to buzz in.  
If the contestant answers correctly, they will receive points toward their score. If they answer incorrectly, they will lose the points for that question. At the end of the game, the contestant with the most points wins.

Tech Stack
----------

Jeopardy is a [Node.js][1] application running on the Express framework. It uses [MongoDB][2] as its database backing store, and [Mongoose][5] wraps the Mongo API. The front end uses [KnockoutJS][6] as the data-binding framework, [Sammy][7] as the routing framework, [RequireJS][8] as the module loading framework, and [Socket.io][9] for the websocket communication.

Overall I'm pleased with the stack I'm using, however I'd like to replace Sammy in a future update. Currently Sammy is the only routing framework that supports client-side post calls that I know of, and this one ability helps clean up the code considerably.

#### EcmaScript 6 Features
Jeopardy has a lot of its code written in the new EcmaScript 6 format. This allows syntactic sugar for things like classes, and has great support for modules. The new spec also allows for things like default function arguments and destructuring.

Since browsers don't currently support Ecma6, however, I'm using the [traceur compiler][10] to push it down into Ecma 5 (the current modern standard). This allows the code to be run in both Node (without the -harmony flags) and the browser. However, it means that it must be compiled before run. Gulp helps with this, but it can be greatly cleaned up once Ecma 6 becomes officially standardized.


[1]: http://nodejs.org/download/									"Node"
[2]: https://www.mongodb.org/downloads								"MongoDB"
[3]: https://github.com/legacybass/Jeopardy/archive/master.zip		"Master Repo"
[4]: http://expressjs.com/											"Express"
[5]: http://mongoosejs.com/											"Mongoose"
[6]: http://knockoutjs.com/											"Knockout"
[7]: http://sammyjs.org/											"Sammy"
[8]: http://www.requirejs.org/										"Require"
[9]: http://socket.io/												"Socket.io"
[10]: https://github.com/google/traceur-compiler					"Traceur"
