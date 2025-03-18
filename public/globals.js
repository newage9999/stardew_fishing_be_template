export const CATCH_BAR_HEIGHT = 36.0;
export const CATCH_BAR_MAX_POS = 142.0 - CATCH_BAR_HEIGHT;
export const CATCH_BAR_INITIAL_POSITION = CATCH_BAR_MAX_POS / 2.0;
export const CATCH_BAR_SPEED = 6.0 / 100.0;
export const FISH_BIT_TIMEOUT_MS = 5000;
export const FISH_HEIGHT = 19.0;
export const FISH_MAX_POS = 135.0;
export const FISH_PADDING_TOP = 6;
export const FISH_SWAP_DIRECTION_TIME_MIN = 500;
export const FISH_SWAP_DIRECTION_TIME_MAX = 3000;
export const PROGRESS_BAR_SPEED = 2.0 / 100.0;
export const PROGRESS_BAR_MAX_POS = 144.0;
export const PROGRESS_BAR_INITIAL_POSITION = PROGRESS_BAR_MAX_POS / 2.0;
export const PROGRESS_BAR_TICK_FREQUENCY = 25;
export const SCALE_FACTOR = 4;
export const GET_MINI_GAME_INFO_RETRIEVE_FREQUENCY = 75;
export const PULL_ROD_TIMEOUT_MS = 3000;
export const ATTEMPTS_DIFFICULTY = ['low', 'medium', 'high', 'legend'];
const FISH_MIN_SPEED = 3.0 / 100.0;
const FISH_MAX_SPEED = 8.0 / 100.0;
export const DIFFICULTY_TO_FISH_TYPE = {
    'low': 'crab',
    'medium': 'pufferfish',
    'high': 'tuna',
    'legend': 'legend'
};
export const DIFFICULTY_TO_FISH_SPEED = {
    'low':    FISH_MIN_SPEED,
    'medium': 4.0 / 100.0,
    'high':   5.0 / 100.0,
    'legend': FISH_MAX_SPEED
};
export const DIFFICULTY_TO_FISH_NAME = {
    'low': 'Crab',
    'medium': 'Pufferfish',
    'high': 'Tuna',
    'legend': 'Legend'
};
export const DIFFICULTY_TO_FISH_MIN_LENGTH = {
    'low': 1,
    'medium': 1,
    'high': 12,
    'legend': 49
};
export const DIFFICULTY_TO_FISH_MAX_LENGTH = {
    'low': 20,
    'medium': 37,
    'high': 61,
    'legend': 51
};

export const calculateAnimationDuration = (start, end, speed) => {
    const durationNumber = Math.max(Math.abs((end - start)) / speed, 0);
    //console.log(`durationNumber: ${durationNumber}`);
    const durationInt = parseInt(durationNumber);
    //console.log(`durationInt: ${durationInt}`);
    return durationInt;
};

export const _computeCurrentPosition = (direction, lastSwapAt, lastSwapPosition, speed, min, max, tag='empty') => {
    const now = Date.now();
    const timeSinceLastSwapped = now - lastSwapAt;
    const positionChange = timeSinceLastSwapped * speed;
    const delta = direction === "up" ? 1 : -1;
    let newPosition = lastSwapPosition + positionChange * delta;
    if (direction === "up") {
        newPosition = Math.min(newPosition, max);
    } else {
        newPosition = Math.max(newPosition, min);
    }
    //console.log(`_computeCurrentPosition(${tag}) ${lastSwapPosition} -> ${newPosition} (${positionChange})`);
    return newPosition;
};

export const computeCatchBarCurrentPosition = (direction, lastSwapAt, lastSwapPosition, tag='empty') =>
    _computeCurrentPosition(direction, lastSwapAt, lastSwapPosition, CATCH_BAR_SPEED, 0.0, CATCH_BAR_MAX_POS);

export const computeFishCurrentPosition = (direction, lastSwapAt, lastSwapPosition, speed, tag='empty') => {
    //const speed = DIFFICULTY_TO_FISH_SPEED[difficulty];
    //console.log(`computeFishCurrentPosition speed: ${speed}, difficulty: ${difficulty}`);
    return _computeCurrentPosition(direction, lastSwapAt, lastSwapPosition, speed, 0.0, FISH_MAX_POS);
}

export const computeProgressBarCurrentPosition = (direction, lastSwapAt, lastSwapPosition, tag='empty') =>
    _computeCurrentPosition(direction, lastSwapAt, lastSwapPosition, PROGRESS_BAR_SPEED, 0.0, PROGRESS_BAR_MAX_POS);

export const computeFishTimeToNextSwap = (direction, lastSwapPosition, speed) => {

    const target = direction === "up" ? FISH_MAX_POS : 0.0;
    const remainingDistance = Math.abs(target - lastSwapPosition);
    const timeToReachLimit = remainingDistance / speed;
    let timeToRandomSwap = (Math.random() * (FISH_SWAP_DIRECTION_TIME_MAX - FISH_SWAP_DIRECTION_TIME_MIN)) + FISH_SWAP_DIRECTION_TIME_MIN;
    const speedNormalized = 1 - ((speed - FISH_MIN_SPEED) / (FISH_MAX_SPEED - FISH_MIN_SPEED));
    const multiplicator = 0.4;
    const speedMultiplier = multiplicator + ((1.0 - multiplicator) * speedNormalized);
    //console.log(`speedMultiplier: ${speedMultiplier}`);
    timeToRandomSwap *= speedMultiplier;
    let timeToSwapDirection;
    if (timeToReachLimit < timeToRandomSwap) {
        //console.log(`computeFishTimeToNextSwap timeToReachLimit: ${timeToReachLimit}`);
        timeToSwapDirection = timeToReachLimit;
    } else {
        //console.log(`computeFishTimeToNextSwap timeToRandomSwap: ${timeToRandomSwap}`);
        timeToSwapDirection = timeToRandomSwap;
    }
    return timeToSwapDirection;
};

export const catchBarAndFishTouch = (fishPosition, catchBarPosition) => {

    const FISH_HEIGHT_CONSIDERING_SCALE_FACTOR = FISH_HEIGHT / 2;
    const FISH_HITBOX_NEGATIVE_MARGIN_TOP = 3.0;
    const FISH_HITBOX_NEGATIVE_MARGIN_BOTTOM = 0.0;
    const fishHitboxTop = fishPosition + FISH_HEIGHT_CONSIDERING_SCALE_FACTOR - FISH_HITBOX_NEGATIVE_MARGIN_TOP;
    const fishHitboxBottom = fishPosition + FISH_HITBOX_NEGATIVE_MARGIN_BOTTOM;

    return catchBarPosition <= fishHitboxTop && catchBarPosition + CATCH_BAR_HEIGHT >= fishHitboxBottom;
};

export const timeForProgressBarToReachLimit = (direction, lastSwapPosition) => {
    const target = direction === "up" ? PROGRESS_BAR_MAX_POS : 0.0;
    const remainingDistance = Math.abs(target - lastSwapPosition);
    const timeToReachLimit = remainingDistance / PROGRESS_BAR_SPEED;
    return timeToReachLimit;
};
