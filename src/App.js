import * as React from 'react';
import { createRoot } from 'react-dom/client';
import UserSettings from './UserSettings';

const ACCOUNT_OPTIONS = [
  {
    id: '1',
    name: 'Foo'
  },
  {
    id: '2',
    name: 'Bar'
  },
  {
    id: '3',
    name: 'Baz'
  }
];

const USER = {
  preferences: ['2', '3']
};

const updateUser = (options) => {
  console.log(options);
  const p = new Promise((resolve) => {
    window.setTimeout(() => {
      resolve();
    }, 1000);
  });
  return p;
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <div className="App">
    <UserSettings
      options={ACCOUNT_OPTIONS}
      savedUserPrefs={USER.preferences}
      onSave={updateUser}
    />
  </div>
);
