import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserSettings from './index';

// function setup({
//   options = [
//     { id: '1', name: 'Foo' },
//     { id: '2', name: 'Bar' },
//     { id: '3', name: 'Baz' }
//   ],
//   ...rest
// } = {}) {
//   render(<UserSettings options={options} {...rest} />);
// }

describe('<UserSettings />', () => {
  it('should render', () => {
    render(<UserSettings />);
    expect(screen.getByTestId('user-settings')).toBeInTheDocument();
  });

  it('renders a list of settings', () => {
    render(
      <UserSettings
        options={[
          { id: '1', name: 'Foo' },
          { id: '2', name: 'Bar' },
          { id: '3', name: 'Baz' }
        ]}
      />
    );
    expect(screen.getAllByTestId('option')).toHaveLength(3);
    // A checkbox should be rendered for each option
    expect(screen.getByRole('checkbox', { name: 'Foo' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Bar' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Baz' })).toBeInTheDocument();
  });

  it('shows the user their saved settings', () => {
    const savedUserPrefs = ['2', '3'];
    render(
      <UserSettings
        options={[
          { id: '1', name: 'Foo' },
          { id: '2', name: 'Bar' },
          { id: '3', name: 'Baz' }
        ]}
        savedUserPrefs={savedUserPrefs}
      />
    );
    expect(screen.getByRole('checkbox', { name: 'Foo' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Bar' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Baz' })).toBeChecked();
  });

  it('updates the selection when a checkbox is clicked', async () => {
    const user = userEvent.setup();
    const savedUserPrefs = [];
    render(
      <UserSettings
        options={[
          { id: '1', name: 'Foo' },
          { id: '2', name: 'Bar' },
          { id: '3', name: 'Baz' }
        ]}
        savedUserPrefs={savedUserPrefs}
      />
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Foo' });
    // Checkbox should NOT be checked by default
    expect(checkbox).not.toBeChecked();
    // Simulate a click event
    await user.click(checkbox);
    // The checkbox should now be checked
    expect(checkbox).toBeChecked();
  });

  it("saves the user's settings on submit", async () => {
    const user = userEvent.setup();
    // Option 1 is saved
    const savedUserPrefs = ['1'];
    const onSave = jest.fn().mockResolvedValue(true);

    render(
      <UserSettings
        options={[
          { id: '1', name: 'Foo' },
          { id: '2', name: 'Bar' },
          { id: '3', name: 'Baz' }
        ]}
        savedUserPrefs={savedUserPrefs}
        onSave={onSave}
      />
    );
    // Check option 3
    user.click(screen.getByRole('checkbox', { name: 'Baz' }));
    // 1 and 3 are checked
    user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      // Save is called with the correct arguments
      expect(onSave).toHaveBeenCalledWith(['1', '3'])
    );
  });

  it('shows a saving message', async () => {
    const user = userEvent.setup();
    const savedUserPrefs = [];
    const onSave = jest.fn().mockResolvedValue(true);

    render(
      <UserSettings
        options={[
          { id: '1', name: 'Foo' },
          { id: '2', name: 'Bar' },
          { id: '3', name: 'Baz' }
        ]}
        savedUserPrefs={savedUserPrefs}
        onSave={onSave}
      />
    );
    // Click save
    user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      // Button should become disabled and show "Saving..." while `onSave` is pending
      expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
    );

    await waitFor(() =>
      // Button should become enabled after `onSave` completes
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
    );
  });
});
