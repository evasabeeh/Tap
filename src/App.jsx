import { useEffect, useState } from 'react';
import LocationCard from './components/LocationCard';
import { setupIdleCallback } from './utils/preload';

export default function App() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [type, setType] = useState('toilets');
  const [loading, setLoading] = useState(true);
  const [currentAddress, setCurrentAddress] = useState('');
  const [networkInfo, setNetworkInfo] = useState('');

  const fetchNearby = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/search.php?q=${type}+near+${lat},${lon}&format=jsonv2&addressdetails=1&limit=20`;
    const res = await fetch(url);
    const data = await res.json();
    setPlaces(data);
    setLoading(false);
  };

  const getAddressFromCoords = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    setCurrentAddress(data.display_name || '');
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lon: longitude });
        getAddressFromCoords(latitude, longitude);

        setupIdleCallback(() => {
          fetchNearby(latitude, longitude);
        });

        console.log('Detected coordinates:', latitude, longitude);
      },
      (err) => {
        console.error('Location error:', err);
        setLoading(false);
      }
    );
  }, [type]);

  useEffect(() => {
    const connection = navigator.connection || navigator.webkitConnection || navigator.mozConnection;

    if (connection) {
      const updateNetworkInfo = () => {
        setNetworkInfo(
          `Type: ${connection.type || 'unknown'}, Effective: ${connection.effectiveType}, Save-Data: ${connection.saveData ? 'On' : 'Off'}`
        );
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);

      return () => connection.removeEventListener('change', updateNetworkInfo);
    } else {
      setNetworkInfo('Network info unavailable');
    }
  }, []);

  return (
    <>
      <div className="max-w-full px-8 md:mx-25 mx-auto">

        <div className="text-center mb-6">
          <h1 className="mt-10 mb-5 text-4xl font-bold">Nearby Public Toilets & Water Stations</h1>
          {currentAddress && (
            <p className="text-lg text-gray-600 mb-10">Your location: {currentAddress}</p>
          )}
        </div>

        <div className="flex justify-center mb-10 gap-4">
          <button
            onClick={() => setType('toilets')}
            className={`cursor-pointer px-4 py-2 rounded-xl ${type === 'toilets' ? 'bg-[#0693e3] text-white' : ''}`}
          >
            Toilets
          </button>
          <button
            onClick={() => setType('drinking_water')}
            className={`cursor-pointer px-4 py-2 rounded-xl ${type === 'drinking_water' ? 'bg-[#0693e3] text-white' : ''}`}
          >
            Water
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading nearby locations...</p>
        ) : places.length > 0 ? (
          <div className="grid gap-4">
            {places.map((place, index) => (
              <LocationCard key={index} place={place} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No locations found nearby.</p>
        )}

        <div className="text-xl text-center text-gray-700 mt-5">
          📶 {networkInfo}
        </div>

      </div>

      {type === 'drinking_water' && (
        <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 690" xmlns="http://www.w3.org/2000/svg" class="transition duration-300 ease-in-out delay-150">

          <path d="M 0,700 L 0,131 C 39.58578792341679,165.41476435935198 79.17157584683358,199.82952871870398 149,185 C 218.82842415316642,170.17047128129602 318.89948453608247,106.09664948453607 385,112 C 451.10051546391753,117.90335051546393 483.2304860088367,193.78387334315173 532,193 C 580.7695139911633,192.21612665684827 646.1785714285713,114.76785714285715 712,105 C 777.8214285714287,95.23214285714285 844.055228276878,153.14469808541975 903,160 C 961.944771723122,166.85530191458025 1013.6005154639172,122.65335051546391 1077,100 C 1140.3994845360828,77.34664948453609 1215.5427098674522,76.2418998527246 1278,85 C 1340.4572901325478,93.7581001472754 1390.2286450662739,112.3790500736377 1440,131 L 1440,700 L 0,700 Z" stroke="none" stroke-width="0" fill="#0693e3" fill-opacity="0.4" class="transition-all duration-300 ease-in-out delay-150 path-0"></path>

          <path d="M 0,700 L 0,306 C 40.81167157584683,308.3008100147275 81.62334315169366,310.6016200294551 146,321 C 210.37665684830634,331.3983799705449 298.3182989690722,349.8943298969072 366,346 C 433.6817010309278,342.1056701030928 481.1034609720175,315.8210603829161 536,306 C 590.8965390279825,296.1789396170839 653.2678571428572,302.82142857142856 716,312 C 778.7321428571428,321.17857142857144 841.8251104565538,332.89322533136965 897,337 C 952.1748895434462,341.10677466863035 999.4317010309278,337.6056701030928 1062,338 C 1124.5682989690722,338.3943298969072 1202.448085419735,342.6840942562592 1268,338 C 1333.551914580265,333.3159057437408 1386.7759572901325,319.6579528718704 1440,306 L 1440,700 L 0,700 Z" stroke="none" stroke-width="0" fill="#0693e3" fill-opacity="0.53" class="transition-all duration-300 ease-in-out delay-150 path-1"></path>

          <path d="M 0,700 L 0,481 C 66.8687407952872,505.0557805596465 133.7374815905744,529.111561119293 187,533 C 240.2625184094256,536.888438880707 279.9188144329897,520.6095360824742 343,525 C 406.0811855670103,529.3904639175258 492.5872606774668,554.4502945508101 552,541 C 611.4127393225332,527.5497054491899 643.7321428571429,475.58928571428567 708,440 C 772.2678571428571,404.41071428571433 868.4841678939617,385.1925625920472 927,419 C 985.5158321060383,452.8074374079528 1006.3311855670102,539.6404639175258 1055,540 C 1103.6688144329898,540.3595360824742 1180.1910898379972,454.24558173784976 1249,430 C 1317.8089101620028,405.75441826215024 1378.9044550810013,443.3772091310751 1440,481 L 1440,700 L 0,700 Z" stroke="none" stroke-width="0" fill="#0693e3" fill-opacity="1" class="transition-all duration-300 ease-in-out delay-150 path-2"></path>
        </svg>
      )}

      {type === 'toilets' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#8A0000" fill-opacity="1" d="M0,160L0,192L288,192L288,288L576,288L576,96L864,96L864,224L1152,224L1152,160L1440,160L1440,320L1152,320L1152,320L864,320L864,320L576,320L576,320L288,320L288,320L0,320L0,320Z"></path></svg>
      )}
      
    </>
  );
}

