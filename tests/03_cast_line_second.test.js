import Game from '../game.js';
import { FISH_BIT_TIMEOUT_MS } from '../public/globals.js';

// Ahora que sabemos que reelIn() pasa los tests, vamos a comprobar una última cosa de castLine()
test('Game::castLine() second test', done => {

    const game = Game();

    // Vamos a iniciar el popup de pesca
    let result = game.castLine();

    setTimeout(_ => {

        result = game.reelIn();
        // reelIn() debería devolver {difficulty: ...}, indicando que el popup de pesca se ha iniciado
        expect(result).toEqual(
            expect.objectContaining({
                difficulty: expect.any(String)
            })
        );

        // Provemos ahora a llamar a castLine()
        result = game.castLine();
        // Debería devolvernos el mismo mensaje de error que reelIn() cuando el popup de pesca está activo
        expect(result).toBe('playing_minigame');

        done();

    }, FISH_BIT_TIMEOUT_MS);
    jest.advanceTimersByTime(FISH_BIT_TIMEOUT_MS);
});
