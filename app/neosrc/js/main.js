const path = require('path');
const fs = require('fs-extra');

const electron = require('electron');
const remote = electron.remote;
const app = remote.app;

const $ = require('jquery');

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

function handleCoverButtonClick(e) {
  switch (e.detail.buttonName) {
    case 'delete': {
      var shelf = $(e.target).closest('nui-shelf')[0];
      var story = e.target.story;

      var i = story.metadata.keywords.indexOf(shelf.shelf.name);
      if (i < 0) {
        return;
      }

      if (story.metadata.keywords.length <= 1) {
        // !!!LATER!!! confirm and delete document
      }
      story.metadata.keywords.splice(i, 1);
      story.write();

      syncBookcase();
    } break;
  }
}

function handleTabClick(e) {
  neo.CurrentTab = e.detail.tab;
}

function syncBookcase() {
  document.querySelectorAll('nui-shelf').forEach(shelf => shelf.setAttribute('data-stale', true));
  document.querySelectorAll('nui-cover').forEach(cover => cover.setAttribute('data-stale', true));

  neo.Bookcase.Shelves.forEach(shelf => {
    var shelf_div = $('nui-shelves').find('nui-shelf[shelfname="' + shelf.name + '"]');
    if (!shelf_div.length) {
      shelf_div = document.createElement('nui-shelf');
      shelf_div.shelf = shelf;

      $('nui-shelves').append(shelf_div);
    } else {
      shelf_div = shelf_div[0];
      shelf_div.setAttribute('data-stale', false);
    }

    shelf.stories.forEach(story => {
      var story_div = $(shelf_div).find('nui-cover[guid="' + story.metadata.guid + '"]');
      if (!story_div.length) {
        story_div = document.createElement('nui-cover');
        story_div.story = story;

        $(shelf_div).append(story_div);
      } else {
        story_div = story_div[0];
        story_div.setAttribute('data-stale', false);
      }
    });

    document.querySelectorAll('*[data-stale=true]').forEach(node => node.remove());
  });

  document.querySelectorAll('*')
}

function previewStoryControls() {
  $('.story_nav').addClass('hovered');
  $('nui-tabs').removeClass('collapsed');

  setTimeout(e => {
    $('.story_nav').removeClass('hovered');
    $('nui-tabs').addClass('collapsed');
  }, 1000);
}

function initStoryPane() {
  var story = neo.CurrentStory;

  $('#story nui-tabs').empty();
  story.Tabs.forEach(tab => {
    $('#story nui-tabs').append('<nui-tab>' + tab.name + '</nui-tab>');
  });

  // !!!LATER!!! get default tab from prefs
  neo.CurrentTab = story.Tabs[0];

  previewStoryControls();
}

var bookcaseSyncTimer;

function handleShowingPane(e) {
  switch ($(e.detail.pane).attr('id')) {
    case 'bookcase': {
      bookcaseSyncTimer = setInterval(syncBookcase, 1000);
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

function handleOpenTab(e) {
  var tab = e.detail.tab;

  $('nui-tab').removeClass('active');
  if (tab) {
    $('nui-tab:contains("' + tab.name + '")').addClass('active');
  }
}

$(() => {
  $('#tab_trigger').height($('nui-tabs').height());

  // initialize UI event handlers
  $(document).on('submit', handleFormPost);
  $('nui-bookcase').on('click', handleBookClick);
  $('nui-bookcase').on('nui-button-click', handleCoverButtonClick);
  $('nui-button[name=back]').on('nui-button-click', e => {
    showPane('bookcase');
  });
  $('nui-tabs').on('nui-tab-click', handleTabClick);

  // initialize app event handlers
  $(document).on('showing_pane', handleShowingPane);
  $(document).on('hiding_pane', handleHidingPane);
  $(document).on('open_story', handleOpenStory);
  $(document).on('open_tab', handleOpenTab);
  $('#tab_trigger').on('mouseenter', e => $('nui-tabs').removeClass('collapsed'));
  $('#tab_trigger').on('mouseleave', e => $('nui-tabs').addClass('collapsed'));

  neo.BookcasePane = '#bookcase';
  neo.StoryPane = '#story';

  neo.neoRoot = path.join(app.getPath('documents'), 'neo');

  syncBookcase();

  showNextPane();
});
