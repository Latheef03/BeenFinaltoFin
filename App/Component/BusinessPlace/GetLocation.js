import React, { Component } from 'react';
import { View, Dimensions, Image, ImageBackground, StyleSheet, StatusBar, PanResponder, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dstyles } from '../Home/Styles'
import { Toolbar } from '../commoncomponent'
import { getPixels } from '../_utils/CommonUtils';
const { height, width } = Dimensions.get('window')
var setTimeOut;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 5
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const initialViewPort = [
    { latitude: 37.114508, longitude: 75.533515, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA },
    { latitude: 3.257575, longitude: 77.340507, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA },
    { latitude: 28.045189, longitude: 100.832472, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA },
    { latitude: 24.930805, longitude: 61.803493, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }
];

export default class GetLocation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            coordsGet: {},
            statusLists: '',
            move: true,
            gestureName: 'none',
            markers: [],
            mWc: initialViewPort,
            backgroundColor: 'transparent',
        }
        this.map = null
    }
    3
    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        debugger
        console.log("Get coords",this.props.route.params.data)
        const Comments = this.props.route.params.data;
        this.focusSubscription = this.props.navigation.addListener(
            "focus",
            () => {
               
                let getcoords = Comments.coords.length == 0 ? { "latitude": 0, "longitude": 0 } : Comments.coords
                let markersWithCords = [];
                markersWithCords.push({
                    latitude: getcoords.latitude,
                    longitude: getcoords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }) 

                this.setState({
                    markers: Comments.coords, 
                    mWc: markersWithCords
                }, () => {
                    this.onLayout()
                })

                console.log("getCoords from getLoc", getcoords)

            });
    }


    onLayout = () => { 
        if(this.state.mWc.length != 0 && this.map !== null){ 
          console.log('the cakks markers',this.state.mWc)
          const nextTick = new Promise(resolve => setTimeout(resolve, 0));
          nextTick.then(() => {
            setTimeOut = setTimeout(() => {
             if(this.map !== null){
              this.map.fitToCoordinates(
                this.state.mWc,
                {
                  edgePadding:
                  {
                    right: getPixels(80),
                    left: getPixels(80),
                    top: getPixels(80),
                    bottom: getPixels(80),
                  },
                  animated: true,
                });
              } 
            }, 500);
          });
          
          }
         }


    componentWillUnmount() {
        this.onLayout()
        this.map = null
        if (setTimeOut) {
            clearTimeout(setTimeOut);
        }
    }


    render() {
        const config = { velocityThreshold: 0.3, directionalOffsetThreshold: 80 };
        return (
            <View style={{ flex: 1 }} >
                <Toolbar {...this.props} />
                <StatusBar backgroundColor="#FFF" barStyle='dark-content' />
                <View style={{ height: '100%', }}>
                    <MapView
                        ref={el => (this.map = el)}
                        style={styles.map}
                        rotateEnabled={false}
                        followUserLocation={true}
                        zoomEnabled={true}
                        showsUserLocation={true}
                        showsCompass={true}
                        customMapStyle={Dstyles.mapStyle}
                        moveOnMarkerPress={true}
                        maxZoomLevel={5}
                    //onLayout={this.onLayout}
                    >

                        <MapView.Marker coordinate={this.state.markers}>
                            <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', }}>
                                <ImageBackground source={require('../../Assets/Images/locaion_marker_space.png')} style={{ width: 45, height: 45, justifyContent: 'center' }} 
                                resizeMode={'center'} 
                                >
                                   
                                </ImageBackground >
                            </View>

                        </MapView.Marker>



                    </MapView>

                </View>
            </View >)
    }
}


const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff"
    },
    mapStyle: {
        backgroundColor: "#fff"
    },
    circle: {
        width: wp('100%'),
    },
    calloutView1: { width: '100%', height: hp('20%'), flexDirection: 'row', },
    imageStyle: { height: 40, width: 40, borderRadius: 35 },
    imageStyle1: { height: 44, width: 44, borderRadius: 35 },
    subView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#b0cae0',
        height: 195,
        borderRadius: 25,
    },

})

