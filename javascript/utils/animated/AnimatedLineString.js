import { Animated } from 'react-native';

// Used react-native-maps as a reference
// https://github.com/react-community/react-native-maps/blob/master/lib/components/AnimatedRegion.js
const AnimatedWithChildren = Object.getPrototypeOf(Animated.ValueXY);

import AnimatedCoordinates from './AnimatedCoordinates';

const DEFAULT_COORD = [0, 0];

const DEFAULT_LINE = {
  type: 'LineString',
  coordinates: [DEFAULT_COORD, DEFAULT_COORD]
};

export class AnimatedLineString extends AnimatedWithChildren {
  constructor(line = DEFAULT_LINE) {
    super();

    this.coordinates = line.coordinates.map(
      coord => new AnimatedCoordinates(coord),
    );

    this._listeners = {};
  }

  setValue(line = DEFAULT_LINE) {
    // TODO
    console.log("SetValue", line);
    this.coordinates.setValue(point.coordinates);
  }

  setOffset(line = DEFAULT_LINE) {
    // TODO
    this.coordinates.setOffset(point.coordinates);
  }

  flattenOffset() {
    this.coordinates.forEach((coord) => {
      coord.flattenOffset();
    });
  }

  stopAnimation(cb) {
    this.coordinates.forEach((coord) => {
      coord.stopAnimation();
    });

    if (typeof cb === 'function') {
      cb(this.__getValue());
    }
  }

  addListener(cb) {
    this.coordinates.forEach((coord) => {
      coord.addListener(cb);
    });
  }

  removeListener(id) {
    this.coordinates.forEach((coord) => {
      coord.removeListener(id);
    });
  }

  spring(config = { coordinates: DEFAULT_COORD }) {
    // TODO
    return Animated.parallel(
      this.coordinates.map((coord) => {
        return coord.spring(config);
      })
    );
  }

  timing(config = { coordinates: DEFAULT_COORD }) {
    let {coordinates} = config;
    if (config.coordinates.length > this.coordinates.length) {
      const lastCoord = this.coordinates[this.coordinates.length - 1];
      while (this.coordinates.length < coordinates.length) {
        this.coordinates.push(lastCoord.clone());
      }
    } else if (coordinates.length < this.coordinates.length) {
      coordinates = [...coordinates];
      const lastCoordinate = coordinates[coordinates.length - 1];
      while (coordinates.length < this.coordinates.length) {
        coordinates.push([...lastCoordinate]);
      }
    }

    return Animated.parallel(
      this.coordinates.map((coord, i) =>
        coord.timing({
          ...config,
          coordinates: coordinates[i],
        })
      ),
    );
  }

  __getValue() {
    return {
      type: 'LineString',
      coordinates: this.coordinates.map((coord) => coord.__getValue())
    };
  }

  __attach() {
    const self = this;
    this.coordinates.forEach((coord) => coord.__attach(self));
  }

  __detach() {
    const self = this;
    this.coordinates.forEach((coord) => coord.__detach(self));
  }
}

export default AnimatedLineString;