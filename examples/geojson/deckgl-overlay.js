import React, {Component} from 'react';
import DeckGL, {GeoJsonLayer} from 'deck.gl';

const LIGHT_SETTINGS = {
  lightsPosition: [-125, 50.5, 5000, -122.8, 48.5, 8000],
  ambientRatio: 0.2,
  diffuseRatio: 0.5,
  specularRatio: 0.3,
  lightsStrength: [1.0, 0.0, 2.0, 0.0],
  numberOfLights: 2
};

export default class DeckGLOverlay extends Component {

  static get defaultViewport() {
    return {
      // latitude: 49.254,
      // longitude: -123.13,
      // zoom: 11,
      // maxZoom: 16,
      // pitch: 45,
      // bearing: 0
      latitude: 37.775800,
      longitude: -122.170884,
      zoom: 9,
      maxZoom: 16,
      pitch: 45,
      bearing: 0
    };
  }

  render() {
    const {viewport, data, colorScale} = this.props;

    if (!data) {
      return null;
    }

    const layer = new GeoJsonLayer({
      id: 'geojson',
      data,
      opacity: 0.9,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: false,
      fp64: true,
      // getElevation: f => Math.sqrt(f.properties.valuePerSqm) * 10,
      getElevation: f => Math.pow(f.properties.TotalTimeH2W, 1.1),
      // getFillColor: f => colorScale(f.properties.growth),
      getFillColor: f => colorScale((f.properties.TotalTimeH2W - 666)/(3684 - 666)),
      getLineColor: f => [255, 255, 255],
      lightSettings: LIGHT_SETTINGS,
      pickable: Boolean(this.props.onHover),
      onHover: this.props.onHover
    });

    return (
      <DeckGL {...viewport} layers={ [layer] } initWebGLParameters />
    );
  }
}