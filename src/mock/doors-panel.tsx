import React from 'react';
import ReactDOM from 'react-dom';
import DoorsPanel from '../components/doors-panel';
import buildingMap from './data/building-map';
import doorStates from './data/door-states';
import { FakeTransport } from './fake-transport';

(async () => {
  const bm = await buildingMap();
  const doors = bm.levels.flatMap(level => level.doors);
  const transport = new FakeTransport();

  ReactDOM.render(
    <DoorsPanel
      transport={transport}
      doors={doors}
      doorStates={doorStates}
    />,
    document.getElementById('root'),
  );
})();
