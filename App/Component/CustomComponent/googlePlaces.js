import React, { Component } from 'react';
import { Image, Text ,View , StatusBar ,TouchableOpacity, Platform,StatusBarIOS} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {deviceHeight as dh , deviceWidth as dw} from '../_utils/CommonUtils';
import {Username} from '../../Assets/Colors/Common_Color';
 
export default class Gplaces extends Component {

    static navigationOptions = {
      header: null
    }

    _handlePress = (data,details) =>{
      console.log('the datas',data,'--the details',details);
      let addr = details.formatted_address.split(', ');
      let locName = data ? data.structured_formatting.main_text : null,
       counName = addr[addr.length - 1];
      let lat = details.geometry ? details.geometry.location.lat : 0,
      lng = details.geometry ? details.geometry.location.lng : 0;
      var geom = {
       latitude: lat,
       longitude: lng
      }
      console.log('the geom is ', geom);

      let data_id = '', place_id = '';

      if (data) {
        data_id = data.id;
        place_id = data.place_id
      }
      
    const datas = {
        coords: geom,
        name : details.name,
        Country: counName,
        data_id: data_id,
        place_id: place_id,
        f_address: data ? data.structured_formatting.main_text + ', ' +
        data.structured_formatting.secondary_text : null
      }

      // this.props.navigation.navigate('Camera',{datas:datas})
      this.props.navigation.navigate('ImageEditor',{datas:datas})
      

      // console.log('---------------------------')
      // console.log('customize datas',datas);

    }

 render(){
  return (
    <View style={{marginTop:Platform.OS === 'ios' ? StatusBar.currentHeight : StatusBar.currentHeight + 10 ,width : dw ,height: dh ,flexDirection:'row',
      backgroundColor:'#fff'}}
     >
      <StatusBar backgroundColor='#fff' barStyle='dark-content' />
      <View style={{width : dw * .8,}}>
      <GooglePlacesAutocomplete
        placeholder='Search'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
        listViewDisplayed={false}    // true/false/undefined
        fetchDetails={true}
        renderDescription={row => row.description} // custom description render
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          // console.log(data, details);
          this._handlePress(data,details);
        }}
  
        getDefaultValue={() => ''}
  
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20',
          //our Key (Been) => AIzaSyBzdu9YvfrtP0KCeCfojy2dnB6qOfc3z20
          //git key (Uber clone) => AIzaSyB1O8amubeMkw_7ok2jUhtVj9IkME9K8sc
          language: 'en', // language of the results
          types: '' // default: 'geocode' || ,cities
        }}
  
        styles={searchInputStyle}
  
        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance,keyword,name', //distance
          type: 'cafe' //cafe
        }}
        
        GooglePlacesDetailsQuery={{
          // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
          fields: 'formatted_address,name,geometry',
        }}
  
        filterReverseGeocodingByTypes={['country','locality', 
        'street_address','food','address',
        'administrative_area_level_1','administrative_area_level_2','administrative_area_level_3','geometry']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        // predefinedPlaces={[homePlace, workPlace]}
  
        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        enablePoweredByContainer={false}
      />
    </View>
    <TouchableOpacity activeOpacity={0.8} onPress={()=>this.props.navigation.goBack()}>
     <View style={{width : dw * .20,height: dh * .08,justifyContent: 'center',}}>
          <Text style={{textAlign:'center',fontSize: Username.FontSize, fontFamily: Username.Font,}}>
            Cancel
          </Text>
     </View>
     </TouchableOpacity>
    </View>
    );
  }
}

const searchInputStyle = {
  textInputContainer: {
      width: '94%',
      backgroundColor: 'rgba(0,0,0,0)',
      borderWidth: .7,
      borderColor: '#000',
      margin: 10,
      borderRadius: 10,
  },
  description: {
      fontWeight: 'bold',
      color: "#4c4c4c",
  },
  predefinedPlacesDescription: {
      color: '#1faadb'
  },
  textInput: {
      // backgroundColor:'#c1c1c1',
      height: 33,
      fontSize: 14,
      paddingLeft: 0,

  }
}
// renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
// renderRightButton={() => <Text>Custom text after the input</Text>}