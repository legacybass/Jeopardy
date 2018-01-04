# Jeopardy

A project written in React/Redux to emulate the popular TV game show, Jeopardy

## Setup

There are two parts to this project: the client side handled by React/Redux, and the API side handled by Express. If you want long term storage, you must run both halves of the project. The site is designed, however, to allow the end user to hook up whatever back end they like. As long as the interface between the two parts stays the same, everything should just work.

You may also use the React/Redux side offline. This is handled by the service worker, so you must be using a browser that supports service workers. Obviously in this mode, the web sockets won't work and will not respond to anything.

## Starting the Project

### Game Site
The game site is started by simply running `npm start` in the `site` folder. This will start the game server on
a default port of 3000, and begin running. You may also use the included Dockerfile to create a docker image and
container to host the game. You should either set environment variables or modify the config file to include the
address of the API host, if you are using an online game.

### API Server
The api server can be started by simply running `npm start` from the `api` folder. This will start the API server
with a default port of 3001. You may also use the included Dockerfile to create an image and container to host
the API. Be sure to set an environment variable or modify the config file to set the address of the Mongo server hosting the data.

## Game Play

### Game Setup

Game setup is handled by picking which categories you would like in the game, and duration of the timer. Once selected, starting the game will initialize everything the game needs to run.

### Host

The game runs with the options of having a host and clients all talking through web sockets. If you are running the offline version of the game, this section will not apply -- you will need to find a different way of buzzing in. In offline mode, it is recommended to set a timer length of 0. In this mode, a "Complete" button will appear that allows you to move to the next question.

A contestant selects a category, and the question will appear on the host's machine. In a future release, the contestants will be able to select the category from their own devices. For now, they will need to communicate their selection through a different medium (in person if available, through IM, etc.). The host may read the question aloud, and the timer will start a few seconds later. When the timer starts, the option of buzzing in becomes available. If the contestant gets the answer right, the host selects the "Correct" button and play continues. If the contestant answers wrong, the host selects "Incorrect" and contestants continue until the timer runs out or all contestants have answer incorrectly.

### Contestants

Contestants will sign in to the game using the game code. The game code will link them to the running game, and they will be able to buzz in. If a contestant buzzes in before the game alerts them to their availability, they will be temporarily locked out. The lock out will prevent them from buzzing in until a timer runs out. Once the contestant is able to buzz in, they may do so and answer the question.

In a future release, the contestant will be able to send the answer via text through the game. For now, however, you must communicate the answer through voice or some sort of IM.

## Data Management