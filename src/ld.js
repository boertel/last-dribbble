var STORAGE_KEY = 'last' + getId();
var SELECTOR = 'ol.dribbbles > li';
var COLOR = '#EC4989';
var DOTIFIED = 'dotified';


function getId() {
  var pathname = location.pathname;
  if (pathname === '/shots') {
    return pathname + location.search;
  }
  return pathname;
}

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

function addDot($node) {
  var radius = 10;
  var $dot = $('<a />').addClass(DOTIFIED)
    .css({
    backgroundColor: COLOR,
    width: radius,
    height: radius,
    borderRadius: radius,
    display: 'inline-block',
    marginLeft: 6,
    verticalAlign: 'top',
  });

  $node.find('.extras').prepend($dot)
}

function dotify(lastId) {
  var $dribbbles = $(SELECTOR + '#' + lastId).prevAll();
  if ($dribbbles.length === 0 && (lastId && $('#' + lastId).length === 0)) {
    $dribbbles = $(SELECTOR);
  }
  $dribbbles.each(function() {
    if ($(this).find('.' + DOTIFIED).length === 0) {
      addDot($(this));
    }
  });
}


localStorage.removeItem('last/boertel')
var lastId = localStorage.getItem(STORAGE_KEY);

if (lastId) {
  dotify(lastId)
} else {
  dotify();
}

var firstId = $(SELECTOR).first().attr('id');
localStorage.setItem(STORAGE_KEY, firstId);


// Add dot with the last dribbble saw if after the first page
// need to go through postMessage, since we don't have access to
// webpage variables `Dribbble` in our case
window.addEventListener('message', function(evt) {
  if (evt.data.message === 'onAfterAppend') {
    dotify(lastId)
  }
})

injectJS();

var style = $('<style>.dribbble-over, .hover-card-parent { display: none; }</style>');
$('html > head').append(style);
