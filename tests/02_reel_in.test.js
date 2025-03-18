import Game from '../game.js';
import { FISH_BIT_TIMEOUT_MS, PULL_ROD_TIMEOUT_MS } from '../public/globals.js';

// Tiempo para que el pez pique y escape. Añadimos 100ms de margen, para asegurar
const FISH_FLEE_TIMEOUT_MS = FISH_BIT_TIMEOUT_MS + PULL_ROD_TIMEOUT_MS + 100;

test('Game::reelIn() test', done => {

    const game = Game();

    // Comprovamos que la función reelIn esté presente en el diccionario devuelto por Game()
    expect(game.reelIn).toBeDefined();

    // Y comprovamos que sea una función
    expect(game.reelIn).toBeInstanceOf(Function);

    let result = game.reelIn();
    // Si llamamos a reelIn() sin haber lanzado la caña antes con castLine(), debería devolvernos el mensaje de error 'standing'
    expect(result).toStrictEqual({errorCode: 'standing'});

    // Lanzemos entonces la caña
    game.castLine();

    // Si llamamos a reelIn() immediatamente después, el pez aún no habrá picado...
    result = game.reelIn();

    // Así que nos devolverá el mensaje de error 'line_cast', y recojerá la caña
    expect(result).toStrictEqual({errorCode: 'line_cast'});

    // Además, reelIn() debería haber cancelado el setTimeout de FISH_BIT_TIMEOUT_MS,
    // o almenos el callback del timeout debería tener controlado que se ha llamado a reelIn(), así que si esperamos ese tiempo...
    setTimeout(_ => {

        // reelIn() NO debería devolver {difficulty: '...'}. Si lo hace, significa que el timeout de FISH_BIT_TIMEOUT_MS de castLine() se ha producido,
        // el state ha pasado a ser 'fish_bit', y reelIn() ha iniciado el popup de pesca
        result = game.reelIn();
        expect(result).toStrictEqual({errorCode: 'standing'});

        // Probemos ahora a recojer la caña después de que el pez haya "escapado"
        game.castLine();
        setTimeout(_ => {

            result = game.reelIn();
            // Para este entonces, el jugador habrá recojido su caña automáticamente, y reelIn() devolverá lo mismo que al principio
            expect(result).toStrictEqual({errorCode: 'standing'});

            // Probemos ahora a recojer la caña justo después de que el pez haya picado
            game.castLine();
            setTimeout(_ => {

                result = game.reelIn();
                // Ahora sí que reelIn() debería devolver {difficulty: '...'}, indicando que hemos tirado de la caña cuando el pez ha picado,
                // y que se inicia el popup de pesca
                expect(result).toEqual(
                    expect.objectContaining({
                        difficulty: expect.any(String)
                    })
                );

                result = game.reelIn();
                // Si ahora intentamos volver a llamar a reelIn(), debería indicarnos que ya nos encontramos en el popup de pesca
                expect(result).toStrictEqual({errorCode: 'standing'});
                
                done();

            }, FISH_BIT_TIMEOUT_MS);
            jest.advanceTimersByTime(FISH_BIT_TIMEOUT_MS);

        }, FISH_FLEE_TIMEOUT_MS);
        jest.advanceTimersByTime(FISH_FLEE_TIMEOUT_MS);

    }, FISH_BIT_TIMEOUT_MS);
    jest.advanceTimersByTime(FISH_BIT_TIMEOUT_MS);
});
