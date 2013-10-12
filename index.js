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

            // Figure out x, y, z game coords for block
            var xg = x + this.pos[0],
                yg = y + this.pos[1],
                zg = this.pos[2];

            switch(type) {
                case 0:
                    this.grid[x][y] = DEAD;
                    this.game.setBlock([xg, yg, zg], 0);
                    break;
                case 1:
                    this.grid[x][y] = ALIVE;
                    this.game.setBlock([xg, yg, zg], 1);
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
        this.update();
    }
}

Life.prototype.update = function() {
    for (var x = 0; x < this.grid.length; x++) {
        for (var y = 0; y < this.grid[x].length; y++) {
            
            // Figure out x, y, z game coords for block
            var xg = x + this.pos[0],
                yg = y + this.pos[1],
                zg = this.pos[2];
            
            var neighbors = this.getNeighbors({x: x, y: y});
            
            switch(this.grid[x][y]) {
                case DEAD:
                    if(neighbors === 3) {
                        this.grid[x][y] = ALIVE;
                        this.game.setBlock([xg, yg, zg], 1);
                    }
                    break;
                case ALIVE:
                    if(neighbors < 2) {
                        this.grid[x][y] = DEAD;
                        this.game.setBlock([xg, yg, zg], 0);
                    }

                    if(neighbors > 3) {
                        this.grid[x][y] = DEAD;
                        this.game.setBlock([xg, yg, zg], 0);
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
