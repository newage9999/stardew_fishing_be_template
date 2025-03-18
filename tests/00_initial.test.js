import Game from '../game.js';

test('initial tests', done => {

    const game = Game();

    // Game() debería devolver un diccionario. Este expect comprueba que la variable no sea ni null ni undefined
    expect(game).toBeDefined();

    done();
});
