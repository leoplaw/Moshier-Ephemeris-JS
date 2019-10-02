import Ephemeris from '../src/Ephemeris'
import { constellation } from '../src/utilities/constellation'

describe('Ephemeris', () => {
  const defaultOrigin = {
    year: 2000, month: 0, day: 1, hours: 0, minutes: 0, seconds: 0, longitude: -71.1, latitude: 41.37
  } // Jan 1st. 2000 0:00:00, Cambridge MA

  describe('constructor', () => {
    const ephemeris = new Ephemeris(defaultOrigin)

    it('constructs a new class without error', () => {
      expect(!!ephemeris).toEqual(true)
    })

    it('validates inputs', () => {
      expect(() => new Ephemeris({year: -1, month: 1, day: 1, hours: 1, minutes: 0, seconds: 1, latitude: 0, longitude: 0})).toThrowError("The year: \"-1\" - must be an integer and > 0 (C.E.)")

      expect(() => new Ephemeris({year: 1, month: 12, day: 1, hours: 1, minutes: 0, seconds: 1, latitude: 0, longitude: 0})).toThrowError("The month: \"12\" - must be an integer and between 0 - 11. (0 = January, 11 = December)")

      expect(() => new Ephemeris({year: 1, month: 1, day: 0, hours: 1, minutes: 0, seconds: 1, latitude: 0, longitude: 0})).toThrowError("The day: \"0 must be between 1 - 31")

      expect(() => new Ephemeris({year: 1, month: 1, day: 1, hours: 24, minutes: 0, seconds: 1, latitude: 0, longitude: 0})).toThrowError("The hour: \"24\" - must be an integer and between 0 - 23. (0 = midnight 00:00, 23 = 11pm (23:00))")

      expect(() => new Ephemeris({year: 1, month: 1, day: 1, hours: 1, minutes: 60, seconds: 1, latitude: 0, longitude: 0})).toThrowError("The minute: \"60\" - must be an integer and between 0 - 59")

      expect(() => new Ephemeris({year: 1, month: 1, day: 1, hours: 1, minutes: 0, seconds: 60, latitude: 0, longitude: 0})).toThrowError("The second: \"60\" - must be an integer and between 0 - 59")

      expect(() => new Ephemeris({year: 1, month: 1, day: 1, hours: 1, minutes: 0, seconds: 0, latitude: -91, longitude: 0})).toThrowError("The latitude: \"-91\" - must be an float and between -90.00 to 90.00")

      expect(() => new Ephemeris({year: 1, month: 1, day: 1, hours: 1, minutes: 0, seconds: 0, latitude: 0, longitude: 181})).toThrowError("The longitude: \"181\" - must be an float and between -180.00 to 180.00")

      expect(() => new Ephemeris({year: 1, month: 1, day: 1, hours: 1, minutes: 0, seconds: 0, latitude: 0, longitude: 0, height: "0"})).toThrowError("Parameter value of: \"0\" - must be a number (int or float type).")
    })

    it('constructs Constant from input', () => {
      // expect(ephemeris.Constant.date.year).toEqual(2000)
      expect(ephemeris.Constant.tlong).toEqual(-71.1)
    })

    it('assigns Body', () => {
      expect(ephemeris.Body.find(b => b.key === 'earth').anomaly).toEqual(1.1791)
      expect(ephemeris.Body.find(b => b.key === 'earth').ptable.distance).toEqual(1.000139872959708)
    })

    it('initializes Kepler constants', () => {
      expect(ephemeris.Constant.tlat).toEqual(41.17920042308457)
      expect(ephemeris.Constant.trho).toEqual(0.9985423669162051)
    })

    it('calculates dates', () => {
      // Julian
      expect(ephemeris.Date.julian).toEqual(2451544.5)
      expect(ephemeris.Date.j2000).toEqual(1999.9986310746065)
      expect(ephemeris.Date.b1950).toEqual(1999.998841889117)
      expect(ephemeris.Date.j2000).toEqual(1999.9986310746065)

      expect(ephemeris.Date.utc).toEqual(new Date("2000-01-01T00:00:00.000Z"))
      // Universal
      expect(ephemeris.Date.universalDate).toEqual(new Date("2000-01-01T04:58:56.170Z"))
      expect(ephemeris.Date.universalJulian).toEqual(2451544.4992612316)

    })

    it('calculates Earth', () => {
      expect(ephemeris.Earth.epoch).toEqual(2451544.5)
      expect(ephemeris.Earth.distance).toEqual(0.983316965107044)
      expect(ephemeris.Earth.position.polar).toEqual([1.7430277433487111, -0.00000401331969731571, 0.9833318985267808])
      expect(ephemeris.Earth.position.rect).toEqual([-0.16852457737110144, 0.8888429510893577, 0.38535606623087776])
    })

    it('calculates Results', () => {
      expect(ephemeris.Results.length).toEqual(12)
    })
  })

  describe('CalculateBody', () => {
    const ephemeris = new Ephemeris(defaultOrigin)

    it('calculates the Sun', () => {
      const sun = ephemeris.CalculateBody('sun')


      expect(sun.position.apparentLongitude).toEqual(279.85845746839465)
      expect(sun.position.apparentLongitudeString).toEqual("279°51'30\"")

      expect(sun.position.aberration).toEqual({"dDec": 1.543790024784711, "dRA": 1.506044160265716})
      expect(sun.position.altaz.dLocalApparentSiderialTime).toEqual(0.5037761337802859)

      expect(sun.position.apparent.dDec).toEqual(-0.40266799895209826)
      expect(sun.position.apparent.dRA).toEqual(4.899579517039573)

      expect(sun.position.equinoxEclipticLonLat["1"]).toEqual(0.000004016332594980136)
      expect(sun.position.equinoxEclipticLonLat["2"]).toEqual(0.9833318985267808)
      expect(sun.position.equinoxEclipticLonLat["3"]).toEqual({"degree": 279, "minutes": 52, "seconds": 5.2109247263433645})
      expect(sun.position.equinoxEclipticLonLat["4"]).toEqual({"degree": 0, "minutes": 0, "seconds": 0.8284280645274755})


      expect(sun.position.altaz.atmosphericRefraction).toEqual({"dDec": -3.434999055980598e-11, "dRA": 0, "deg": 0})
      expect(sun.position.altaz.diurnalAberation).toEqual({"dDec": -0.08931878508841723, "dRA": -0.005410752130287809, "dec": -0.40266843198178814, "ra": 4.899579123558574})
      expect(sun.position.altaz.topocentric).toEqual({"altitude": -28.292954029774886, "azimuth": 263.16585592925907, "dDec": {"degree": 23, "minutes": 4, "seconds": 20.915465026334914}, "dRA": {"hours": 18, "milliseconds": 586, "minutes": 42, "seconds": 53}, "dec": -0.40269068182927403, "ra": -1.3836398418471454})
      expect(sun.position.lightTime).toEqual(8.178122476657716)

      expect(sun.position.constellation).toEqual(77);
      expect(constellation.constel[77]).toEqual("Sgr Sagittarii");

    })

    it('calculates the Moon', () => {
      const moon = ephemeris.CalculateBody('moon')
      expect(moon.position.apparentLongitudeString).toEqual("217°17'3\"")
      expect(moon.position.apparentLongitude).toEqual(217.28435008107076)

      expect(moon.position.Semidiameter.seconds).toEqual(54.08744547118285)

      expect(moon.position.nutation.dRA).toEqual(-0.8377353595241296);
    	expect(moon.position.nutation.dDec).toEqual(7.884225007355425);

    	expect(moon.position.geometric.longitude).toEqual(-142.71159465087155);
    	expect(moon.position.geometric.latitude).toEqual(5.23132586086829);
    	expect(moon.position.geometric.distance).toEqual(0.15355593511588272);

    	expect(moon.position.apparentGeocentric.longitude).toEqual(3.7923273219706926);
    	expect(moon.position.apparentGeocentric.latitude).toEqual(0.09130386051687844);
    	expect(moon.position.apparentGeocentric.distance).toEqual(62.86016884434851);

    	expect(moon.position.dHorizontalParallax).toEqual(0.015908996146907033);

    	expect(moon.position.sunElongation).toEqual(62.70937512973823);
    	expect(moon.position.illuminatedFraction).toEqual(0.2718262029195282);

    	expect(moon.position.apparent.dRA).toEqual(3.7814473341623236);
    	expect(moon.position.apparent.dDec).toEqual(-0.15693166256853608);

    	expect(moon.position.altaz.diurnalAberation.ra).toEqual(3.781446167769749);
    	expect(moon.position.altaz.diurnalAberation.dec).toEqual(-0.15693168722230524);

    	expect(moon.position.altaz.diurnalParallax.ra).toEqual( 3.779823523994774);
    	expect(moon.position.altaz.diurnalParallax.dec).toEqual(-0.1652988947491685);

    	expect(moon.position.altaz.atmosphericRefraction.deg).toEqual(0);
    	expect(moon.position.altaz.atmosphericRefraction.dRA).toEqual(0);
    	expect(moon.position.altaz.atmosphericRefraction.dDec).toEqual(-5.7249984266343304e-11);

    	expect(moon.position.altaz.topocentric.altitude).toEqual(-57.38373112405539);
    	expect(moon.position.altaz.topocentric.ra).toEqual(-2.503361783184812);
    	expect(moon.position.altaz.topocentric.dec).toEqual(-0.16529889474916878);
    	expect(moon.position.altaz.topocentric.azimuth).toEqual(345.8000378405458);

    })

    it('calculates Mercury', () => {
      const mercury = ephemeris.CalculateBody('mercury')
      expect(mercury.position.apparentLongitudeString).toEqual("271°6'38\"")
      expect(mercury.position.apparentLongitude).toEqual(271.1106541946031)

      expect(mercury.position.nutation.dRA).toEqual(-1.022630262554928);
    	expect(mercury.position.nutation.dDec).toEqual(5.64467600751711);

    	expect(mercury.position.deflection.lightDeflection.dDec).toEqual(-0.0019398970516879548);
    	expect(mercury.position.deflection.sunElongation).toEqual(8.79845678423601);

    	expect(mercury.position.apparentGeocentric["0"]).toEqual(4.7317735529316);
    	expect(mercury.position.apparentGeocentric["1"]).toEqual(-0.016476200621924616);
    	expect(mercury.position.apparentGeocentric["2"]).toEqual(1.413088769647956);
      expect(mercury.position.apparentGeocentric["3"]).toEqual({"degree": 271, "minutes": 6, "seconds": 38.35510057121155});
      expect(mercury.position.apparentGeocentric["4"]).toEqual({"degree": 0, "minutes": 56, "seconds": 38.46032896956956});

    	expect(mercury.position.trueGeocentricDistance).toEqual(1.4131504500560161);

    	expect(mercury.position.apparent.dRA).toEqual(4.733668496715409);
    	expect(mercury.position.apparent.dDec).toEqual(-0.42548676689441006);

    	expect(mercury.position.altaz.diurnalAberation.ra).toEqual(4.733667904366067);
    	expect(mercury.position.altaz.diurnalAberation.dec).toEqual(-0.42548719206700514);

    	expect(mercury.position.altaz.diurnalParallax.ra).toEqual( 4.733645851268264);
    	expect(mercury.position.altaz.diurnalParallax.dec).toEqual(-0.42550091675960783);

    	expect(mercury.position.altaz.atmosphericRefraction.deg).toEqual(0);
    	expect(mercury.position.altaz.atmosphericRefraction.dRA).toEqual(0);
    	expect(mercury.position.altaz.atmosphericRefraction.dDec).toEqual( -3.434999055980598e-11);

    	expect(mercury.position.altaz.topocentric.altitude).toEqual( -36.15583168793744);
    	expect(mercury.position.altaz.topocentric.ra).toEqual(-1.5495394559113222);
    	expect(mercury.position.altaz.topocentric.dec).toEqual(-0.425500916759608);
    	expect(mercury.position.altaz.topocentric.azimuth).toEqual(267.8392256448956);

      expect(mercury.position.constellation).toEqual(77);
      expect(constellation.constel[77]).toEqual("Sgr Sagittarii");
    })

    it('calculates Sirius', () => {
      const sirius = ephemeris.CalculateBody('sirius')
      expect(sirius.position.apparentLongitudeString).toEqual("101°17'23\"")
      expect(sirius.position.apparentLongitude).toEqual(1.767843531323971)

    	expect(sirius.position.deflection.lightDeflection.dDec).toEqual(0.0014984308353008266);
    	expect(sirius.position.deflection.sunElongation).toEqual(140.20814378464434);

    	expect(sirius.position.apparent.dRA).toEqual(1.767843531323971);
    	expect(sirius.position.apparent.dDec).toEqual(-0.29177988334236765);

    	expect(sirius.position.altaz.diurnalAberation.ra).toEqual(1.767843897919368);
    	expect(sirius.position.altaz.diurnalAberation.dec).toEqual(-0.2917795644637801);

    	expect(sirius.position.altaz.diurnalParallax.ra).toEqual(1.767843897919368);
    	expect(sirius.position.altaz.diurnalParallax.dec).toEqual(-0.2917795644637801);

    	expect(sirius.position.altaz.atmosphericRefraction.deg).toEqual(0.3127048123159503);
    	expect(sirius.position.altaz.atmosphericRefraction.dRA).toEqual(-56.01842214360595);
    	expect(sirius.position.altaz.atmosphericRefraction.dDec).toEqual(786.7057329096253);

    	expect(sirius.position.altaz.topocentric.altitude).toEqual(1.8540808732683018);
    	expect(sirius.position.altaz.topocentric.ra).toEqual(-4.519415183877626);
    	expect(sirius.position.altaz.topocentric.dec).toEqual(-0.2879655074405612);
    	expect(sirius.position.altaz.topocentric.azimuth).toEqual(114.02566694455601);

      expect(sirius.position.astrimetricJ2000.dRA).toEqual(1.767791005321612);
      expect(sirius.position.astrimetricJ2000.dDec).toEqual(-0.291752264892662);

    })
  })
})
