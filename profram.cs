using System;
namespace TechTest2014
{
	#region Main Programm
	class Program
	{
		public bool gameOver;
		public bool restart;
		public int score;
		public int noOfEnemies; // decides how many enemies should be on the field
		public PlayerShip playerShip;
		public EnemyShip enemyShip1;
		public EnemyShip enemyShip2;
		public EnemyShip enemyShip3;
		public EnemyShip enemyShip4;
		public static void Main()
		{ 
			 Start();
		}
		public static  void Start(){
			System.Console.WriteLine("Hello, World!");
			CreatePlayerShip();
			CreateEnemies();
			RunGame();
		}
				
		private void RunGame()
			{
			// put player ship on map
			playerShip.xPosition = 0;
			playerShip.yPosition = 10;
			// activate enemy ships at different intervals and move them down the screen
			Random waitTime = new Random();
			int seconds = waitTime.Next(3 * 1000, 11 * 1000);
			// Continiously move the ships down after each sleep until they are at Y-coordinate 0 (outside the screen), then call OutOfBounds
			enemyShip1.IsActivated = 1;
			System.Threading.Thread.Sleep(seconds);
			enemyShip2.IsActivated = 1;
			enemyShip1.yPosition = enemyShip1.yPosition - enemyShip1.speed;
			// Hmm...I wonder if there is a way to change the Y position for all active ships so I dont have to do it per ship 
			System.Threading.Thread.Sleep(seconds);
			enemyShip3.IsActivated = 1;
			enemyShip1.yPosition = enemyShip1.yPosition - enemyShip1.speed;
			enemyShip2.yPosition = enemyShip2.yPosition - enemyShip2.speed;
			System.Threading.Thread.Sleep(seconds);
			enemyShip4.IsActivated = 1;
			enemyShip1.yPosition = enemyShip1.yPosition - enemyShip1.speed;
			enemyShip2.yPosition = enemyShip2.yPosition - enemyShip2.speed;
			enemyShip3.yPosition = enemyShip3.yPosition - enemyShip3.speed;
			System.Threading.Thread.Sleep(seconds);
			enemyShip1.yPosition = enemyShip1.yPosition - enemyShip1.speed;
			enemyShip2.yPosition = enemyShip2.yPosition - enemyShip2.speed;
			enemyShip3.yPosition = enemyShip3.yPosition - enemyShip3.speed;
			enemyShip4.yPosition = enemyShip4.yPosition - enemyShip4.speed;
			// check for every ship if out of bounds, then inactivate and reset
			OutOfBounds(enemyShip1);
			OutOfBounds(enemyShip2);
			OutOfBounds(enemyShip3);
			OutOfBounds(enemyShip4);
			
			// How to continue to move the enemy ships all the time? Code above only moves enemy ships one step and we want the enemies to move all the time.
			// Maybe a loop can be used in order to move the ships continously? MoveShip(enemyShip)? 
			//While (enemyShip1.IsActivated = 1 || enemyShip2.IsActivated = 1 || enemyShip3.IsActivated = 1 || enemyShip4.IsActivated = 1)
			// {
			// enemyShip1.yPosition = enemyShip1.yPosition - 10;
			// enemyShip2.yPosition = enemyShip2.yPosition - 10;
			// enemyShip3.yPosition = enemyShip3.yPosition - 10;
			// enemyShip4.yPosition = enemyShip4.yPosition - 10;
			
			// OutOfBounds(enemyShip1);
			// OutOfBounds(enemyShip2);
			// OutOfBounds(enemyShip3);
			// OutOfBounds(enemyShip4);
		
		}
		public void OutOfBounds(EnemyShip enemyShip)
		{
			if (enemyShip.yPosition <= 0)
			{
				enemyShip.yPosition = 100;
				enemyShip.IsActivated = 0;
			}
		}
		private void CreatePlayerShip()
		{
			playerShip = new PlayerShip();
			playerShip.health = 100;
			playerShip.lifes = 3;
		}
		private void CreateEnemies()
		{
			// Hmmm...there must be a better way to create the enemy ships than creating them one by one. What if I want 10 enemies
			enemyShip1 = new EnemyShip();
			enemyShip2 = new EnemyShip();
			enemyShip3 = new EnemyShip();
			enemyShip4 = new EnemyShip();
			// Hmm.. I wonder if there is a way to change this so I dont have to set the values for every ship
			Random rnd = new Random();
			rnd.Next(-100, 100);
			enemyShip1.xPosition = int.Parse(rnd.ToString());
			enemyShip1.yPosition = 100;
			enemyShip1.IsActivated = 1;
		}
	}
	#endregion
	#region Player ship
	class PlayerShip{
		private int health;
		private int lifes;
		 public int Health{
	        get{
	           return health; 
	        }
	        set {
	           health = value; 
	        }
	  	  }
    	public int Lifes{
	        get{ 
	           return lifes; 
	        }
	        set{ 
	           lifes = value; 
	        }
    	} 
		
	}
	#endregion
	#region Enemy Class
	class EnemyShip{
		public bool IsActivated;
		public int xPosition;
		public int yPosition;
	}
	#endregion
}

namespace TechTest2014
{
using System;
class Program
{
public bool gameOver;
public bool restart;
public int score;
public int noOfEnemies; // decides how many enemies should be on the field
public PlayerShip playerShip;
public EnemyShip enemyShip1;
public EnemyShip enemyShip2;
public EnemyShip enemyShip3;
public EnemyShip enemyShip4;
/// The purpose is to create the player ship, X enemies and then move the enemies toward the player
public static void Main(string[] args)
{
}

public void Start()
{
	CreatePlayerShip();
	CreateEnemies();
	RunGame();
}

private void RunGame()
	{
	// put player ship on map
	playerShip.xPosition = 0;
	playerShip.yPosition = 10;
	// activate enemy ships at different intervals and move them down the screen
	Random waitTime = new Random();
	int seconds = waitTime.Next(3 * 1000, 11 * 1000);
	// Continiously move the ships down after each sleep until they are at Y-coordinate 0 (outside the screen), then call OutOfBounds
	enemyShip1.IsActivated = 1;
	System.Threading.Thread.Sleep(seconds);
	enemyShip2.IsActivated = 1;
	enemyShip1.yPosition = enemyShip1.yPosition - enemyShip1.speed;
	// Hmm...I wonder if there is a way to change the Y position for all active ships so I dont have to do it per ship 
	System.Threading.Thread.Sleep(seconds);
	enemyShip3.IsActivated = 1;
	enemyShip1.yPosition = enemyShip1.yPosition - enemyShip1.speed;
	enemyShip2.yPosition = enemyShip2.yPosition - enemyShip2.speed;
	System.Threading.Thread.Sleep(seconds);
	enemyShip4.IsActivated = 1;
	enemyShip1.yPosition = enemyShip1.yPosition - enemyShip1.speed;
	enemyShip2.yPosition = enemyShip2.yPosition - enemyShip2.speed;
	enemyShip3.yPosition = enemyShip3.yPosition - enemyShip3.speed;
	System.Threading.Thread.Sleep(seconds);
	enemyShip1.yPosition = enemyShip1.yPosition - enemyShip1.speed;
	enemyShip2.yPosition = enemyShip2.yPosition - enemyShip2.speed;
	enemyShip3.yPosition = enemyShip3.yPosition - enemyShip3.speed;
	enemyShip4.yPosition = enemyShip4.yPosition - enemyShip4.speed;
	// check for every ship if out of bounds, then inactivate and reset
	OutOfBounds(enemyShip1);
	OutOfBounds(enemyShip2);
	OutOfBounds(enemyShip3);
	OutOfBounds(enemyShip4);
	
	// How to continue to move the enemy ships all the time? Code above only moves enemy ships one step and we want the enemies to move all the time.
	// Maybe a loop can be used in order to move the ships continously? MoveShip(enemyShip)? 
	//While (enemyShip1.IsActivated = 1 || enemyShip2.IsActivated = 1 || enemyShip3.IsActivated = 1 || enemyShip4.IsActivated = 1)
	// {
	// enemyShip1.yPosition = enemyShip1.yPosition - 10;
	// enemyShip2.yPosition = enemyShip2.yPosition - 10;
	// enemyShip3.yPosition = enemyShip3.yPosition - 10;
	// enemyShip4.yPosition = enemyShip4.yPosition - 10;
	
	// OutOfBounds(enemyShip1);
	// OutOfBounds(enemyShip2);
	// OutOfBounds(enemyShip3);
	// OutOfBounds(enemyShip4);

}
public void OutOfBounds(EnemyShip enemyShip)
{
	if (enemyShip.yPosition <= 0)
	{
		enemyShip.yPosition = 100;
		enemyShip.IsActivated = 0;
	}
}
private void CreatePlayerShip()
{
	playerShip = new PlayerShip();
	playerShip.health = 100;
	playerShip.lifes = 3;
}
private void CreateEnemies()
{
	// Hmmm...there must be a better way to create the enemy ships than creating them one by one. What if I want 10 enemies
	enemyShip1 = new EnemyShip();
	enemyShip2 = new EnemyShip();
	enemyShip3 = new EnemyShip();
	enemyShip4 = new EnemyShip();
	// Hmm.. I wonder if there is a way to change this so I dont have to set the values for every ship
	Random rnd = new Random();
	rnd.Next(-100, 100);
	enemyShip1.xPosition = int.Parse(rnd.ToString());
	enemyShip1.yPosition = 100;
	enemyShip1.IsActivated = 1;
}