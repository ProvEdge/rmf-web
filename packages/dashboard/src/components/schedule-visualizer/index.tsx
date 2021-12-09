/* istanbul ignore file */

import { BuildingMap, Dispenser, DoorState, FleetState, Ingestor, LiftState } from 'api-client';
import Debug from 'debug';
import * as L from 'leaflet';
import React from 'react';
import {
  affineImageBounds,
  AffineImageOverlay,
  ColorManager,
  DoorsOverlay as DoorsOverlay_,
  LiftsOverlay as LiftsOverlay_,
  LMap,
  loadAffineImage,
  RobotData,
  RobotsOverlay as RobotsOverlay_,
  TrajectoriesOverlay as TrajectoriesOverlay_,
  TrajectoryData,
  useAsync,
  WaypointsOverlay as WaypointsOverlay_,
  WorkcellData,
  WorkcellsOverlay as WorkcellsOverlay_,
} from 'react-components';
import { AttributionControl, LayersControl } from 'react-leaflet';
import { Level, RobotState } from 'rmf-models';
import appConfig from '../../app-config';
import { NegotiationTrajectoryResponse } from '../../managers/negotiation-status-manager';
import { ResourcesContext } from '../app-contexts';
import { PlacesContext, RmfIngressContext } from '../rmf-app';
import { LeafletContextInterface } from '@react-leaflet/core';

const DoorsOverlay = React.memo(DoorsOverlay_);
const LiftsOverlay = React.memo(LiftsOverlay_);
const RobotsOverlay = React.memo(RobotsOverlay_);
const TrajectoriesOverlay = React.memo(TrajectoriesOverlay_);
const WaypointsOverlay = React.memo(WaypointsOverlay_);
const WorkcellsOverlay = React.memo(WorkcellsOverlay_);

const debug = Debug('ScheduleVisualizer');
const TrajectoryUpdateInterval = 2000;
// schedule visualizer manages it's own settings so that it doesn't cause a re-render
// of the whole app when it changes.
const SettingsKey = 'scheduleVisualizerSettings';
const colorManager = new ColorManager();

export interface ScheduleVisualizerProps extends React.PropsWithChildren<{}> {
  buildingMap: BuildingMap;
  negotiationTrajStore?: Record<string, NegotiationTrajectoryResponse>;
  dispensers?: Dispenser[];
  ingestors?: Ingestor[];
  doorStates?: Record<string, DoorState>;
  liftStates?: Record<string, LiftState>;
  fleetStates?: Record<string, FleetState>;
  /**
   * default: 'normal'
   */
  mode?: 'normal' | 'negotiation';
  zoom?: number | undefined;
  onDoorClick?: (ev: React.MouseEvent, door: string) => void;
  onLiftClick?: (ev: React.MouseEvent, lift: string) => void;
  onRobotClick?: (ev: React.MouseEvent, fleet: string, robot: string) => void;
  onDispenserClick?: (ev: React.MouseEvent, guid: string) => void;
  onIngestorClick?: (ev: React.MouseEvent, guid: string) => void;
  setLeafletMap?: React.Dispatch<React.SetStateAction<LeafletContextInterface>>;
  leafletMap?: LeafletContextInterface;
}

interface ScheduleVisualizerSettings {
  trajectoryTime: number;
}

export default React.forwardRef(function ScheduleVisualizer({
  buildingMap,
  negotiationTrajStore = {},
  dispensers = [],
  ingestors = [],
  doorStates = {},
  liftStates = {},
  fleetStates = {},
  mode = 'normal',
  onDoorClick,
  onLiftClick,
  onRobotClick,
  onDispenserClick,
  onIngestorClick,
  setLeafletMap,
  leafletMap,
  children,
}: ScheduleVisualizerProps): JSX.Element | null {
  debug('render');
  const safeAsync = useAsync();
  const levels = React.useMemo(
    () => [...buildingMap.levels].sort((a, b) => a.name.localeCompare(b.name)),
    [buildingMap],
  );
  const [currentLevel, setCurrentLevel] = React.useState(levels[0]);
  const [images, setImages] = React.useState<Record<string, HTMLImageElement>>({});
  const [levelBounds, setLevelBounds] = React.useState<Record<string, L.LatLngBoundsExpression>>(
    {},
  );
  const bounds = React.useMemo(() => levelBounds[currentLevel.name], [levelBounds, currentLevel]);
  const [robots, setRobots] = React.useState<RobotData[]>([]);
  const { current: robotsStore } = React.useRef<Record<string, RobotData>>({});
  // FIXME: trajectory manager should handle the tokens
  const authenticator = appConfig.authenticator;
  const [trajectories, setTrajectories] = React.useState<TrajectoryData[]>([]);
  const { trajectoryManager: trajManager } = React.useContext(RmfIngressContext) || {};
  const [
    scheduleVisualizerSettings,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setScheduleVisualizerSettings,
  ] = React.useState<ScheduleVisualizerSettings>(() => {
    const settings = window.localStorage.getItem(SettingsKey);
    return settings ? JSON.parse(settings) : { trajectoryTime: 60000 /* 1 min */ };
  });
  const trajectoryTime = scheduleVisualizerSettings.trajectoryTime;
  const trajectoryAnimScale = trajectoryTime / (0.9 * TrajectoryUpdateInterval);

  const negoTrajectories = React.useMemo<TrajectoryData[]>(() => {
    if (mode !== 'negotiation') return [];
    const negoTrajs = negotiationTrajStore[currentLevel.name];
    return negoTrajs
      ? negoTrajs.values.map((v) => ({
          trajectory: v,
          color: 'orange',
          animationScale: trajectoryAnimScale,
          loopAnimation: false,
          conflict: false,
        }))
      : [];
  }, [mode, negotiationTrajStore, currentLevel, trajectoryAnimScale]);

  const renderedTrajectories = React.useMemo(() => {
    switch (mode) {
      case 'normal':
        return trajectories;
      case 'negotiation':
        return negoTrajectories;
    }
  }, [mode, trajectories, negoTrajectories]);

  React.useEffect(() => {
    let interval: number;
    let cancel = false;

    if (mode !== 'normal') return;

    const updateTrajectory = async () => {
      debug('updating trajectories');

      if (cancel || !trajManager) return;

      const resp = await trajManager.latestTrajectory({
        request: 'trajectory',
        param: {
          map_name: currentLevel.name,
          duration: trajectoryTime,
          trim: true,
        },
        token: authenticator.token,
      });
      const flatConflicts = resp.conflicts.flatMap((c) => c);

      debug('set trajectories');
      setTrajectories(
        resp.values.map((v) => ({
          trajectory: v,
          color: 'green',
          conflict: flatConflicts.includes(v.id),
          animationScale: trajectoryAnimScale,
          loopAnimation: false,
        })),
      );
    };

    updateTrajectory();
    interval = window.setInterval(updateTrajectory, TrajectoryUpdateInterval);
    debug(`created trajectory update interval ${interval}`);

    return () => {
      cancel = true;
      clearInterval(interval);
      debug(`cleared interval ${interval}`);
    };
  }, [trajManager, currentLevel, trajectoryTime, mode, authenticator.token, trajectoryAnimScale]);

  const resourceManager = React.useContext(ResourcesContext);

  const [dispensersData, setDispensersData] = React.useState<WorkcellData[]>([]);
  React.useEffect(() => {
    const dispenserManager = resourceManager?.dispensers;
    if (!dispenserManager) return;
    (async () => {
      const dispenserResources = dispenserManager.dispensers;
      const availableData = dispensers.filter(
        (wc) =>
          wc.guid in dispenserResources &&
          dispenserResources[wc.guid].location.level_name === currentLevel.name,
      );
      const promises = availableData.map((wc) => dispenserManager.getIconPath(wc.guid));
      const icons = await safeAsync(Promise.all(promises));
      setDispensersData(
        availableData.map((wc, i) => ({
          guid: wc.guid,
          location: [
            dispenserResources[wc.guid].location.x,
            dispenserResources[wc.guid].location.y,
          ],
          iconPath: icons[i] || undefined,
        })),
      );
    })();
  }, [safeAsync, resourceManager?.dispensers, dispensers, currentLevel.name]);

  const [ingestorsData, setIngestorsData] = React.useState<WorkcellData[]>([]);
  React.useEffect(() => {
    const dispenserManager = resourceManager?.dispensers;
    if (!dispenserManager) return;
    (async () => {
      const dispenserResources = dispenserManager.dispensers;
      const availableData = ingestors.filter(
        (wc) =>
          wc.guid in dispenserResources &&
          dispenserResources[wc.guid].location.level_name === currentLevel.name,
      );
      const promises = availableData.map((wc) => dispenserManager.getIconPath(wc.guid));
      const icons = await safeAsync(Promise.all(promises));
      setIngestorsData(
        availableData.map((wc, i) => ({
          guid: wc.guid,
          location: [
            dispenserResources[wc.guid].location.x,
            dispenserResources[wc.guid].location.y,
          ],
          iconPath: icons[i] || undefined,
        })),
      );
    })();
  }, [safeAsync, resourceManager?.dispensers, ingestors, currentLevel]);

  const places = React.useContext(PlacesContext);
  const waypoints = React.useMemo(
    () => places.filter((p) => p.level === currentLevel.name && p.vertex.name.length > 0),
    [places, currentLevel],
  );

  React.useEffect(() => {
    (async () => {
      const promises = Object.values(fleetStates).flatMap((fleetState) =>
        fleetState.robots.map(async (r: RobotState) => {
          const robotId = `${fleetState.name}/${r.name}`;
          if (robotId in robotsStore) return;
          robotsStore[robotId] = {
            fleet: fleetState.name,
            name: r.name,
            model: r.model,
            footprint: 0.5,
            color: await colorManager.robotPrimaryColor(fleetState.name, r.name, r.model),
            iconPath:
              (await resourceManager?.robots.getIconPath(fleetState.name, r.model)) || undefined,
          };
        }),
      );
      await safeAsync(Promise.all(promises));
      const newRobots = Object.values(fleetStates).flatMap((fleetState) =>
        fleetState.robots
          .filter(
            (r: RobotState) =>
              r.location.level_name === currentLevel.name &&
              `${fleetState.name}/${r.name}` in robotsStore,
          )
          .map((r: RobotState) => robotsStore[`${fleetState.name}/${r.name}`]),
      );
      setRobots(newRobots);
    })();
  }, [safeAsync, fleetStates, robotsStore, resourceManager, currentLevel]);

  React.useEffect(() => {
    (async () => {
      const images = await safeAsync(Promise.all(levels.map((l) => loadAffineImage(l.images[0]))));
      setImages(
        levels.reduce((acc, l, idx) => {
          acc[l.name] = images[idx];
          return acc;
        }, {} as Record<string, HTMLImageElement>),
      );
    })();
  }, [levels, safeAsync]);

  React.useEffect(() => {
    const bounds = levels.reduce((acc, l) => {
      const imageEl = images[l.name];
      if (!imageEl) return acc;
      acc[l.name] = affineImageBounds(l.images[0], imageEl.naturalWidth, imageEl.naturalHeight);
      return acc;
    }, {} as Record<string, L.LatLngBoundsExpression>);
    setLevelBounds(bounds);
  }, [images, levels]);

  const [layersUnChecked, setLayersUnChecked] = React.useState<Record<string, boolean>>({
    Waypoints: true,
    Dispensers: true,
    Ingestors: true,
    Robots: true,
    Trajectories: true,
    Lifts: true,
    Doors: true,
  });

  const baseLayerHandler = (levelName: string): L.LeafletEventHandlerFnMap | undefined => {
    return {
      add: () => setCurrentLevel(levels.find((l) => l.name === levelName) || levels[0]),
      remove: () => setCurrentLevel(levels.find((l) => l.name === levelName) || levels[0]),
    };
  };

  const overlayHandler = (overlayName: string): L.LeafletEventHandlerFnMap | undefined => {
    return {
      add: () => setLayersUnChecked((prev) => ({ ...prev, [overlayName]: true })),
      remove: () => setLayersUnChecked((prev) => ({ ...prev, [overlayName]: false })),
    };
  };

  return bounds ? (
    <LMap
      id="schedule-visualizer"
      attributionControl={false}
      minZoom={0}
      maxZoom={8}
      zoomDelta={0.5}
      zoomSnap={0.5}
      bounds={bounds}
      setLeafletMap={setLeafletMap}
      leafletMap={leafletMap}
    >
      <AttributionControl position="bottomright" prefix="OSRC-SG" />
      <LayersControl position="topleft">
        {buildingMap.levels.map((level: Level) => (
          <LayersControl.BaseLayer
            key={level.name}
            name={level.name}
            checked={currentLevel === level}
          >
            <AffineImageOverlay
              bounds={levelBounds[level.name]}
              image={level.images[0]}
              eventHandlers={baseLayerHandler(level.name)}
            />
          </LayersControl.BaseLayer>
        ))}
        <LayersControl.Overlay name="Waypoints" checked={layersUnChecked['Waypoints']}>
          <WaypointsOverlay
            bounds={bounds}
            waypoints={waypoints}
            hideLabels={layersUnChecked['Waypoints']}
            eventHandlers={overlayHandler('Waypoints')}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Dispensers" checked={layersUnChecked['Dispensers']}>
          <WorkcellsOverlay
            bounds={bounds}
            workcells={dispensersData}
            hideLabels={layersUnChecked['Dispensers']}
            onWorkcellClick={onDispenserClick}
            eventHandlers={overlayHandler('Workcells')}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Ingestors" checked={layersUnChecked['Ingestors']}>
          <WorkcellsOverlay
            bounds={bounds}
            workcells={ingestorsData}
            hideLabels={layersUnChecked['Ingestors']}
            onWorkcellClick={onIngestorClick}
            eventHandlers={overlayHandler('Ingestors')}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Lifts" checked={layersUnChecked['Lifts']}>
          <LiftsOverlay
            bounds={bounds}
            currentLevel={currentLevel.name}
            lifts={buildingMap.lifts}
            liftStates={liftStates}
            hideLabels={layersUnChecked['Lifts']}
            onLiftClick={onLiftClick}
            eventHandlers={overlayHandler('Lifts')}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Doors" checked={layersUnChecked['Doors']}>
          <DoorsOverlay
            bounds={bounds}
            doors={currentLevel.doors}
            doorStates={doorStates}
            hideLabels={layersUnChecked['Doors']}
            onDoorClick={onDoorClick}
            eventHandlers={overlayHandler('Doors')}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Trajectories" checked={layersUnChecked['Trajectories']}>
          <TrajectoriesOverlay
            bounds={bounds}
            trajectoriesData={renderedTrajectories}
            eventHandlers={overlayHandler('Trajectories')}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Robots" checked={layersUnChecked['Robots']}>
          <RobotsOverlay
            bounds={bounds}
            robots={robots}
            getRobotState={(fleet, robot) => {
              const state = fleetStates[fleet].robots.find((r: RobotState) => r.name === robot);
              return state || null;
            }}
            hideLabels={layersUnChecked['Robots']}
            onRobotClick={onRobotClick}
            eventHandlers={overlayHandler('Robots')}
          />
        </LayersControl.Overlay>
      </LayersControl>
      {/*todo: Fix Trajectory Time Control component in react-components with react-leaflet v3.1.0*/}
      {/* <TrajectoryTimeControl
        position="topleft"
        value={trajectoryTime}
        min={60000}
        max={600000}
        onChange={(_ev, newValue) =>
          setScheduleVisualizerSettings((prev) => {
            const newSettings = { ...prev, trajectoryTime: newValue };
            window.localStorage.setItem(SettingsKey, JSON.stringify(newSettings));
            return newSettings;
          })
        }
      /> */}
      {children}
    </LMap>
  ) : null;
});
