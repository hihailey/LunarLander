import RNG from './RNG';

export function Simple1DNoise(seed) {
	var MAX_VERTICES = 256;
	var MAX_VERTICES_MASK = MAX_VERTICES - 1;
	var amplitude = 1;
	var scale = 1;

	var r = [];
	var rng = new RNG(seed);

	for (var i = 0; i < MAX_VERTICES; ++i) {
		r.push(rng.random(1, 100) / 100);
	}

	var getVal = function (x) {
		var scaledX = x * scale;
		var xFloor = Math.floor(scaledX);
		var t = scaledX - xFloor;
		var tRemapSmoothstep = t * t * (3 - 2 * t);

		/// Modulo using &#038;
		var xMin = xFloor % MAX_VERTICES_MASK;
		var xMax = (xMin + 1) % MAX_VERTICES_MASK;

		var y = lerp(r[xMin], r[xMax], tRemapSmoothstep);

		return y * amplitude;
	};

	/**
	 * Linear interpolation function.
	 * @param a The lower integer value
	 * @param b The upper integer value
	 * @param t The value between the two
	 * @returns {number}
	 */
	var lerp = function (a, b, t) {
		return a * (1 - t) + b * t;
	};

	// return the API
	return {
		getVal: getVal,
		setAmplitude: function (newAmplitude) {
			amplitude = newAmplitude;
		},
		setScale: function (newScale) {
			scale = newScale;
		},
	};
}

export function makeOctaves(
	func,
	x,
	{ amplitude, frequency, octaves, persistence, lacunarity }
) {
	let value = 0;
	for (let octave = 0; octave < octaves; octave++) {
		value += func(x * frequency) * amplitude;

		frequency *= lacunarity;
		amplitude *= persistence;
	}
	value = value / (2 - 1 / Math.pow(2, octaves - 1));
	return value;
}
