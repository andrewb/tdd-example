/* eslint-disable react/prop-types*/
import React, { useState } from 'react';

function UserSettings({ options, savedUserPrefs, onSave }) {
  const [checked, setChecked] = useState(savedUserPrefs);
  const [isSaving, setIsSaving] = useState(false);
  const handleCheckboxChange = (e) => {
    const set = new Set(checked);
    if (e.target.checked) {
      set.add(e.target.value);
    } else {
      set.delete(e.target.value);
    }
    setChecked([...set]);
  };
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    onSave(checked).then(() => {
      setIsSaving(false);
    });
  };
  return (
    <form
      data-testid="user-settings"
      className="UserSettings"
      onSubmit={handleSave}
    >
      {options.map((o) => (
        <label data-testid="option" key={o.id}>
          <input
            name={o.id}
            type="checkbox"
            value={o.id}
            checked={checked.includes(o.id)}
            onChange={handleCheckboxChange}
          />
          <span>{o.name}</span>
        </label>
      ))}
      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

UserSettings.defaultProps = {
  options: [],
  savedUserPrefs: [],
  onSave: () => {}
};

export default UserSettings;
