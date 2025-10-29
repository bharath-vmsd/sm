import {
	DataTexture,
	FloatType,
	MathUtils,
	NearestFilter,
	RGBAFormat,
	ShaderMaterial,
	UniformsUtils
} from 'three';

// RectAreaLightUniformsLib is a library of uniforms for RectAreaLight.
const RectAreaLightUniformsLib = {

	init: function () {

		const ltc_1_data = new Uint8Array( [
			// RGBA
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		] );

		const ltc_2_data = new Uint8Array( [
			// RGBA
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		] );

		const ltc_1 = new DataTexture( ltc_1_data, 64, 1, RGBAFormat, FloatType );
		ltc_1.minFilter = NearestFilter;
		ltc_1.magFilter = NearestFilter;
		ltc_1.unpackAlignment = 1;
		ltc_1.needsUpdate = true;

		const ltc_2 = new DataTexture( ltc_2_data, 64, 1, RGBAFormat, FloatType );
		ltc_2.minFilter = NearestFilter;
		ltc_2.magFilter = NearestFilter;
		ltc_2.unpackAlignment = 1;
		ltc_2.needsUpdate = true;

		UniformsUtils.cloning = false;

		const uniforms = {
			ltc_1: { value: ltc_1 },
			ltc_2: { value: ltc_2 }
		};

		ShaderMaterial.prototype.onBeforeCompile = function ( shader ) {

			if ( shader.isMeshStandardMaterial ) {

				shader.uniforms.ltc_1 = uniforms.ltc_1;
				shader.uniforms.ltc_2 = uniforms.ltc_2;

				shader.vertexShader = shader.vertexShader
					.replace(
						'#include <common>',
						`#include <common>
						varying vec3 vViewPosition;`
					)
					.replace(
						'#include <worldpos_vertex>',
						`#include <worldpos_vertex>
						vViewPosition = - mvPosition.xyz;`
					);

				shader.fragmentShader = shader.fragmentShader
					.replace(
						'#include <common>',
						`#include <common>
						uniform sampler2D ltc_1;
						uniform sampler2D ltc_2;
						varying vec3 vViewPosition;`
					)
					.replace(
						'#include <lights_physical_pars_fragment>',
						`#include <lights_physical_pars_fragment>
						vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 m, const in vec3 rectCoords[ 4 ] ) {
							// abelton-ltc
							const float LUT_SIZE = 64.0;
							const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
							const float LUT_BIAS = 0.5 / LUT_SIZE;
							// AABB
							vec3 aabb_min = min( rectCoords[ 0 ], min( rectCoords[ 1 ], min( rectCoords[ 2 ], rectCoords[ 3 ] ) ) );
							vec3 aabb_max = max( rectCoords[ 0 ], max( rectCoords[ 1 ], max( rectCoords[ 2 ], rectCoords[ 3 ] ) ) );
							// Transform point to local coordinates
							vec3 p_ = m * ( P - aabb_min );
							// Evaluate LTC
							vec2 uv = vec2( N.z, sqrt( 1.0 - V.z * V.z ) );
							uv.y = 1.0 - uv.y;
							vec2 st = uv * LUT_SCALE + LUT_BIAS;
							vec4 t1 = texture2D( ltc_1, st );
							vec4 t2 = texture2D( ltc_2, st );
							mat3 Minv = mat3(
								vec3( t1.x, 0, t1.y ),
								vec3(    0, 1,    0 ),
								vec3( t1.z, 0, t1.w )
							);
							// Fresnel term
							float fresnel = ( t2.x * ( 1.0 - V.z ) + t2.y * V.z );
							// Area integral
							vec3 aabb_size = aabb_max - aabb_min;
							vec3 integral = vec3(
								( p_.x * p_.x + p_.z * p_.z - 1.0 ) * 0.5,
								p_.y * p_.y * 0.5,
								- p_.x * p_.z
							);
							integral = Minv * integral;
							integral = vec3(
								max( 0.0, integral.x ),
								max( 0.0, integral.y ),
								max( 0.0, integral.z )
							);
							integral = vec3(
								( integral.x + integral.y + integral.z ) * fresnel,
								( integral.x + integral.y + integral.z ) * fresnel,
								( integral.x + integral.y + integral.z ) * fresnel
							);
							// Return the result
							return integral;
						}`
					)
					.replace(
						'#include <lights_fragment_begin>',
						`#include <lights_fragment_begin>
						#if defined( RE_IndirectDiffuse )
							vec3 RE_IndirectDiffuse_backup = RE_IndirectDiffuse;
						#endif
						#if defined( RE_IndirectSpecular )
							vec3 RE_IndirectSpecular_backup = RE_IndirectSpecular;
						#endif`
					)
					.replace(
						'#include <lights_fragment_end>',
						`#include <lights_fragment_end>
						#if defined( RE_IndirectDiffuse )
							RE_IndirectDiffuse = RE_IndirectDiffuse_backup;
						#endif
						#if defined( RE_IndirectSpecular )
							RE_IndirectSpecular = RE_IndirectSpecular_backup;
						#endif`
					);

			}

		};

	}

};

export { RectAreaLightUniformsLib };