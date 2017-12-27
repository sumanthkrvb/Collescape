function clearArena()
{
	ctx1.clearRect(0, 0, c.width, c.height);
	ctx2.clearRect(0, 0, c.width, c.height);
}
function startGame()
{
	if(!isStarted)
	{
		isStarted=true;
		masterShoot=setInterval(function(){printCircle()},delay);
	}
}

function getMousePos(c, evt) {
        var rect = c.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

function shoot()
{
	fired++;
	if(isStarted && !collision)
	{
		if(attempts > 0)
		{
			document.getElementById("shootSound").play();
			document.getElementById("notification").innerHTML = "<b>Escape from collision with master by changing your position.</b>";
			if(score!=0)
			{
				document.getElementById("scoresList").innerHTML = document.getElementById("scoresList").innerHTML + score+" $" + "<br/>";
				scoreArray[scoreArrayIndex] = score;
			}
			scoreArrayIndex++;
			score=0;
			document.getElementById("attempts").innerHTML = "Shoots Remaining: "+(attempts-1);
			delay=delay/2;
			clearInterval(presentShoot);
			presentShoot = setInterval(function(){printCircle2()},delay);
		}
		else
		{	
			document.getElementById("notification").innerHTML = "<b>Shoot limit is over.</b>";
			writeCanvas(0.3,"Shoot limit is over.");
		}
	}
}

function printCircle()
{
	if(score %15 == 0)
	{
		clearArena();
	}
	if(fired==0)
	{
		deadline = deadline - delay/1000;
		document.getElementById("notification").innerHTML = "Now click anywhere in the window to start your shoot in <b>"+ deadline.toFixed(2) +"</b> seconds";
	}
	if(deadline<=0)
	{
		gameOver("Inception time out! Click ok to play Again. Cancel to exit!!");
	}
	else
	{
		
		ctx1.beginPath();
		ctx1.arc(x1+radius,y1+radius,radius,0,2*Math.PI);
		ctx1.stroke();
		var grd=ctx1.createRadialGradient(x1+radius,y1+radius,radius-5,x1+radius,y1+radius,radius);
		grd.addColorStop(0,"red");
		grd.addColorStop(1,"black");
		ctx1.fillStyle=grd;
		ctx1.fill();
		if(x1>limitx)
		{
			stepx=-jumpx;
		}
		if(y1>limity)
		{
			stepy=-jumpy;
		}
		if(x1<0)
		{ 
			stepx=jumpx;
		}
		if(y1<0)
		{
			stepy=jumpy;
		}

		x1+=stepx;
		y1+=stepy;
	}
}
function printCircle2()
{
	if((score ==  randomDanger || dangerImage) && !danger)
	{
		displayDanger();
	}
	if((score == randomLife || lifeImage) && !life)
	{
		displayLife();
	}

	if((score == randomMoney || moneyImage) && !money)
	{
		displayMoney();
	}
	ctx2.beginPath();
	ctx2.arc(x2+radius,y2+radius,radius,0,2*Math.PI);
	ctx2.stroke();
	var grd=ctx2.createRadialGradient(x2+radius,y2+radius,radius-5,x2+radius,y2+radius,radius);
	grd.addColorStop(0,"blue");
	grd.addColorStop(1,"black");
	ctx2.fillStyle=grd;
	ctx2.fill();
	if(x2>limitx)
	{
		document.getElementById("wallSound").play();
		stepx2=-jumpx2;
	}
	if(y2>limity)
	{
		document.getElementById("wallSound").play();
		stepy2=-jumpy2;
	}
	if(x2<0)
	{
		document.getElementById("wallSound").play();
		stepx2=jumpx2;
	}
	if(y2<0)
	{
		document.getElementById("wallSound").play();
		stepy2=jumpy2;
	}
	x2+=stepx2;
	y2+=stepy2;
	score+=scoreLeap;
	document.getElementById("scoreUpdate").innerHTML = "Present Shoot Score: "+score+" $";
	calculateDistance();
}

//Function to calculate distance between circle centres
function calculateDistance()
{
	masterDistance = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
	dangerDistance = Math.sqrt((x3-x2)*(x3-x2) + (y3-y2)*(y3-y2)); 
	if((masterDistance <= 2*radius) && !collision)
	{
		gameOver("Collision with Master ball!!!",x1,y1);
	}
	 if((dangerDistance<=(2*radius)&&danger) && !collision)
	{
		gameOver("Collision with danger ball!!!",x3,y3);
	}
}
	

function reloadGame()
{
	window.location.reload();
}

function muteUnmuteClicked()
{
	var imageId = document.getElementById("muteUnmute");
	if(isMute)
	{
		document.getElementById("backgroundSound").play();
		isMute=false;
		imageId.title="music off";
		imageId.src="images/mute.jpg";
	}
	else
	{
		document.getElementById("backgroundSound").pause();
		isMute=true;
		imageId.title="music on";
		imageId.src="images/unMute.jpg";
	}
}

function gameOver(msg,x,y)
{
	drawCollision(x,y);
	collision=true;
	totalScore=0;
	bestFiveText=document.getElementById("bestFiveList").innerHTML;
	document.getElementById("backgroundSound").pause();
	document.getElementById("collisionSound").play();
	document.getElementById("scoresList").innerHTML = document.getElementById("scoresList").innerHTML  + score+" $" + "<br/>";
	scoreArray[scoreArrayIndex] = score;
	scoreArrayIndex++;
	scoreArray.sort(function(a,b){return b-a});
	for(i=0;i<5 && i<fired;i++)
	{
		totalScore+=scoreArray[i];
		bestFiveText=bestFiveText+scoreArray[i]+" $"+"<br/>";
	}
	document.getElementById("bestFiveList").innerHTML=bestFiveText;
	document.getElementById("totalScore").innerHTML=document.getElementById("totalScore").innerHTML+totalScore+" $" + "<br/>";
	writeCanvas(0.15,"Game Over! You Scored: "+totalScore+" $");
	

	if (localStorage.highScore)
	  {
	  	if(totalScore > localStorage.highScore)
	  	{
	  		name = prompt("Congratulations! New High Score record. Enter your Name","Anonymous");
	  		if(!(name === null || name === undefined))
	  		{
	  			if(name=="")
	  			{
					localStorage.highScorerName = "Anonymous";
	  			}
	  			else
	  			{
	  				localStorage.highScorerName = name;
	  			}
				localStorage.highScore=totalScore;
	  		}
	  	}
	  }
	else
	  {
	  	localStorage.highScore=0;
	  }
	  //localStorage.highScore=0;
	/*if(confirm("***GAME OVER*** \n\n\nYour Score: "+totalScore+" $\nReason: "+msg))
	{
		clearInterval(presentShoot);
		clearInterval(masterShoot);
		reloadGame();
	}
	else
	{	
		clearInterval(presentShoot);
		clearInterval(masterShoot);
		reloadGame();				
		window.close();	
	}*/
	clearInterval(presentShoot);
	clearInterval(masterShoot);
	clearInterval(dangerShoot);
}
function drawCollision(x,y)
{
  img1=document.getElementById("boom");
  ctx2.drawImage(img1, ((x+x2)/2)-50, ((y+y2)/2)-100, 250,250);
}

function writeCanvas(xpos, msg)
{
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	ctx.font="70px georgia";
	ctx.fillStyle = "white";
	ctx.fillText(msg,xpos*c.width,c.height/2);
}

function displayDanger()
{
	if(!dangerImage)
	{	
		dangerx = Math.ceil(Math.random()*(c.width-70));
		dangery = Math.ceil(Math.random()*(c.height-70));
		dangerImage = true;
		setTimeout(function(){dangerImage = false},10000);
	}
 	ctx2.beginPath();
	ctx2.arc(dangerx+35,dangery+35,radius,0,2*Math.PI);
	ctx2.stroke();
	var grd=ctx2.createRadialGradient(dangerx+35,dangery+35,radius-5,dangerx+35,dangery+35,radius);
	grd.addColorStop(0,"black");
	grd.addColorStop(1,"red");
	ctx2.fillStyle=grd;
	ctx2.fill();
	img1=document.getElementById("danger");
 	ctx2.drawImage(img1, dangerx, dangery, 70,70);
 	checkForDanger();
}

function checkForDanger()
{
	distance = Math.sqrt((dangerx-x2)*(dangerx-x2) + (dangery-y2)*(dangery-y2));
	
	if(distance <= (2*radius) && !danger)
	{
		document.getElementById("dangerSound").play();
		dangerZone();
	}
}

function dangerZone()
{
	danger = true;
	dangerShoot = setInterval(function(){dangerCircle()},dangerDelay);
}

function dangerCircle()
{
	if(dangerPeriod>0)
	{
		dangerPeriod = dangerPeriod - dangerDelay/1000;
		document.getElementById("notification").innerHTML = "Danger ball will terminate in <b>"+ dangerPeriod.toFixed(2) +"</b> seconds";

		ctx3.beginPath();
		ctx3.arc(x3+radius,y3+radius,radius,0,2*Math.PI);
		ctx3.stroke();
		var grd=ctx3.createRadialGradient(x3+radius,y3+radius,radius-5,x3+radius,y3+radius,radius);
		grd.addColorStop(0,"red");
		grd.addColorStop(1,"black");
		ctx3.fillStyle=grd;
		ctx3.fill();
		if(x3>limitx)
		{
			stepx3=-jumpx3;
		}
		if(y3>limity)
		{
			stepy3=-jumpy3;
		}
		if(x3<0)
		{ 
			stepx3=jumpx3;
		}
		if(y3<0)
		{
			stepy3=jumpy3;
		}

		x3+=stepx3;
		y3+=stepy3;
	}
	else
	{
		clearInterval(dangerShoot);
		document.getElementById("notification").innerHTML ="<b>Escape from collision with master by changing your position.</b>";
		x3=0;
		y3=0;
		danger=false;
		dangerPeriod = 5;
	}
}

function displayLife()
{
	if(!lifeImage)
	{	
		lifex = Math.ceil(Math.random()*(c.width-70));
		lifey = Math.ceil(Math.random()*(c.height-70));
		lifeImage = true;
		setTimeout(function(){lifeImage = false;life = false;},5000);
	}
 	ctx2.beginPath();
	ctx2.arc(lifex+35,lifey+35,radius,0,2*Math.PI);
	ctx2.stroke();
	var grd=ctx2.createRadialGradient(lifex+35,lifey+35,radius-5,lifex+35,lifey+35,radius);
	grd.addColorStop(0,"violet");
	grd.addColorStop(1,"black");
	ctx2.fillStyle=grd;
	ctx2.fill();
	img1=document.getElementById("life");
 	ctx2.drawImage(img1, lifex, lifey, 70,70);
 	checkForLife();
}

function checkForLife()
{
	distance = Math.sqrt((lifex-x2)*(lifex-x2) + (lifey-y2)*(lifey-y2));
	
	if(distance <= (2*radius) && !life)
	{
		document.getElementById("powerSound").play();
		life = true;
		attempts +=2;
		document.getElementById("attempts").innerHTML = "Shoots Remaining: "+attempts;
	}
}


function displayMoney()
{
	if(!moneyImage)
	{	
		moneyx = Math.ceil(Math.random()*(c.width-70));
		moneyy = Math.ceil(Math.random()*(c.height-70));
		moneyImage = true;
		setTimeout(function(){moneyImage = false;money = false;},5000);
	}
 	ctx2.beginPath();
	ctx2.arc(moneyx+35,moneyy+35,radius,0,2*Math.PI);
	ctx2.stroke();
	var grd=ctx2.createRadialGradient(moneyx+35,moneyy+35,radius-5,moneyx+35,moneyy+35,radius);
	grd.addColorStop(0,"orange");
	grd.addColorStop(1,"black");
	ctx2.fillStyle=grd;
	ctx2.fill();
	img1=document.getElementById("money");
 	ctx2.drawImage(img1, moneyx, moneyy, 70,70);
 	checkForMoney();
}

function checkForMoney()
{
	distance = Math.sqrt((moneyx-x2)*(moneyx-x2) + (moneyy-y2)*(moneyy-y2));
	
	if(distance <= (2*radius) && !money)
	{
		document.getElementById("powerSound").play();
		money = true;
		scoreLeap = 2;
		writeCanvas(0.3,"Bingo!! Double Money !!");
		document.getElementById("notification").innerHTML = "You are now scoring double the amount";
	}
}





