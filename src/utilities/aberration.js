import { util } from './util'
import { vearth } from './vearth'

export const aberration = {};

aberration.calc = (p, earthBody, constant, result) => {
	var A, B, C; // double
	var betai, pV; // double
	var x = [], V = []; // double
	var i; // int

	/* Calculate the velocity of the earth (see vearth.c).
	 */
	vearth.calc(earthBody.position.date, earthBody);
	betai = 0.0;
	pV = 0.0;
	for( i=0; i<3; i++ ) {
		A = vearth.vearth [i] / constant.Clightaud;
		V[i] = A;
		betai += A*A;
		pV += p[i] * A;
	}
	/* Make the adjustment for aberration.
	 */
	betai = Math.sqrt( 1.0 - betai );
	C = 1.0 + pV;
	A = betai/C;
	B = (1.0  +  pV/(1.0 + betai))/C;

	for( i=0; i<3; i++ ) {
		C = A * p[i]  +  B * V[i];
		x[i] = C;
		constant.dp[i] = C - p[i];
	}

	result = result || {};

  util.showcor (p, constant.dp, result);
	for( i=0; i<3; i++ ) {
		p[i] = x[i];
	}

	return result;
};