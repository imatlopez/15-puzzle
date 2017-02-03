/*
 * Citrus v1.0.0 (http://marvis.imatlopez.com/)
 * Copyright 2017 Matias Lopez
 * Licensed under MIT (https://www.github.com/imatlopez/15-puzzle/blob/master/LICENSE)
 */

+function ($) {

'use strict';

var grid2num = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
var num2grid = [[3, 3], [0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [3, 2], [3, 3]];

var refresh = function refresh() {
  $('.piece').each(function (i, e) {
    var n = parseInt($(e).attr('data-number'), 10);
    $(e).attr('data-x', num2grid[n][0]);
    $(e).attr('data-y', num2grid[n][1]);
  });
};

var shift = function shift(n) {
  var fx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var fy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;


  var dx = [1, -1, 0, 0];
  var dy = [0, 0, 1, -1];

  var nLoc = num2grid[n];
  var hasChanged = false;

  var flip = function flip(x, y, dx, dy) {
    grid2num[x][y] = 0;
    grid2num[x + dx][y + dy] = n;
    num2grid[n] = num2grid[0];
    num2grid[0] = nLoc;
    return true;
  };

  for (var i = 0; i < 4; i++) {
    var isValid = (fx === undefined || dx[i] === -fx) && (fy === undefined || dy[i] === -fy);
    if (isValid && nLoc[0] + dx[i] < 4 && nLoc[0] + dx[i] >= 0 && nLoc[1] + dy[i] < 4 && nLoc[1] + dy[i] >= 0) {
      if (grid2num[nLoc[0] + dx[i]][nLoc[1] + dy[i]] === 0) {
        hasChanged = flip(nLoc[0], nLoc[1], dx[i], dy[i]);
        break;
      } else {
        var nfx = fx === undefined ? -dx[i] : fx;
        var nfy = fy === undefined ? -dy[i] : fy;
        if (isValid && shift(grid2num[nLoc[0] + dx[i]][nLoc[1] + dy[i]], nfx, nfy)) {
          hasChanged = flip(nLoc[0], nLoc[1], dx[i], dy[i]);
          break;
        }
      }
    }
  }

  if (hasChanged) {
    refresh();
    if (hasWon()) {
      window.setTimeout(function () {
        $('h2 span').html('home');
        if (!$('#woohoo').hasClass('active')) {
          $('#woohoo').addClass('active');
        }
      }, 500);
    }
    return true;
  }
  return false;
};

var hasWon = function hasWon() {
  // Is 0 in a corner?
  if (num2grid[0][0] < 3 || num2grid[0][1] < 3) {
    return false;
  }
  // Horizontal Check
  var old = 0;
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      if (x < 3 || y < 3) {
        if (grid2num[x][y] === old + 1) {
          old++;
        } else {
          return false;
        }
      }
    }
  }
  return true;
};

var resetBoard = function resetBoard() {
  var getRandomInt = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  for (var x = 0; x < 4; x++) {
    for (var y = 0; y < 4; y++) {
      grid2num[x][y] = -1;
    }
  }

  for (var i = 0; i < 16; i++) {
    var _x3 = getRandomInt(0, 4);
    var _y = getRandomInt(0, 4);

    if (grid2num[_x3][_y] < 0) {
      grid2num[_x3][_y] = i;
      num2grid[i][0] = _x3;
      num2grid[i][1] = _y;
    } else {
      i--;
    }
  }

  console.log('Reset board!');
  refresh();

  $('h2 span').html('not home');
  if ($('#woohoo').hasClass('active')) {
    $('#woohoo').removeClass('active');
  }
};

resetBoard();
$('#retry').click(function () {
  return resetBoard();
});

$('#skip').click(function () {
  console.log('Skip board!');
  var i = 1;
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      var j = i === 15 ? 0 : i === 16 ? 15 : i;
      i++;
      grid2num[x][y] = j;
      num2grid[j][0] = x;
      num2grid[j][1] = y;
    }
  }
  refresh();

  $('h2 span').html('not home');
  if ($('#woohoo').hasClass('active')) {
    $('#woohoo').removeClass('active');
  }
});

$('.piece').each(function (i, e) {
  $(e).click(function () {
    return shift(parseInt($(e).attr('data-number'), 10));
  });
});

}(jQuery);
