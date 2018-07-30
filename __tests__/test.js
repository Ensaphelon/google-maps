// import { load, urlSettings } from 'google-maps-promise';
// import { mapSettings } from '../src/settings';

// it('api can be loaded', () => {
//   expect.assertions(1);
//   urlSettings.key = mapSettings.key;
//   return load().then(data => expect(data).toBeDefined());
// });

test('should call googleapi', () => {
  return googleapi.geocode({
    address: 'Parc expo, 30000 Nimes, France'
  })
    .then((response) => {
      expect(response.json.results[0].formatted_address)
        .toEqual('827 Chemin du Mas de Vignolles, 30900 Nîmes, France');
    });
});
