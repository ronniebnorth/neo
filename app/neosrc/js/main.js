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

function syncBookcase() {
  neo.Bookcase.Shelves.forEach(shelf => {
    var shelf_div = $("#bookcase").find('div [data-name=' + shelf.name + ']');
    if (!shelf_div.length) {
      shelf_div = $('#templates .shelf').clone();
      $(shelf_div).attr('data-name', shelf.name);
      $(shelf_div).find('h2').text(shelf.name);

      $("#bookcase").append(shelf_div);
    } else {
      shelf_div = shelf_div[0];
    }

    shelf.stories.forEach(story => {
      var story_div = $(shelf_div).find('div [data-guid="' + story.metadata.guid + '"]');
      if (!story_div.length) {
        story_div = $('#templates .' + (story.isTemplate ? 'new_story' : 'story')).clone();
        $(story_div).attr('data-guid', story.metadata.guid);
        $(story_div).find('h3').text(story.metadata.title);

        $(shelf_div).find('.books').append(story_div);
      } else {
        story_div = story_div[0];
      }
    });
  });
}

$(function () {
  $(document).on('submit', handleFormPost);

  neo.BookcasePane = '#bookcase';
  neo.StoryPane = '#story';

  neo.neoRoot = path.join(app.getPath('documents'), 'neo');

  syncBookcase();

  showNextPane();
});
