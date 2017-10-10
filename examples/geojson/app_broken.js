/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
// import DeckGLOverlay from './deckgl-overlay.js';
import GeoJsonOverlay from './deckgl-overlay.js';
// import {readableInteger} from '../../utils/format-utils';

import {json as requestJson} from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Source data GeoJSON
// const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/geojson/vancouver-blocks.json'; // eslint-disable-line

const DATA_URL = 'https://raw.githubusercontent.com/neverforgit/deck_gl_projects/master/data/alameda_h2w.json';


const colorScale = r => [r * 255, 50, 255 * (1 - r)];


class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hoveredFeature: null,
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: null
    };

    requestJson(DATA_URL, (error, response) => {
      if (!error) {
        this.setState({data: response});
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  // onHover rendering of data points
  _onHover({x, y, object}) {
    this.setState({hoveredFeature: object, x, y});
  }

  _renderTooltip() {
    const {x, y, hoveredFeature} = this.state;
    return hoveredFeature && (
      <div className="tooltip" style={{top: y, left: x}}>
        <div><b>Home to Work Commute Time [min] &nbsp;</b></div>
        // <div>
          // <div>${readableInteger(hoveredFeature.properties.TotalTimeH2W)} / parcel</div>
          <div>{hoveredFeature.properties.TotalTimeH2W.toFixed(2)} </div>
          // <div>${readableInteger(hoveredFeature.properties.valuePerSqm)} / m<sup>2</sup></div>
        // </div>
        <div><b>Time in Congestion [min]</b></div>
        <div>{hoveredFeature.properties.TimeInCongestionH2W.toFixed(2)} </div>
      </div>
    );
  }

  render() {
    const {viewport, data} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>

        <DeckGLOverlay viewport={viewport}
          data={data}
          colorScale={colorScale}
          onHover={this._onHover.bind(this)} />

           
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
