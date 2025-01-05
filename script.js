function GameBoard(rows = 3 , columns =3 , winLine = 3){

  let board=[];

  const initializeBoard = ()=>
  {
    board = [];
    for (let i =0 ; i<rows ; i++)
    {
      board[i]=[];
      for (let j =0;j<columns;j++)
      {
        board[i].push(Cell());
      }
    }
  }
  initializeBoard();

  const isValid = (row,column)=>{
    if(board[row][column].getValue() == ""){return true;}
    return false;
  }
  
  const getBoard = () => board;
  const drawToken = (row,column,player) =>{
    if(!isValid(row,column))
    {
      return 0;
    }

    board[row][column].putToken(player);
    return 1;
  }

  const printBoard = () =>{
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
  }
  return{
    getBoard,
    drawToken,
    printBoard,
    initializeBoard
  }
}

function Cell(){
  let value = "";
  let color = "white";
  let delta = 0;

  const putToken = (player)=>{
    value = player.token;
    if(value=="O")
    {
      color="#F71735";
      delta =-1;
    }
    else{
      color="#222222";
      delta=1;
    }
  }
  const getValue = ()=>value;
  const getColor = ()=>color;
  const getDelta = ()=>delta;
  return{
    putToken,
    getValue,
    getColor,
    getDelta
  };
}

function GameController(row =3 , column=3 ,winLineSize = 3,playerOneName ="Alice", playerTwoName="Bob"){
  let gameBoard = GameBoard(row,column,winLineSize);
  const players = [
    {
      name:playerOneName,
      token:"X",
      
    },
    {
      name:playerTwoName,
      token:"O"
    }
  ];
  let winLine =[];
  let activePlayer = players[0];
  const initialize = (size) =>{
    gameBoard = GameBoard(size,size);
    activePlayer=players[0];
    return gameBoard;
  }
  const switchPlayerTurn = ()=>{
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const getActivePlayerMessage = () => 
  {
    var message =`${getActivePlayer().name}'s turn.`;
    return message;

  }
  const calCulateWinLine = ()=>{
    let sum =0;
    let winner = 0;
    let board = gameBoard.getBoard();
    for(let i=0;i<row;i++)
    {
      sum =0;
      winLine = [];
      for(let j =0;j<column;j++)
      {
        sum += board[i][j].getDelta();
        winLine.push({row: i, col:j});
      }
      if(sum==row || sum==-1*row)
      {
        if(sum<0){winner=1;}
        return {winLine , winner};
      }

    }
    for(let j=0;j<column;j++)
    {
      sum =0;
      winLine = [];
      for(let i =0;i<row;i++)
      {
        sum += board[i][j].getDelta();
        winLine.push({row: i, col:j});
      }
      if(sum==row || sum==-1*row)
      {
        if(sum<0){winner=1;}
        return {winLine , winner};
      }

    }
    winLine = [];
    sum =0;
    for(let i=0;i<row;i++)
    {
      sum += board[i][i].getDelta();
      winLine.push({row: i, col:i});
    }
    if(sum==row || sum==-1*row)
    {
      if(sum<0){winner=1;}
      return {winLine , winner};
    }
    winLine = [];
    sum =0;
    for(let i=0;i<row;i++)
    {
      sum += board[i][row-i-1].getDelta();
      let temp = row-i-1;
      winLine.push({row: i, col:temp});
    }
    if(sum==row || sum==-1*row)
    {
      if(sum<0){winner=1;}
      return {winLine , winner};
    }
    winLine=[];
    return {winLine ,winner};
  }

    
  
  const printNewRound = () =>{
    gameBoard.printBoard();
    getActivePlayerMessage();
  }
  const getPlayer = (index) =>{
    return players[index].name;
  }

  const playRound = (row,column) =>{
    if(gameBoard.drawToken(row,column,getActivePlayer())){
      switchPlayerTurn();
      printNewRound();
    }
  }
  initialize(row);
  return{
    printNewRound,
    playRound,
    getActivePlayerMessage,
    getActivePlayer,
    getBoard: gameBoard.getBoard,
    initialize,
    calCulateWinLine,
    getPlayer
    
  }
}



function ScreenController(){
  const sizeInput = document.querySelector('.size-num');
  const playerTurnDiv = document.querySelector('.turn');
  const gridDiv = document.querySelector('.board');
  const startBtn = document.querySelector('.submit-btn');
  const resetBtn = document.querySelector('.reset-btn');

  let game = GameController(sizeInput.value,sizeInput.value);
  let board = game.getBoard();

  const updateScreen = (size) =>{
    gridDiv.textContent="";
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = game.getActivePlayerMessage();


    gridDiv.style.gridTemplateColumns = `repeat(${size},1fr)`;
    gridDiv.style.gridTemplateRows = `repeat(${size},1fr)`;
    const gridCellSize = gridDiv.offsetWidth / size; 
    var result;
    result = game.calCulateWinLine();
    for(let i=0;i<size ;i++)
    {
      for(let j=0;j<size;j++)
        {
          const gridCell = document.createElement('div');
          gridCell.classList.add('grid-cell');
          gridCell.textContent = board[i][j].getValue();
          gridCell.style.color = board[i][j].getColor(); 
          gridCell.style.fontSize = `${gridCellSize * 0.3}px`; 
          if (result.winLine.length!=0){
            if (result.winLine.some(cell => cell.row === i && cell.col === j)) {
              gridCell.classList.add('highlight-cell'); 
           } 
           gridCell.classList.add('inactive-cell')
           let winner = game.getPlayer(result.winner);
           playerTurnDiv.textContent = `${winner} wins !` 

          }
          gridCell.addEventListener('click', () => {
            game.playRound(i,j);
            updateScreen(size);
          });
          gridDiv.appendChild(gridCell);
          
        }
      }
      
      
  }

  const resetScreen = () =>{
    let size = sizeInput.value;
    game = GameController(size,size);
    board = game.getBoard();
    updateScreen(size);
  }
  resetBtn.addEventListener("click",resetScreen);

  
  updateScreen(sizeInput.value);


}
ScreenController();