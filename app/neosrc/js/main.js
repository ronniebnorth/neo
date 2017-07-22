const remote = require('electron').remote;
// !!!TODO!!! fix Electron module search logic, should be able to use 'neo'
const neo = remote.require('./neosrc/node_modules/neo');
const log = remote.require('./neosrc/node_modules/log.js')

log.debug('in page main. current author ' + neo.CurrentAuthor);
