var STORAGE_KEY = 'last' + getId();
var SELECTOR = 'ol.dribbbles > li';


function getId() {
  var pathname = location.pathname;
  if (pathname === '/shots') {
    return pathname + location.search;
  }
  return pathname;
}

var lastId = localStorage.getItem(STORAGE_KEY);

var alreadySeen = [
    SELECTOR + '#' + lastId + ' ~ li',
    SELECTOR + '#' + lastId
];

rules = [
    '.dribbble-over, span.hover-card-parent { display: none; }',
    alreadySeen.join(',') + ' { opacity: 0.5; }',
    alreadySeen.map((selector) => selector + ':hover').join(',') + ' { opacity: 1; }',
];

var firstId = $(SELECTOR).first().attr('id')
localStorage.setItem(STORAGE_KEY, firstId);

var style = $('<style>' + rules.join(' ') + '</style>');
$('html > head').append(style);
