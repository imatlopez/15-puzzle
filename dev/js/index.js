const grid2num = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
const num2grid = [[3, 3], [0, 0], [0, 1], [0, 2], [0, 3],
                  [1, 0], [1, 1], [1, 2], [1, 3],
                  [2, 0], [2, 1], [2, 2], [2, 3],
                  [3, 0], [3, 1], [3, 2], [3, 3]];

const shift = (n) => {
  const dx = [1, -1, 0,  0];
  const dy = [0,  0, 1, -1];

  const nLoc = num2grid[n];
  let hasChanged = false;

  for (let i = 0; i < 4; i++) {
    if (nLoc[0] + dx[i] < 4 && nLoc[0] + dx[i] >= 0 && nLoc[1] + dy[i] < 4 && nLoc[1] + dy[i] >= 0) {
      if (grid2num[nLoc[0] + dx[i]][nLoc[1] + dy[i]] === 0) {
        grid2num[nLoc[0]][nLoc[1]] = 0;
        grid2num[nLoc[0] + dx[i]][nLoc[1] + dy[i]] = n;
        num2grid[n] = num2grid[0];
        num2grid[0] = nLoc;
        hasChanged = true;
        break;
      }
    }
  }

  if (hasChanged) {
    $('.piece').each((i, e) => {
      if (parseInt($(e).attr('data-number'), 10) === n) {
        $(e).attr('data-x', num2grid[n][0]);
        $(e).attr('data-y', num2grid[n][1]);
      }
    });
    if (hasWon()) {
      $('h2 span').html('home');
      if (!$('#woohoo').hasClass('active')) {
        $('#woohoo').addClass('active');
      }
    }
  }

};

const hasWon = () => {
  // Is 0 in a corner?
  if (num2grid[0][0] < 3 || num2grid[0][1] < 3) {
    return false;
  }
  // Horizontal Check
  let old = 0;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      console.log(`${grid2num[x][y]}, ${old + 1}`);
      if (x !== 3 && y !== 3) {
        if (grid2num[x][y] === (old + 1)) {
          old++;
        } else {
          return false;
        }
      }
    }
  }
  return true;
};

const resetBoard = () => {
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      grid2num[x][y] = -1;
    }
  }

  for (let i = 0; i < 16; i++) {
    const x = getRandomInt(0, 4);
    const y = getRandomInt(0, 4);

    if (grid2num[x][y] < 0) {
      grid2num[x][y] = i;
      num2grid[i][0] = x;
      num2grid[i][1] = y;
    } else {
      i--;
    }

  }

  console.log('Reset board!');

  $('.piece').each((i, e) => {
    const  n = parseInt($(e).attr('data-number'), 10);
    $(e).attr('data-x', num2grid[n][0]);
    $(e).attr('data-y', num2grid[n][1]);
  });

  $('h2 span').html('not home');
  if ($('#woohoo').hasClass('active')) {
    $('#woohoo').removeClass('active');
  }
};

resetBoard();
$('#retry').click(() => resetBoard());

$('.piece').each((i, e) => {
  $(e).click(() => shift(parseInt($(e).attr('data-number'), 10)));
});
