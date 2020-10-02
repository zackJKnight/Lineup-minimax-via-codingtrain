let periodCount = 3;
let Positions = ["F", "M", "G", "B"];
let game = [
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
];
let Players;
let h;
let w;
let ai1;
let ai2;
let currentPlayer;
let completeScore;
let evaluationPlayer;
let r;
let g;
let b;
function assignRandomPrefs() {
  temp = shuffle(Positions);
  temp.splice(temp.indexOf("B"), 1);
  temp.push("B");
  return temp;
}

function setup() {
  createCanvas(400, 400);
  Players = [
    {
      name: "a",
      pref: [],
    },
    {
      name: "b",
      pref: [],
    },
    {
      name: "c",
      pref: [],
    },
    {
      name: "d",
      pref: [],
    },
  ];

  for (let player of Players) {
    player.pref = this.assignRandomPrefs();
  }

  w = width / periodCount;
  h = height / Positions.length;
  ai1 = "ai1";
  ai2 = "ai2";
  currentPlayer = ai1;
  bestFill();
  while (checkCompletion(game) === null) {
    bestFill();
  }
}

function draw() {
  background(220);

  strokeWeight(4);

  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(w * 3, 0, w * 3, height);

  line(0, h * 2, width, h * 2);
  line(0, h, width, h);
  line(0, h * 3, width, h * 3);
  line(0, h * 4, width, h * 4);
  let result;
  for (let i = 0; i < periodCount; i++) {
    for (let j = 0; j < Positions.length; j++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      if (game[i][j].name !== undefined) {
        r = random(155);
        g = random(155);
        b = random(155);
        fill(r, g, b);
        text(game[i][j].name, x, y);
      }
    }
  }
  result = checkCompletion(game);
  if (result != null) {
    noLoop();
  }
}

function bestFill() {
  let bestScore = -Infinity;
  let placement = -1;
  let evaluationPeriod;
  for (let i = 0; i < periodCount; i++) {
    if (game[i].every((spot) => spot === "")) {
      evaluationPeriod = shuffle(Players);
      game[i] = evaluationPeriod;
      score = this.minimax(game, 0, false, -Infinity, Infinity);
      game[i] = createBlankPeriod();
      if (score > bestScore) {
        bestScore = score;
        placement = i;
      }
    }
  }

  if (placement > -1 && evaluationPeriod !== undefined) {
    game[placement] = evaluationPeriod;
    currentPlayer = currentPlayer === ai1 ? ai2 : ai1;
  }
}

function minimax(game, depth, isMaximizing, alpha, beta) {
  let result = checkCompletion(game);

  if (result != null) {
    return scores[result];
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < periodCount; i++) {
      currentPlayer = ai1;
      if (game[i].every((spot) => spot === "")) {
        let evaluationPeriod = shuffle(Players);
        game[i] = evaluationPeriod;
        score = this.minimax(game, depth + 1, false, alpha, beta);
        game[i] = createBlankPeriod();
        bestScore = max(score, bestScore);
        if (alpha !== undefined) {
          alpha = max(bestScore, alpha);
          if (alpha >= beta) {
            break;
          }
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < periodCount; i++) {
      if (game[i].every((spot) => spot === "")) {
        let evaluationPeriod = shuffle(Players);
        game[i] = evaluationPeriod;
        currentPlayer = ai2;

        score = this.minimax(game, depth + 1, true, alpha, beta);
        game[i] = createBlankPeriod();
        bestScore = max(score, bestScore);
        if (beta !== undefined) {
          beta = min(bestScore, beta);
          if (alpha >= beta) {
            break;
          }
        }
      }
      return bestScore;
    }
  }
}

function sortByPositionPreference(players) {
  // let sortedPlayers = [];
  // let playersTemp = [];
  // for (let player of players) {
  //   playersTemp.push({ name: player.name, pref: player.pref });
  // }
  // for (let i = 0; i < Positions.length; i++) {
  //   let sortedByPrefForCurrentPosition = playersTemp.sort((a) =>
  //     a.pref.indexOf(Positions[i])
  //   );
  //   bestFits = Math.max.apply(
  //     Math,
  //     sortedByPrefForCurrentPosition.map(
  //       (a) => Positions.length - a.pref.indexOf(a.pref[i])
  //     )
  //   );
  //   if (bestFits.length > 0) {
  //     sortedPlayers.push(random(bestFits));
  //   } else {
  //     for (let player of sortedPlayers) {
  //       let playerCount = 0;
  //       for (let j = 0; j < Positions.length; j++) {
  //         if (
  //           sortedPlayers[j] !== "" &&
  //           sortedPlayers[j].name === player.name
  //         ) {
  //           playerCount++;
  //           if (playerCount > 1) {
  //             sortedPlayers.splice(j, 1);
  //             i--;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  // return Players;
}

function createBlankPeriod() {
  let emptyPeriod = [];
  for (let i = 0; i < Players.length; i++) {
    emptyPeriod.push("");
  }
  return emptyPeriod;
}

function getPlacedPlayers(game) {
  let placedPlayers = [];
  for (let i = 0; i < periodCount; i++) {
    for (let j = 0; j < Positions.length; j++) {
      if (game[i][j] !== "") {
        placedPlayers.push(game[i][j].name);
      }
    }
  }
  return placedPlayers.length > 0 ? placedPlayers : null;
}

function checkCompletion(game) {
  let result = null;

  if (!allPlayersPlaced()) {
    return result;
  }

  let playerScores = [];
  for (let player of Players) {
    let playerScore = 0;
    for (let i = 0; i < periodCount; i++) {
      for (let j = 0; j < Positions.length; j++) {
        if (game[i][j] !== "" && game[i][j].name === player.name) {
          playerScore += Positions.length - player.pref.indexOf(Positions[j]);
        }
      }
      playerScores.push(playerScore);
    }
    if (!scoresAreBalanced(playerScores)) {
      return result;
    }
  }

  return currentPlayer;
}

let scores = {
  ai1: 10,
  ai2: -10,
  tie: 0,
};

function scoresAreBalanced(scores) {
  // TODO ensure preference scores are balanced
  // what's a legitimate high score? what is a fair distribution of scores given that preferences may cause competition for placement?
  // how many available favorite, second favorite, and so on positions for each player per game?
  // for players with the same favorite - divide the total number of that position amongst them. floor or round? what to do with the remainder?
  //

  let perfectGameScore = periodCount * sumRank(Positions);
// scores as a percent of perfect
// high scoew
// low score
// largest difference.... is high... how many more times can they get a favorite placing before it's imbalanced?
  let playerFavoritePositions = [];
  for (let position of Positions) {
    let playersWhoFavorCurrentPosition = [];
    for (let player of Players) {
    if(player.pref[0] === position) {
      playersWhoFavorCurrentPosition.push(player);
    }
    }
    playerFavoritePositions.push(playersWhoFavorCurrentPosition);
  }

  let playerSecondPositions = [];
  for (let position of Positions) {
    let playersWhoFavorCurrentPosition = [];
    for (let player of Players) {
    if(player.pref[1] === position) {
      playersWhoFavorCurrentPosition.push(player);
    }
    }
    playerSecondPositions.push(playersWhoFavorCurrentPosition);
  }

  return true;
}

function benchDistributionExceeded(player) {
  

  let placedBenches = [];

  for (let i = 0; i < periodCount; i++) {
    placedBenches.push(game[i][Positions.length - 1]);
}

let counts = {};

for (let i = 0; i < placedBenches.length; i++) {
  let num = placedBenches[i];
  counts[num] = counts[num] ? counts[num] + 1 : 1;
}

let minBenchesPerPlayer = getMinBenchesPerPlayer();
  
// loopp through counts and do what you need to do.

  const playerNotBeenMinBenchedCount = Players.length - minBenchedPlayers.length;
  if (!playerNotBeenMinBenchedCount || playerNotBeenMinBenchedCount === 0) {
    // do whatever you need to do 
  }

  const playerGetsExtraBenchCount = (benchPositions.length -
    (Math.floor(benchPositions.length / this.availablePlayerCount) * this.availablePlayerCount));

  const maxBenchedPlayers = this.sort_desc_unique_players(placedPlayers
    .filter(player => player.benchIds.length >= (minBenchesPerPlayer + 1)));

  if (maxBenchedPlayers.length < playerGetsExtraBenchCount) {
    return maxBenchedPlayers.filter(player => player.id === currentPlayer.id).length > 0;
  }
}

function getMinBenchesPerPlayer() {
  return Math.floor(
    ((Players.length - (Players.length - 1)) * periodCount) / Players.length
  );
}

function sumRank(arr){
  let sum = 0;
  for (let i = 0; i < arr.length; i ++){
sum = sum + i + 1;

  }
  return sum;
}

function allPlayersPlaced() {
  // each player is in one position in each period
  let result = false;
  let allPositionCount = Positions.length * periodCount;
  let filledPositionCount = 0;
  for (let i = 0; i < periodCount; i++) {
    for (let j = 0; j < Positions.length; j++) {
      if (game[i][j].pref !== undefined) {
        filledPositionCount++;
      } else {
        return result;
      }
    }
  }

  return filledPositionCount === allPositionCount;
}
