import React from 'react';
import { RobotSummaryState } from '../../lib';
import { render } from '@testing-library/react';
import { robotSummary } from './test.utils';

it('smoke test', () => {
  render(
    <RobotSummaryState item={'robot'} robotSummary={robotSummary} onClick={jasmine.createSpy()} />,
  );
});