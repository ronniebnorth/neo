const path = require('path');
const fs = require('fs-extra');

const electron = require('electron');
const remote = electron.remote;
const app = remote.app;

const first_lines = fs.readJsonSync('./neosrc/first_lines.json');

const $ = require('jquery');

// !!!TODO!!! fix Electron module search logic, should be able to use 'neo'
const neo = require('neo');
const log = require('log')

function showPane(id) {
  var hiding = $('#stage>div.pane.active');
  if (hiding.length) {
    document.dispatchEvent(new CustomEvent('hiding_pane', {detail: {pane: hiding[0]}}));

    $('#stage>div.pane').removeClass('active');
  }

  var showing = $('#' + id);
  document.dispatchEvent(new CustomEvent('showing_pane', {detail: {'pane': showing[0]}}));
  $(showing).addClass('active');
}

function showNextPane() {
  if (!neo.CurrentUser.metadata.fullName) {
    showPane('user_info');
  } else {
    showPane('bookcase');
  }
}

function userStartHandler(e) {
  var form = e.target;

  log.debug('full name', form.fullName.value);
  neo.CurrentUser.updateChunk('jpf_metadata', metadata => {
    metadata.fullName = form.fullName.value;
  });
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

function handleBookClick(e) {
  var storyDiv = $(e.target).closest('.cover');
  if (storyDiv.length) {
    var guid = $(storyDiv).attr('data-guid');
    var story = neo.Bookcase.storyFromGuid(guid);
    if (story && story.isTemplate) {
      neo.CurrentStory = story.newStory();
    }
  }
}

function syncBookcase() {
  neo.Bookcase.Shelves.forEach(shelf => {
    var shelf_div = $("#shelves").find('div[data-name="' + shelf.name + '"]');
    if (!shelf_div.length) {
      shelf_div = $('#templates .shelf').clone();
      $(shelf_div).attr('data-name', shelf.name);
      $(shelf_div).find('h2').text(shelf.name);

      $("#shelves").append(shelf_div);
    } else {
      shelf_div = shelf_div[0];
    }

    shelf.stories.forEach(story => {
      var story_div = $(shelf_div).find('div [data-guid="' + story.metadata.guid + '"]');
      if (!story_div.length) {
        story_div = $('#templates ' + (story.isTemplate ? '.template' : '.story')).clone();
        $(story_div).attr('data-guid', story.metadata.guid);
        $(story_div).find('h3').text(story.metadata.title);

        $(shelf_div).find('.books').append(story_div);
      }
    });
  });
}

var bookcaseSyncTimer;

function handleShowingPane(e) {
  switch ($(e.detail.pane).attr('id')) {
    case 'bookcase': {
      bookcaseSyncTimer = setInterval(syncBookcase, 1000);
    } break;
  }
}

function handleHidingPane(e) {
  switch ($(e.detail.pane).attr('id')) {
    case 'bookcase': {
      clearInterval(bookcaseSyncTimer);
    } break;
  }
}

$(function () {
  $(document).on('submit', handleFormPost);

  $('#bookcase').on('click', handleBookClick);
  $(document).on('showing_pane', handleShowingPane);
  $(document).on('hiding_pane', handleHidingPane);

  neo.BookcasePane = '#bookcase';
  neo.StoryPane = '#story';

  neo.neoRoot = path.join(app.getPath('documents'), 'neo');

  syncBookcase();

  showNextPane();
});
