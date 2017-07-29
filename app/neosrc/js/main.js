const path = require('path');
const fs = require('fs-extra');

const electron = require('electron');
const remote = electron.remote;
const app = remote.app;

const first_lines = fs.readJsonSync('./neosrc/first_lines.json');

const $ = require('jquery');

// !!!TODO!!! fix Electron module search logic, should be able to use 'neo'
const neo = remote.require('./neosrc/node_modules/neo');
const log = remote.require('./neosrc/node_modules/log.js')

function showPane(id) {
  var hiding = $('#stage>div.pane.active');
  if (hiding.length) {
    document.dispatchEvent(new CustomEvent('hiding_pane', {'pane': hiding[0]}));

    $('#stage>div.pane').removeClass('active');
  }

  var showing = $('#' + id);
  document.dispatchEvent(new CustomEvent('showing_pane', {'pane': showing[0]}));
  $(showing).addClass('active');
}

function showNextPane() {
  if (!neo.CurrentUser) {
    showPane('user_info');
  } else {
    showPane('bookcase');
  }
}

function userStartHandler(e) {
  var form = e.target;

  var user = new neo.User(form.full_name.value);

  neo.CurrentUser = user;
}

const form_handlers = {
  userStartHandler
}

function handleFormPost(e) {
  log.debug(e.target.name);
  form_handlers[e.target.name + 'Handler'](e);

  showNextPane();

  return false;
}

function handleNewStory(e) {
  neo.newStory();
}

$(function () {
  $(document).on('submit', handleFormPost);
  $('.new_story').on('click', handleNewStory)

  neo.BookcasePane = '#bookcase';
  neo.StoryPane = '#story';

  neo.neoRoot = path.join(app.getPath('documents'), 'neo');

  showNextPane();
});
