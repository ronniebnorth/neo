# Developing for neo
tl;dr:

* [Electron](https://electron.atom.io/) is used for cross-platform (Mac, Linux, Windows) delivery.
* Look at existing modules for coding standards.
* Use JSDoc for generating documentation.

## neo Architecture
The primary goals of neo are to provide a distraction-free writing environment while flawlessly managing ebook publishing and distribution. Conflicting with these goals are the widely-differing expectations of users. A feature that is seen as a distraction by one user is seen as a must-have by another. The core neo architecture has been designed to strike a balance between these two extremes.

## Core and Tabs
The functions of neo have been split between the neo Core module and an extensible set of Tab modules. This allows new features and functionality to be provided (and installed) without forcing the complexity onto users who don't want it.

The neo Core module is responsible for:

* User and Author managment
* Preferences
* Story file management/version control
* Tab management
* Editor chrome (UI)
* Templates

All other functions are provided by plug-in modules called Tabs. Tabs are self-contained packages of JavaScript, HTML, and whatever other resources they require to perform their function. Some "Tabs" may not have a UI at all, but will provide some kind of in-editor functionality. Tabs will be able to fully integrate into the neo event stream and overload any aspect of editor functionality.

## Bookcase
The bookcase is where neo displays all of the documents and templates it is aware of. While neo is running, it maintains a list of folders it monitors for activity and whenever neo documents in those folders change, it updates the bookcase display. The entities presented are:

* Bookcase - a singleton that represents all of the documents/templates neo is aware of.
* Shelf - a list of related documents/templates. Corresponds to a keyword in the neo document metadata.
* Book - a concrete neo document.
* Template - a neo document that is copied by default and may contain replaceable content.