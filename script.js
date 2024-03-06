window.onload = function(){
    
    // let canvas;
    let delay = 100;
    let ctx;
    let larg =   900
    let long =   600
    let BoxSize  = 30
    let snakee
    let applee
    let widthinblock = larg/BoxSize
    let heightinblock = long/BoxSize
    let score ;
    init();


    function  init (){        
        let canvas = document.createElement('canvas');
        canvas.width = larg;
        canvas.height = long;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block"
        canvas.style.backgroundColor = "#ddd"
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        applee = new Apple ([10,10]);
        score = 0;
        refreshCanvas();
    }
  
    function refreshCanvas(){
        
        ctx.fillStyle = "#ff0000";
        snakee.advance()
        if(snakee.checkcollision()){
            // GAME OVER
            gameOver();
            // alert('GAME OVER')
        }else{
            if (snakee.isEatingApple(applee)){
                snakee.ateapple = true;
                score++;
                do{
                    applee.setNewPosition();
                }
                while(applee.IsOnSnake(snakee))
            }
            ctx.clearRect(0,0,larg,long)
            drawScore();
            snakee.draw()
            applee.draw()
            setTimeout(refreshCanvas,delay);
        }
    }
    function gameOver (){

        ctx.save();
        ctx.font = "bold  70px sans-serif";
        ctx.fillStyle = "#000";
        // ctx.textBaseline = "top";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        let centreX = larg / 2;
        let centreY = long / 2 ;
        ctx.strokeText("GAME OVER ", centreX /2 , centreY - 180);
        ctx.fillText("GAME OVER ", centreX /2 , centreY - 180);
        ctx.font = "bold  20px sans-serif";
        ctx.strokeText("APPUYEZ SUR ESPACE POUR REJOUER " , centreX / 2,centreY - 120);
        ctx.fillText("APPUYEZ SUR ESPACE POUR REJOUER " , centreX / 2,centreY - 120);
        ctx.restore();
    }
    function restart (){
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        applee = new Apple ([10,10]);
        score = 0;
        refreshCanvas(); 
    }
    function drawScore(){
        ctx.save();
        ctx.font = "bold  200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        let centreX = larg / 2;
        let centreY = long / 2 ;

        ctx.fillText(score.toString(), centreX , centreY);
        ctx.restore();
    }
    function drawBlock (ctx, position){
        let x  = position[0] * BoxSize
        let y  = position[1] * BoxSize
        ctx.fillRect(x,y,BoxSize,BoxSize)
    }
    function Snake (body, direction){
        this.body  = body ;
        this.direction = direction;
        this.ateapple = false;
        this.draw  = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000"
            
            for (let i = 0; i < this.body.length;i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        }; 
        this.advance = function (){
            let nextpos = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextpos [0] -= 1;
                    break;
                case "right":
                    nextpos [0] += 1;
                    break;
                case "down":
                    nextpos [1] += 1;
                    break;
                case "up":
                    nextpos [1] -= 1;
                    break;
                // default:
                //         throw("invalid direction au choix ")
            }
            this.body.unshift(nextpos);
            if(!this.ateapple)
                this.body.pop()
            else
                this.ateapple = false;
        };
        // ===================================
        this.setDirection = function (newdirection){
            let direcpermise ;
            switch (this.direction){
                case "left":
                case "right":
                    direcpermise = ["up","down"];
                    break;
                case "up":
                case "down":
                    direcpermise = ["left","right"]
                    break;
                default:
                    throw ("invalid direction");
            }
            if(direcpermise.indexOf(newdirection) > -1){
                this.direction = newdirection;
            }
        };
        this.checkcollision = function (){
            let wallcollision = false;
            let snakecollision = false
            let head = this.body[0];
            let rest = this.body.slice(1);
            let snakeX = head[0];
            let snakeY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthinblock - 1;
            let maxY = heightinblock - 1;
            let NotinHW  = snakeX < minX || snakeX > maxX;
            let NotinVW  = snakeY < minX || snakeY > maxX;

            if (NotinHW || NotinVW){
                wallcollision = true;
            }
            for (let i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0]  && snakeY === rest[i][1]){
                    snakecollision = true;
                }
            }
            return wallcollision || snakecollision;
        };
        this.isEatingApple = function (appletoEat){
            let head = this.body[0];
            if(head[0] === appletoEat.position[0] && head[1] === appletoEat.position[1])
                return true
            return false ;
            
        }
    }

    function Apple (position){
        this.position = position;
        this.draw = function (){
            ctx.save();
            ctx.fillStyle  = "#33cc33";
            ctx.beginPath();
            let radius = BoxSize/2;
            let x = this.position   [0] * BoxSize + radius;
            let y = this.position   [1] * BoxSize + radius;
            // ctx.fillRect(x,y,BoxSize,BoxSize);
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition  = function (){
            let newX = Math.round(Math.random() * (widthinblock - 1))
            let newY = Math.round(Math.random() * (heightinblock - 1))
            this.position = [newX,newY]
        };
        this.IsOnSnake = function (snakecheck){
            let IsOnSnake = false;
            for(let i = 0;  i < snakecheck.body.length; i++){
                if(this.position[0] === snakecheck.body[i][0]  || this.position[1] === snakecheck.body[i][1]){
                    IsOnSnake = true;
                }
            }
            return IsOnSnake;
        }
    }

    document.onkeydown = function handleKeyDown(e){
        let key = e.keyCode;
        let newdirection;
        switch (key){
            case 37: 
                newdirection = "left"
                break;
            case 38:
                newdirection = "up"
                break;
            case 39: 
                newdirection = "right"
                break;
            case 40: 
                newdirection = "down"
                break;
            case 32 : 
                restart ();
                return ;
            default :
                 return ;
        }
        snakee.setDirection(newdirection);
    }
}