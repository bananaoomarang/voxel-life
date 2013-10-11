var DEAD = 0,
    ALIVE = 1;

module.exports = Life;

function Life(opts) {
    var self = this;

    if (opts.THREE) opts = {game:opts}; // They've just gone ahead and passed us the game

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
            switch(this.grid[x][y]) {
                case DEAD:
                    this.grid[x][y] = ALIVE;
                    game.setBlock([x, y + 1, -5], 1);
                    break;
                case ALIVE:
                    this.grid[x][y] = DEAD;
                    game.setBlock([x, y + 1, -5], 0);
                    break;
                default:
                    console.log('Pfff, something screwed up somewhere...')
            } 
        }
    }
}
