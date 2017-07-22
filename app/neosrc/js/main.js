const path = require('path');

const electron = require('electron');
const remote = electron.remote;
const app = remote.app;

const $ = require('jquery');

// !!!TODO!!! fix Electron module search logic, should be able to use 'neo'
const neo = remote.require('./neosrc/node_modules/neo');
const log = remote.require('./neosrc/node_modules/log.js')

function showNextPane() {
  if (neo.CurrentUser) {
    $('#user_info').hide();
  }
}

function userStartHandler(e) {
  var form = e.target;

  var user = new neo.User(form.full_name.value);

  log.debug(user);

  neo.CurrentUser = user;
}

const form_handlers = {
  userStartHandler
}

function handleFormPost(e) {
  log.debug(e.target.name);
  form_handlers[e.target.name + 'Handler'](e);

  return false;
}

$(function () {
  $(document).on('submit', handleFormPost);
  neo.neoRoot = path.join(app.getPath('documents'), 'neo');

  showNextPane();
});
