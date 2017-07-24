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

  // !!!LATER!!! just for demo
  $('#story .author_name').text(neo.CurrentAuthor.fullName);

  // Thanks to Buzzfeed:
  // https://www.buzzfeed.com/sarahgalo/it-was-a-queer-sultry-summer?utm_term=.tm2yKX808#.tb8jzxrnr
  var first_line = first_lines[Math.floor(Math.random() * first_lines.length)];
  $('#story .chapter p.placeholder').html(first_line.line + '<br/>&nbsp;&nbsp;&mdash;' + first_line.attribution);

  showPane('story');

  // !!!LATER!!! just for demo
  selectElement($('h1.title')[0]);
}

function handleStoryKeypress(e) {
  var focus_element = $(window.getSelection().anchorNode).closest('*');

  if (e.keyCode == 13) {
    if ($(focus_element).hasClass('replace')) {
      $(focus_element).removeClass('replace');

      var reps = $('#story .replace');
      if (reps.length) {
        selectElement(reps[0]);
        e.preventDefault();
      }
    } else if (e.ctrlKey) {
      var chapter = $(focus_element).closest('.chapter');
      $(chapter).after('<div class="chapter"><p>&nbsp;</p></div>');
      selectionToEnd($(chapter).next('.chapter').find('p')[0]);

      e.preventDefault();
    }
  } else {
    if ($(focus_element).hasClass('placeholder')) {
      $(focus_element).removeClass('placeholder');
    }
  }
}

function selectElement(el) {
  var range = document.createRange();
  range.selectNodeContents(el);

  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function selectionToEnd(el) {
  var range = document.createRange();
  range.setStart(el, $(el).text().length);

  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

$(function () {
  $(document).on('submit', handleFormPost);
  $('.new_story').on('click', handleNewStory)

  $('#story').on('keypress', handleStoryKeypress);

  neo.StoryPane = '#story';

  neo.neoRoot = path.join(app.getPath('documents'), 'neo');

  showNextPane();
});
