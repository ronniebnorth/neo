# neo
A word processor for authors targeting ebook production based on Hugh Howey's blog post:
[Neo - A Word Processor for Authors](http://www.hughhowey.com/neo-a-word-processor-for-authors/). This is not endorsed by Mr. Howey in any way, it's just a proof-of-concept project for me to play with implementing his ideas using [Electron](https://electron.atom.io/) for cross-platform HTML/CSS/JavaScript app development.

## Running from source
To get the very latest features (and unfixed bugs) you'll need to run neo from its source code. To run from source, you'll need to [install git](https://git-scm.com/downloads) and clone the neo repository to your local system:

```
$ git clone https://github.com/smeans/neo
```

This should create a folder called `neo` on your 
machine. To run neo, you will also need to install [Node.js](https://nodejs.org/en/). This will give you access to the Node runtime and the Node Package Manager (npm) utility. Once Node is installed, you can run neo from the command line using npm:

```
$ cd neo/app
$ npm install
...
$ npm start
```

If all went well, neo will fire up as a full-screen app and you're in business. Whenever you want to refresh your local copy of the source, just do a git pull:

```
$ cd neo
$ git pull origin master
```