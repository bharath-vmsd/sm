import { Light } from 'https://unpkg.com/three@0.160.0/src/lights/Light.js';
import { Color } from 'https://unpkg.com/three@0.160.0/src/math/Color.js';

class RectAreaLight extends Light {

	constructor( color, intensity, width = 10, height = 10 ) {

		super( color, intensity );

		this.isRectAreaLight = true;

		this.type = 'RectAreaLight';

		this.width = width;
		this.height = height;

		this.power = intensity * Math.PI;

	}

	copy( source ) {

		super.copy( source );

		this.width = source.width;
		this.height = source.height;

		return this;

	}

	toJSON( meta ) {

		const data = super.toJSON( meta );

		data.object.width = this.width;
		data.object.height = this.height;

		return data;

	}

}

export { RectAreaLight };