import React from 'react';
import { shallow } from 'enzyme';
import UserSettings from './index';

function setup({
  options = [
    { id: '1', name: 'Foo' },
    { id: '2', name: 'Bar' },
    { id: '3', name: 'Baz' }
  ],
  ...rest
} = {}) {
  return shallow(<UserSettings options={options} {...rest} />);
}

describe('<UserSettings />', () => {
  it('should render', () => {
    const wrapper = shallow(<UserSettings />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders a list of settings', () => {
    const wrapper = setup();
    const items = wrapper.find('label');
    // Renders a label for each item
    expect(items.length).toBe(3);

    // Renders the correct value for each item
    expect(items.at(0).find('[type="checkbox"]').prop('value')).toEqual('1');
    expect(items.at(0).text()).toEqual('Foo');

    expect(items.at(1).find('[type="checkbox"]').prop('value')).toEqual('2');
    expect(items.at(1).text()).toEqual('Bar');

    expect(items.at(2).find('[type="checkbox"]').prop('value')).toEqual('3');
    expect(items.at(2).text()).toEqual('Baz');
  });

  it('shows the user their saved settings', () => {
    const savedUserPrefs = ['2', '3'];
    const wrapper = setup({ savedUserPrefs });
    const checkboxes = wrapper.find('input[type="checkbox"]');

    expect(checkboxes.at(0).prop('checked')).toEqual(false);
    expect(checkboxes.at(1).prop('checked')).toEqual(true);
    expect(checkboxes.at(2).prop('checked')).toEqual(true);
  });

  it('updates the selection when a checkbox is clicked', () => {
    const savedUserPrefs = [];
    const wrapper = setup({ savedUserPrefs });

    expect(
      wrapper.find('input[type="checkbox"][value="1"]').prop('checked')
    ).toEqual(false);

    // Check the first item
    wrapper.find('input[type="checkbox"][value="1"]').simulate('change', {
      target: {
        value: '1',
        checked: true
      }
    });

    expect(
      wrapper.find('input[type="checkbox"][value="1"]').prop('checked')
    ).toEqual(true);
  });

  it("saves the user's settings on submit", () => {
    const savedUserPrefs = ['1'];
    const onSave = jest.fn().mockResolvedValue(true);
    const wrapper = setup({ savedUserPrefs, onSave });

    wrapper.find('input[type="checkbox"][value="3"]').simulate('change', {
      target: {
        value: '3',
        checked: true
      }
    });
    // 1 and 3 are checked
    wrapper.find('form').simulate('submit', {
      preventDefault: jest.fn()
    });
    expect(onSave).toHaveBeenCalledWith(['1', '3']);
  });

  it('shows a saving message', async () => {
    const savedUserPrefs = [];
    const onSave = jest.fn().mockResolvedValue(true);
    const wrapper = setup({ savedUserPrefs, onSave });

    expect(wrapper.find('button').text()).toEqual('Save');

    wrapper.find('form').simulate('submit', {
      preventDefault: jest.fn()
    });

    expect(wrapper.find('button').text()).toEqual('Saving...');

    // Flush promise queue
    await Promise.resolve();

    expect(wrapper.find('button').text()).toEqual('Save');
  });
});
