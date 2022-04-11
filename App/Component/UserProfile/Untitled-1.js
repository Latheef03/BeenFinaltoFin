              {/* <MapView.Geojson
                geojson={myPlace} // geojson of the countries you want to highlight
                strokeColor='red'
                //"#FF6D6A"
                fillColor='green'
                //"#FF6D6A"
                strokeWidth={5}
              /> */}

              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: [20.5937, 78.9629],
                  }
                }
              ]