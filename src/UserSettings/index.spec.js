import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserSettings from './index';

describe('<UserSettings />', () => {
  it('should render', () => {
    render(<UserSettings />);
    expect(screen.getByRole('form')).toBeInTheDocument();
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
    expect(screen.getByRole('checkbox', { name: 'Foo' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Bar' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Baz' })).not.toBeChecked();
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
    expect(checkbox).not.toBeChecked();
    // Check the checkbox
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
  it("saves the user's settings on submit", async () => {
    const user = userEvent.setup();
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

    await user.click(screen.getByRole('checkbox', { name: 'Baz' }));
    // 1 and 3 are checked
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledWith(['1', '3']);
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

    user.click(screen.getByRole('button', { name: 'Save' }));

    await screen.findByText('Saving...');
    await screen.findByText('Save');
  });
});
