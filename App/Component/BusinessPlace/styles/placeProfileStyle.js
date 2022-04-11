
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const styles = {
    back_icon:{width:wp('4%'),height:hp('4%')},
    Body:{textAlign:'center',color:'#a4a4a4',marginLeft:wp('20%')},
    headericon:{width: wp(7), height: hp(4), marginLeft: 'auto', marginRight: 'auto',},
    flyit:{color:'#3b9fe8',fontFamily:'OpenSans-Italic',fontSize:16},
    headerText: { marginTop: hp('2%'), color: '#cacaca', fontSize: 14, marginLeft: wp('2%') },
    badgeView: { width: wp('100%'), height: hp('22%'), marginTop: hp('2%'), borderRadius: 20, flexDirection: 'row' },
    imageView: { width: wp('22%'), height: hp('13%'), justifyContent: 'space-between', marginTop: wp('5%') },
    text2: { width: wp('22%'), height: hp('13%'), marginTop: wp('10%'), justifyContent: 'center', alignItems: 'center', },
    text3: { width: wp('22%'), height: hp('13%'), marginTop: wp('10%'), justifyContent: 'center', alignItems: 'center'},
    BuPlMap: { textAlign: "center", width: wp('95%') },
    BuPlMap1: { textAlign: "center", color: '#ebebeb' },
    card: {
        width: '95%', height: hp('70%'), borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: hp('2%'),
        marginBottom: hp(1.3),
        backgroundColor: '#fff',
    },
    cardView: { width: '90%', marginLeft: 'auto', marginRight: 'auto', },
    locationView: { marginTop: '2%', width: wp('70%'), },
    locationViewText: { color: '#888888', fontSize: 16 },
    threeDotsImage: { width: wp(6.5), height: hp(2.5), marginLeft: 'auto', marginRight: 'auto', marginTop: '10%' },
    barChartImage: { width: wp(7), height: hp(4), marginLeft: 'auto', marginRight: 'auto', marginTop: '10%' },
    postImage: { width: '100%', height: hp('35%'), marginTop: '2%' },
    cameraImage: { width: wp(10), height: hp(4), marginTop: '7%' },
    profileImage: { width: 25, height: 25, borderRadius: 50 },
    userName: { width: '80%', marginLeft: '5%', marginTop: 5, color: '#000' },
    description: { width: '80%', height: 70, marginTop: '10%', },
    likeicon: { width: wp(5), height: hp(3), },
    commentIcon: { width: wp(5), height: hp(3), marginTop: '20%' },
    bookmarkIcon: { width: wp(4.5), height: hp(3), marginTop: '20%', },
    textCount: { fontSize: 10, textAlign: 'center' },
    headerStyle:{ width: wp('100%'), height: hp('8%'), backgroundColor: '#fff', },
    mapView : { backgroundColor:'#c1c1c1',width:wp('90%'),height:hp('12%'),alignSelf:'center'
    ,marginTop:20,marginBottom:20,borderRadius:20,overflow: 'hidden', },
    mapStyle : [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#bddfff"
            }
          ]
        },
        {
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#bddfff"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "saturation": -15
            },
            {
              "lightness": -5
            },
            {
              "weight": 0.5
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#fdd9fb"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#bddfff"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#bddfff"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c9c9c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            },
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
};


export default (styles);