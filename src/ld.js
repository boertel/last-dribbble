var STORAGE_KEY = 'last' + location.pathname;

function markOldDribbbles() {
  $('ol.dribbbles li#' + lastId).nextAll().find('div.dribbble').css('background-color', '#eee');
  $('#' + lastId).find('div.dribbble').css('background-color', '#eee');
}


var lastId = localStorage.getItem(STORAGE_KEY);

if (lastId) {
  markOldDribbbles()
}

var dribbbles = $('ol.dribbbles li');
var firstId = dribbbles.first().attr('id');

localStorage.setItem(STORAGE_KEY, firstId);

$(document).on('mouseover', 'ol.dribbbles li', function() { $(this).find('div.dribbble').css('background-color', '#fff'); })
           .on('mouseout', 'ol.dribbbles li', function() { $(this).find('div.dribbble').css('background-color', '#eee'); });


function monkeyPatch() {
  var monkeyPatchOnAfterAppend = window.Dribbble.Screenshots.infiniteScroller.onAfterAppend
  window.Dribbble.Screenshots.infiniteScroller.onAfterAppend = function(evt) {
    monkeyPatchOnAfterAppend.call(window.Dribbble.Screenshots.infiniteScroller, evt);
    window.postMessage({message: 'onAfterAppend'}, '*')
  }
}

function injectJS() {
  var script = document.createElement('script');
  script.appendChild(document.createTextNode('('+ monkeyPatch +')();'));
  (document.body || document.head || document.documentElement).appendChild(script);
}

window.addEventListener("message", function(evt) {
  if (evt.data.message === 'onAfterAppend') {
    markOldDribbbles();
  }
})

injectJS();
