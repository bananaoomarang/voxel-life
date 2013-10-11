var DEAD = 0,
    ALIVE = 1;

module.exports = Life;

function Life(opts) {
    var self = this;

    if (opts.THREE) opts = {game:opts}; // They've just gone ahead and passed us the game

    this.game = opts.game;
    this.pos = opts.pos || [0, 0, 0]; // In game position
    this.dims = opts.dims || [10, 10, 10];
    this.speed = opts.speed || 1000; // In milliseconds
    this.timer = this.speed;
    this.grid;
    
    // Create grid for game
    this.grid = [];
    for (var x = 0; x < this.dims[0]; x++) {
        this.grid[x] = [];
        for (var y = 0; y < this.dims[1]; y++) {
            // Decide if alive or dead
            var type = Math.round(Math.random());

            switch(type) {
                case 0:
                    this.grid[x][y] = DEAD;
                    break;
                case 1:
                    this.grid[x][y] = ALIVE;
                    break;
                default:
                    console.log('WTF maths just broke call Milo');
            }
        };
    };
}

Life.prototype.tick = function(dt) {
    this.timer -= dt;
    if(this.timer <= 0) {
        this.timer = this.speed;
        console.log(this.grid);
        this.update();
    }
}

Life.prototype.update = function() {
    for (var x = 0; x < this.grid.length; x++) {
        for (var y = 0; y < this.grid[x].length; y++) {
            
            var neighbors = this.getNeighbors({x: x, y: y + 1});
            
            switch(this.grid[x][y]) {
                case DEAD:
                    if(neighbors === 3) {
                        this.grid[x][y] = ALIVE;
                        this.game.setBlock([x, y + 1, -5], 1);
                    }
                    break;
                case ALIVE:
                    if(neighbors < 2) {
                        this.grid[x][y] = DEAD;
                        this.game.setBlock([x, y + 1, -5], 0);
                    }

                    if(neighbors > 3) {
                        this.grid[x][y] = DEAD;
                        this.game.setBlock([x, y + 1, -5], 0);
                    }
                    break;
                default:
                    console.log('Pfff, something screwed up somewhere...')
            } 
        }
    }
}

Life.prototype.getNeighbors = function(p) {
    var neighbors = 0;
    if(this.game.getBlock([p.x + 1, p.y, -5]) !== 0) {
        neighbors++;
    }

    if(this.game.getBlock([p.x - 1, p.y, -5]) !== 0) {
        neighbors++;
    }
    
    if(this.game.getBlock([p.x, p.y + 1, -5]) !== 0) {
        neighbors++;
    }
    
    if(this.game.getBlock([p.x, p.y - 1, -5]) !== 0) {
        neighbors++;
    }
    
    if(this.game.getBlock([p.x + 1, p.y + 1, -5]) !== 0) {
        neighbors++;
    }

    if(this.game.getBlock([p.x - 1, p.y  - 1, -5]) !== 0) {
        neighbors++;
    }
    
    if(this.game.getBlock([p.x - 1, p.y + 1, -5]) !== 0) {
        neighbors++;
    }
    
    if(this.game.getBlock([p.x + 1, p.y - 1, -5]) !== 0) {
        neighbors++;
    }

    return neighbors
} 
