
var module = (function() {
      // initializes player objects
      var playerX = {
          name: "",
          mark : 'X',
          score: 0 //games won
      };
      var playerO = {
          name: "",
          mark : 'O',
          score: 0 // games won
      };

      var tieScore = 0;   // number of tie games
      var currentPlayer;  // initializes variable
      var win = false;

      // div to display identity of next player
      var nextPlayer = $('<div id="turn"></div>');

      // button objects
      var resetButton = $('<input/>').attr({type: "reset", name: "resetGame", value: "Reset Game", id: "resetGame", class: "button"});
      var resultsButton = $('<input/>').attr({type: "button", name: "display", value: "Show/Hide score", id: "display", class: "button"});

      // asks users to input 2 different names, stores names in player objects
      function getUserInfo() {
        // $('.game').append('<div class="form"><div class="group"><input class="enterName name1" type="text" placeholder="Player X" required><span class="highlight"></span><span class="bar"></span><label class="pointer">Enter Name</label></div><div class="group"><input class="enterName name2"type="text" placeholder="Player O" required><span class="highlight"></span><span class="bar"></span><label class="pointer">Enter Name</label></div><input class="submitNames button" type="submit" name="submitNames"value="Start Game"></div>')
        //
        // playerX.name === $('.name1').val();
        // playerO.name ===$('.name2').val();
        // console.log(playerO.name);
        // console.log(playerX.name);

        while (playerX.name === "") {
          playerX.name = prompt("Enter Player X's Name: ");
        }
        while (playerO.name === "") {
          playerO.name = prompt("Enter Player O's Name: ");
        }
        // makes sure the users have different names
        while (playerX.name == playerO.name) {
          playerO.name = prompt("Player X and Player O must have different names.\nEnter Player O's Name: ");
        }
      }

      // selects first player randomly
      function getFirstPlayer() {
          currentPlayer = Math.random() < 0.5 ? playerX :  playerO;
          $('#turn').html("<p>" + currentPlayer.name + "'s Turn</p>");
      }

      // creates a 3x3 gameboard
      function generateGameBoard() {
          for (var i = 0; i < 9; i++) {
            $('.board').append('<div class="grid" id="'+ i +'"></div>');
          }
          $('h1').after(nextPlayer); // adds box identifying next player
      }

      // starts game
      function initGame() {
          //  start game button
          $('p').remove();
          $('#startGame').remove();
          // makes sure users exist
          if (playerX.name == "") {
            getUserInfo();
          }
          // creates gameboard
          if ($('.grid').length == 0) {
            generateGameBoard();
          }
          //add button to gameboard
          $('.board').after(resetButton);
          //randomly generate first player
          getFirstPlayer();
      }

      //switches the user for each turn
      function switchUser() {
          if (currentPlayer == playerX) {
            currentPlayer = playerO;
          }
          else {
            currentPlayer = playerX;
          }
          $('#turn').html("<p>" + currentPlayer.name + "'s Turn</p>"); // displays the next player's name
        }

      // add user symbol if square has not already been selected
      var selectSquare = function() {
          if ($(this).html() !== "") {
            alert("Select another square");
          }
          else if (win == true) {
            alert("There are no more moves."); // prevents additional moves after win
          }
          else {
            $(this).append(currentPlayer.mark);
            switchUser();
            checkGameState($(this));
          }
      }

      // function to select squares by id
      function box(id) {
          return $('#' + id).html();
      }

      // function to determine if squares match
      function checkWin(box1, box2, box3) {
          if (box1 == box2 && box2 == box3) {
            return (box1 == 'X' || box1 == 'O');
          }
          else {
            return false;
          }
      }

      // checks for Tie
      function checkTie() {
          var boxes = document.getElementsByClassName('grid');
          for (var i = 0; i < boxes.length; i++) {
            if (boxes[i].innerHTML === '') {
              return false;
            }
          }
          return true;
      }

      // records players win in their score, alerts user of win
      function winner() {
          currentPlayer.score += 1;
          // alert(currentPlayer.name + ' wins!');
          $('#turn').html("<p id='youWin'>" + currentPlayer.name + " wins!</p>");
          $('#resetGame').after(resultsButton); // adds button
          displayResults();
          nextRound();
          win = true;
      }

      function checkGameState(e) {
        // check to see if a square has been selected
          if (e.html() !== "") {
            // check rows for win
            if (checkWin(box(0), box(1), box(2))) {
              $('#0, #1, #2').addClass('win');
              winner();
            }
            else if (checkWin(box(3), box(4), box(5))) {
              $('#3, #4, #5').addClass('win');
              winner();
            }
            else if (checkWin(box(6), box(7), box(8))) {
              $('#6, #7, #8').addClass('win');
              winner();
            }
            // check columns for win
            else if (checkWin(box(0), box(3), box(6))) {
              $('#0, #3, #6').addClass('win');
              winner();
            }
            else if (checkWin(box(1), box(4), box(7))) {
              $('#1, #4, #7').addClass('win');
              winner();
            }
            else if (checkWin(box(2), box(5), box(8))) {
              $('#2, #5, #8').addClass('win');
              winner();
            }
            // check diagonals for win
            else if (checkWin(box(0), box(4), box(8))) {
              $('#0, #4, #8').addClass('win');
              winner();
            }
            else if (checkWin(box(2), box(4), box(6))) {
              $('#2, #4, #6').addClass('win');
              winner();
            }
            else if (checkTie() == true) {
                tieScore += 1;
                displayResults();
                alert('Tie');
                $('#resetGame').after(resultsButton); // adds button
                nextRound();
            }
          }
      }

      //generate score table
      function displayResults() {
          if ($('.results').has('.results-bar')) {
            $('.results .results-bar').remove();
          }
          $('.results').append('<div class="results-bar"><div class="item">'+ playerX.name + '<span class="counter">'+ playerX.score + '</span></div><div class="item">Ties<span class="counter">'+ tieScore + '</span></div><div class="item">'+ playerO.name + '<span class="counter">'+ playerO.score + '</span></div></div>');
          $('.results').css('background-color', '#f4f5f7').show(250);
          }

      // clears game board and continues the game
      var nextRound = function() {
          // button to play again
          $('.game').append('<div class="next"><h2>Click Here to Play Next Round</h2></div>');
          //reset gameboard
          $('.next').on('click', function(){
              $('.grid').empty();
              $('.next').remove();
              $('.grid').removeClass('win');
              $('#turn').html("<p>" + currentPlayer.name + "'s Turn</p>"); // displays the next player's name
              win = false;
          })
      }


      // returns to welcome screen and removes previous player info
      var resetGame = function() {
          //re-create startButton
          var startButton = $('<input/>').attr({type: "button", name: "startGame", value: "Play!", id: "startGame", class: "button"});
          startButton.on('click', function(){
            initGame();
          });

          $('.grid').html("");
          $('#display').remove();
          $('#resetGame').remove();
          $("#turn").remove();
          $('.results-bar').remove();
          $('.results').css('background-color', 'transparent')
          $('.next').remove();
          playerX.name = "";
          playerX.score = 0;

          playerO.name = "";
          playerO.score = 0;

          $('.board').empty();
          win = false;

          //add start button
          $('h1').after(startButton);
        }

      // Event adds player symbol to clicked square. Checks to see if game is over.
      $(document).on('touchstart click', '.grid',selectSquare);
      //This resets table
      $(document).on('click', '#resetGame', resetGame);
      // reveals box with players' scores
      $(document).on('click', '#display', function(){
        $('.results').slideToggle(250);
      });
      // makes function public
      return {
        initGame : initGame,
      };
})();
