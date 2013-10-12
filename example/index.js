var createGame = require('voxel-engine'),
    highlight = require('voxel-highlight'),
    player = require('voxel-player'),
    voxel = require('voxel'),
    extend = require('extend'),
    fly = require('voxel-fly'),
    walk = require('voxel-walk'),
    texturePath = require('painterly-textures')(__dirname),
    Life = require('../');

module.exports = function(opts, setup) {
    var defaults = {
        texturePath: texturePath,
        generate: function(x, y, z) {
            return y === 0 ? 1 : 0;
        },
        materials: [['grass', 'dirt', 'grass_dirt'], 'brick', 'dirt'], //[top,bottom,sides]
        materialFlatColor: false,
        chunkDistance: 2,
        chunkSize: 32,
        worldOrigin: [0, 0, 0],
        controls: { discreteFire: true },
        lightsDisabled: false,
        fogDisabled: true,
        generateChunks: true,
        mesher: voxel.meshers.culled //Why TF does the greedy mesher screw up textures?
    };

    setup = setup || defaultSetup;
    opts = extend({}, defaults, opts || {});

    // setup the game
    var game = createGame(opts);
    var container = opts.container || document.body;
    window.game = game; // for debugging
    game.appendTo(container);
    if (game.notCapable()) return game;

    var createPlayer = player(game);

    // create the player from a minecraft skin file and tell the
    // game to use it as the main player
    var avatar = createPlayer(opts.playerSkin || 'player.png');
    avatar.possess();
    avatar.yaw.position.set(2, 5, 4);

    setup(game, avatar);

    window.voxels = game.voxels;

    return game;
};

function defaultSetup(game, avatar) {
    // Flight
    var makeFly = fly(game);
    var target = game.controls.target();
    game.flyer = makeFly(target);

    // Life
    var life = new Life({
        game: game,
        dims: [20, 20],
        pos: [0, 1, -5],
        speed: 1000
    });

    // highlight blocks when you look at them, hold <Ctrl> for block placement
    var blockPosPlace, blockPosErase;
    var hl = game.highlighter = highlight(game, { color: 0xff0000 });
    hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos; });
    hl.on('remove', function (voxelPos) { blockPosErase = null; });
    hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos; });
    hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null; });

    // toggle between first and third person modes
    window.addEventListener('keydown', function (ev) {
        if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle();
    });

    // block interaction stuff, uses highlight data
    var currentMaterial = 1;

    game.on('fire', function (target, state) {
        var position = blockPosPlace;
        if (position) {
            game.createBlock(position, currentMaterial);
        }
        else {
            position = blockPosErase;
            if (position) game.setBlock(position, 0);
        }
    });


    game.on('tick', function(dt) {
        walk.render(target.playerSkin);
        var vx = Math.abs(target.velocity.x);
        var vz = Math.abs(target.velocity.z);
        if (vx > 0.001 || vz > 0.001) walk.stopWalking();
        else walk.startWalking();

        life.tick(dt);
    });
}
