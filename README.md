# NEO
NEO is an open source novel-writing program. Originally conceived [by bestselling author Hugh Howey](http://www.hughhowey.com/neo-a-word-processor-for-authors/), the goal is to create a clean interface for expressing creativity, with perfect ebook output and organization features. Hugh is providing guidance and feedback, but his participation is limited at the moment due to [Internet access issues in the middle of the Pacific](https://www.facebook.com/hughhowey).

The editor is being developed using [Electron](https://electron.atom.io/) to deliver a full-featured
cross-platform desktop application. Right now the core application framework is being developed by [Scott Means](http://smeans.com) with the intent to recruit more developers around October 2017. If you're a
skilled designer with CSS and print/ebook design skills we could use your help now to start polishing
NEO's UI and ebook themes. Feel free to [contact Scott directly](mailto:smeans+neo@gmail.com) if you're interested.

## Running from source
To get the very latest features (and unfixed bugs) you'll need to run NEO from its source code. To run from source, you'll need to [install git](https://git-scm.com/downloads) and clone the NEO repository to your local system:

```
$ git clone https://github.com/smeans/neo
```

This should create a folder called `neo` on your
machine. To run neo, you will also need to install [Node.js](https://nodejs.org/en/). This will give you access to the Node runtime and the Node Package Manager (npm) utility. Once Node is installed, you can run NEO from the command line using npm:

```
$ cd neo/app
$ npm install
...
$ npm start
```

If all went well, NEO will fire up as a full-screen app and you're in business. Whenever you want to refresh your local copy of the source, just do a git pull:

```
$ cd neo
$ git pull origin master
```
