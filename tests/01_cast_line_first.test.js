import Game from '../game.js';
import { FISH_BIT_TIMEOUT_MS, PULL_ROD_TIMEOUT_MS } from '../public/globals.js';

// Primeros tests de la función castLine(). Deberían pasar aún sin haber implementado aún el resto de funciones
test('Game::castLine() first test', done => {

    const game = Game();

    // Comprovamos que la función castLine esté presente en el diccionario devuelto por Game()
    expect(game.castLine).toBeDefined();

    // Y comprovamos que sea una función
    expect(game.castLine).toBeInstanceOf(Function);

    let result = game.castLine();
    // La primera vez llamando a castLine debería devolver 'null', indicando que la caña se ha lanzado correctamente
    expect(result).toBe(null);

    result = game.castLine();
    // Pero si lo volvemos a llamar antes que pase FISH_BIT_TIMEOUT_MS, nos debería devolver el mensaje de error 'line_cast'
    expect(result).toBe('line_cast');

    // Esperemos ahora FISH_BIT_TIMEOUT_MS, para estar en el momento exacto en el que el pez muerde el anzuelo
    setTimeout(_ => {

        result = game.castLine();
        // Si lo llamamos ahora, nos debería devolver el mensaje de error 'fish_bit'
        expect(result).toBe('fish_bit');
    
        // Y si esperamos ahora PULL_ROD_TIMEOUT_MS, no abremos tirado de la caña a tiempo, y el jugador automaticamente recojerá la caña
        setTimeout(_ => {

            result = game.castLine();
            // Lo cual debería volver a reiniciar el ciclo, permitiendonos volver a lanzar la caña de nuevo, y devolviendo 'null'
            expect(result).toBe(null);

            done();

        }, PULL_ROD_TIMEOUT_MS);
        jest.advanceTimersByTime(PULL_ROD_TIMEOUT_MS);
    
    }, FISH_BIT_TIMEOUT_MS);
    jest.advanceTimersByTime(FISH_BIT_TIMEOUT_MS);
});
