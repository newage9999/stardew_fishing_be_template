import Game from '../game.js';
import { FISH_BIT_TIMEOUT_MS } from '../public/globals.js';

test('Game::waitForBite() test', (done) => {

    const game = Game();

    // Comprovamos que la función waitForBite esté presente en el diccionario devuelto por Game()
    expect(game.waitForBite).toBeDefined();

    // Y comprovamos que sea una función
    expect(game.waitForBite).toBeInstanceOf(Function);

    // Si la llamamos sin haber llamado a castLine() antes, debería hacer reject con el mensaje de error 'standing'
    expect(game.waitForBite()).rejects.toBe('standing');

    // En caso que la llamemos después de haber llamado a castLine(), debería hacer resolve después de FISH_BIT_TIMEOUT_MS
    // El resolve lo debe hacer castLine(), que este test pase porque habéis puesto un setTimeout de FISH_BIT_TIMEOUT_MS en waitForBite(),
    // no significa que esté bien implementado
    game.castLine();
    game.waitForBite()
    .then(_ => {

        // Aprovechando que hemos sido informados de que el pez ha picado, vamos a tirar de la caña
        game.reelIn();

        // Si llamamos a waitForBite() ahora, debería hacer reject con el mensaje de error 'playing_minigame'
        expect(game.waitForBite()).rejects.toBe('playing_minigame');

        done();

    }).catch(_ => {
        throw new Error('Debería hacer resolve, no reject');
    });
    jest.advanceTimersByTime(FISH_BIT_TIMEOUT_MS);
});
