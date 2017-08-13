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
  var hiding = $('nui-stage>nui-pane.active');
  if (hiding.length) {
    document.dispatchEvent(new CustomEvent('hiding_pane', {detail: {pane: hiding[0]}}));

    $('nui-stage>nui-pane').removeClass('active');
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
  var cover = $(e.target).closest('nui-cover');
  if (cover.length) {
    var story = cover[0].story;

    if (story) {
      neo.CurrentStory = story.isTemplate ? story.newStory() : story;
    }
  }
}

function syncBookcase() {
  neo.Bookcase.Shelves.forEach(shelf => {
    var shelf_div = $('nui-shelves').find('nui-shelf[shelfname="' + shelf.name + '"]');
    if (!shelf_div.length) {
      shelf_div = document.createElement('nui-shelf');
      shelf_div.shelfname = shelf.name;

      $('nui-shelves').append(shelf_div);
    } else {
      shelf_div = shelf_div[0];
    }

    shelf.stories.forEach(story => {
      var story_div = $(shelf_div).find('nui-cover[guid="' + story.metadata.guid + '"]');
      if (!story_div.length) {
        story_div = document.createElement('nui-cover');
        story_div.story = story;

        $(shelf_div).append(story_div);
      }
    });
  });
}

function initStoryPane() {
  var story = neo.CurrentStory;

  $('#story nui-tabs').empty();
  story.Tabs.forEach(function (tab) {
    $('#story nui-tabs').append('<nui-tab>' + tab.name + '</nui-tab>');
  });

  // !!!LATER!!! get default tab from prefs
  neo.CurrentTab = story.Tabs[0];
}

var bookcaseSyncTimer;

function handleShowingPane(e) {
  switch ($(e.detail.pane).attr('id')) {
    case 'bookcase': {
      //bookcaseSyncTimer = setInterval(syncBookcase, 1000);
    } break;

    case 'story': {
      initStoryPane();
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

function handleOpenStory(e) {
  showPane('story');
}

$(function () {
  // initialize UI event handlers
  $(document).on('submit', handleFormPost);
  $('nui-bookcase').on('click', handleBookClick);
  $('nui-button[name=back]').on('click', e => {
    showPane('bookcase');
  });

  // initialize app event handlers
  $(document).on('showing_pane', handleShowingPane);
  $(document).on('hiding_pane', handleHidingPane);
  $(document).on('open_story', handleOpenStory);

  neo.BookcasePane = '#bookcase';
  neo.StoryPane = '#story';

  neo.neoRoot = path.join(app.getPath('documents'), 'neo');

  syncBookcase();

  showNextPane();
});
