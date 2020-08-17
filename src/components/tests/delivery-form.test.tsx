import { createMount } from '@material-ui/core/test-utils';
import { RobotDeliveryForm } from '../delivery-form';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import fakePlaces from '../../mock/data/places';
import React from 'react';
import { TDeliveryRequest } from '../commands-panel';

const mount = createMount();

const buildWrapper = (fleetName: string, onClick: TDeliveryRequest) => {
  const wrapper = mount(<RobotDeliveryForm requestDelivery={onClick} fleetNames={[fleetName]} />);
  return wrapper;
};

describe('Form validation', () => {
  let isRequestButtonClicked = false;
  const onClick = (
    pickupPlaceName: string,
    pickupDispenser: string,
    dropOffPlaceName: string,
    dropOffDispenser: string,
    pickupBehaviour?: RomiCore.Behavior,
    dropOffBehavior?: RomiCore.Behavior,
  ) => {
    isRequestButtonClicked = true;
  };

  beforeEach(() => {
    isRequestButtonClicked = false;
  });

  test('Initial values', () => {
    // Just places selected
    const wrapper = buildWrapper('SuperFleet', onClick);
    expect(
      wrapper.findWhere(
        x => x.name() === 'input' && x.props().value === fakePlaces()['SuperFleet'][0],
      ),
    ).toBeTruthy();

    expect(
      wrapper.findWhere(
        x => x.name() === 'input' && x.props().value === fakePlaces()['SuperFleet'][1],
      ),
    ).toBeTruthy();

    expect(
      wrapper
        .find(`#pickupDispenser`)
        .find('input')
        .props().value,
    ).toBe('');

    expect(
      wrapper
        .find(`#dropoffDispenser`)
        .find('input')
        .props().value,
    ).toBe('');

    wrapper.unmount();
  });

  test('Dispensers cannot be empty', () => {
    const wrapper = buildWrapper('FleetB', onClick);
    wrapper.find('form').simulate('submit');
    expect(wrapper.exists('#pickupDispenser-helper-text')).toBeTruthy();
    expect(wrapper.exists('#dropoffDispenser-helper-text')).toBeTruthy();
    expect(isRequestButtonClicked).toBeFalsy();
    wrapper.unmount();
  });

  test('Places cannot be empty', () => {
    const wrapper = buildWrapper('FleetA', onClick);
    wrapper.find('form').simulate('submit');
    expect(wrapper.exists('#pickupPlace-helper-text')).toBeTruthy();
    expect(isRequestButtonClicked).toBeFalsy();
    wrapper.unmount();
  });

  test('Initial values with places and with dispensers ', () => {
    const wrapper = buildWrapper('TestFleet', onClick);
    expect(wrapper.find('#robot1PickupDispenser-helper-text').exists()).toBe(false);
    expect(wrapper.find('#robot1DropoffDispenser-helper-text').exists()).toBe(false);
    wrapper.unmount();
  });

  test('Error shows with places without dispensers ', () => {
    const wrapper = buildWrapper('Fleet2', onClick);
    expect(wrapper.exists('#pickupDispenser-helper-text')).toBeTruthy();
    expect(wrapper.exists('#dropoffDispenser-helper-text')).toBeTruthy();
    wrapper.unmount();
  });

  test('Start place cannot be equal to finish place', () => {
    const wrapper = buildWrapper('FleetB', onClick);
    wrapper.find('form').simulate('submit');
    expect(wrapper.exists('#pickupPlace-helper-text')).toBeTruthy();
    expect(wrapper.exists('#dropoffPlace-helper-text')).toBeTruthy();
    expect(isRequestButtonClicked).toBeFalsy();
    wrapper.unmount();
  });
});