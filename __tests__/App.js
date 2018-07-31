import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { mapSettings } from '../src/settings';
import App from '../src/components/App';
import Google from '../src/providers/Google';
import mockedApi from '../__mocks__/google.js';

configure({ adapter: new Adapter() });

const { mapId } = mapSettings;
const provider = new Google(mapSettings);
provider.api = mockedApi;

beforeAll(() => {
  configure({ adapter: new Adapter() });
});

describe('Map', () => {
  const wrapper = mount(<App provider={provider} />);
  const form = wrapper.find('[data-role="new-marker-form"]');
  const input = wrapper.find('[data-role="new-marker-field"]');
  wrapper.setState({
    map: {
      center: {
        lat: () => 10,
        lng: () => 10,
      },
    },
  });
  it('should not adding marker if field is empty', () => {
    input.simulate('change', { target: { value: '' } });
    form.simulate('submit');
    expect(wrapper.state().markers).toHaveLength(0);
  });
  it('should adding marker', () => {
    input.simulate('change', { target: { value: 'First' } });
    form.simulate('submit');
    input.simulate('change', { target: { value: 'Second' } });
    form.simulate('submit');
    expect(wrapper.state().markers).toHaveLength(2);
  });
  it('should remove marker', () => {
    const button = wrapper.find('[data-role="remove-marker"]').first();
    button.simulate('click');
    expect(wrapper.state().markers).toHaveLength(1);
  });
  it('markers list should contain markers', () => {
    const markers = wrapper.find('[data-role="marker"]');
    expect(markers).toHaveLength(1);
  });
});
