import React, { Component } from 'react';
import { View, Text, Image, StatusBar, ScrollView, StyleSheet, KeyboardAvoidingView, 
  ImageBackground, TextInput, Picker, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';
import Geojson from 'react-native-geojson';
import serviceUrl from '../../Assets/Script/Service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import businessProfileStyle from '../BusinessProfile/styles/businessProfileStyle'
const imagePath = '../../Assets/Images/'
const imagePath1 = '../../Assets/Images/BussinesIcons/'
const localProfile = '../../Assets/Images/localProfile/'
import {Common_Color,TitleHeader,Username,profilename,Description,Viewmore,UnameStory,Timestamp,Searchresult}  from '../../Assets/Colors'
import { Toolbar, FooterTabBar } from '../commoncomponent';
import common_styles from "../../Assets/Styles/Common_Style"
//import { Dstyles } from '../Home/Styles';
import Loader from '../../Assets/Script/Loader';
import {getPixels} from '../_utils/CommonUtils';
import countries from '../_utils/countries.geo.json'
const { height,width } = Dimensions.get('window')

const myPlace = {
    type:"FeatureCollection",
    features:[
    {
      type:"Feature",
      id:"AU",
      properties:{},
      geometry:{
        type:"Polygon",
        // coordinates:[[[77.837451,35.49401],[78.912269,34.321936],[78.811086,33.506198],[79.208892,32.994395],[79.176129,32.48378],[78.458446,32.618164],[78.738894,31.515906],[79.721367,30.882715],[81.111256,30.183481],[80.476721,29.729865],[80.088425,28.79447],[81.057203,28.416095],[81.999987,27.925479],[83.304249,27.364506],[84.675018,27.234901],[85.251779,26.726198],[86.024393,26.630985],[87.227472,26.397898],[88.060238,26.414615],[88.174804,26.810405],[88.043133,27.445819],[88.120441,27.876542],[88.730326,28.086865],[88.814248,27.299316],[88.835643,27.098966],[89.744528,26.719403],[90.373275,26.875724],[91.217513,26.808648],[92.033484,26.83831],[92.103712,27.452614],[91.696657,27.771742],[92.503119,27.896876],[93.413348,28.640629],[94.56599,29.277438],[95.404802,29.031717],[96.117679,29.452802],[96.586591,28.83098],[96.248833,28.411031],[97.327114,28.261583],[97.402561,27.882536],[97.051989,27.699059],[97.133999,27.083774],[96.419366,27.264589],[95.124768,26.573572],[95.155153,26.001307],[94.603249,25.162495],[94.552658,24.675238],[94.106742,23.850741],[93.325188,24.078556],[93.286327,23.043658],[93.060294,22.703111],[93.166128,22.27846],[92.672721,22.041239],[92.146035,23.627499],[91.869928,23.624346],[91.706475,22.985264],[91.158963,23.503527],[91.46773,24.072639],[91.915093,24.130414],[92.376202,24.976693],[91.799596,25.147432],[90.872211,25.132601],[89.920693,25.26975],[89.832481,25.965082],[89.355094,26.014407],[88.563049,26.446526],[88.209789,25.768066],[88.931554,25.238692],[88.306373,24.866079],[88.084422,24.501657],[88.69994,24.233715],[88.52977,23.631142],[88.876312,22.879146],[89.031961,22.055708],[88.888766,21.690588],[88.208497,21.703172],[86.975704,21.495562],[87.033169,20.743308],[86.499351,20.151638],[85.060266,19.478579],[83.941006,18.30201],[83.189217,17.671221],[82.192792,17.016636],[82.191242,16.556664],[81.692719,16.310219],[80.791999,15.951972],[80.324896,15.899185],[80.025069,15.136415],[80.233274,13.835771],[80.286294,13.006261],[79.862547,12.056215],[79.857999,10.357275],[79.340512,10.308854],[78.885345,9.546136],[79.18972,9.216544],[78.277941,8.933047],[77.941165,8.252959],[77.539898,7.965535],[76.592979,8.899276],[76.130061,10.29963],[75.746467,11.308251],[75.396101,11.781245],[74.864816,12.741936],[74.616717,13.992583],[74.443859,14.617222],[73.534199,15.990652],[73.119909,17.92857],[72.820909,19.208234],[72.824475,20.419503],[72.630533,21.356009],[71.175273,20.757441],[70.470459,20.877331],[69.16413,22.089298],[69.644928,22.450775],[69.349597,22.84318],[68.176645,23.691965],[68.842599,24.359134],[71.04324,24.356524],[70.844699,25.215102],[70.282873,25.722229],[70.168927,26.491872],[69.514393,26.940966],[70.616496,27.989196],[71.777666,27.91318],[72.823752,28.961592],[73.450638,29.976413],[74.42138,30.979815],[74.405929,31.692639],[75.258642,32.271105],[74.451559,32.7649],[74.104294,33.441473],[73.749948,34.317699],[74.240203,34.748887],[75.757061,34.504923],[76.871722,34.653544],[77.837451,35.49401]]]
        coordinates:[]
    }
    },
    {
      type:"Feature",
      id:"IND",
      properties:{},
      geometry:{
        type:"Polygon",
        coordinates:[[[42.779332,16.347891],[42.649573,16.774635],[42.347989,17.075806],[42.270888,17.474722],[41.754382,17.833046],[41.221391,18.6716],[40.939341,19.486485],[40.247652,20.174635],[39.801685,20.338862],[39.139399,21.291905],[39.023696,21.986875],[39.066329,22.579656],[38.492772,23.688451],[38.02386,24.078686],[37.483635,24.285495],[37.154818,24.858483],[37.209491,25.084542],[36.931627,25.602959],[36.639604,25.826228],[36.249137,26.570136],[35.640182,27.37652],[35.130187,28.063352],[34.632336,28.058546],[34.787779,28.607427],[34.83222,28.957483],[34.956037,29.356555],[36.068941,29.197495],[36.501214,29.505254],[36.740528,29.865283],[37.503582,30.003776],[37.66812,30.338665],[37.998849,30.5085],[37.002166,31.508413],[39.004886,32.010217],[39.195468,32.161009],[40.399994,31.889992],[41.889981,31.190009],[44.709499,29.178891],[46.568713,29.099025],[47.459822,29.002519],[47.708851,28.526063],[48.416094,28.552004],[48.807595,27.689628],[49.299554,27.461218],[49.470914,27.109999],[50.152422,26.689663],[50.212935,26.277027],[50.113303,25.943972],[50.239859,25.60805],[50.527387,25.327808],[50.660557,24.999896],[50.810108,24.754743],[51.112415,24.556331],[51.389608,24.627386],[51.579519,24.245497],[51.617708,24.014219],[52.000733,23.001154],[55.006803,22.496948],[55.208341,22.70833],[55.666659,22.000001],[54.999982,19.999994],[52.00001,19.000003],[49.116672,18.616668],[48.183344,18.166669],[47.466695,17.116682],[47.000005,16.949999],[46.749994,17.283338],[46.366659,17.233315],[45.399999,17.333335],[45.216651,17.433329],[44.062613,17.410359],[43.791519,17.319977],[43.380794,17.579987],[43.115798,17.08844],[43.218375,16.66689],[42.779332,16.347891]]]
    }
    }
    ]
}

const initialViewPort= [
  {latitude:37.114508,longitude: 75.533515,latitudeDelta : LATITUDE_DELTA,longitudeDelta : LONGITUDE_DELTA},
  {latitude:3.257575,longitude: 77.340507,latitudeDelta : LATITUDE_DELTA,longitudeDelta : LONGITUDE_DELTA},
  {latitude:28.045189,longitude: 100.832472,latitudeDelta : LATITUDE_DELTA,longitudeDelta : LONGITUDE_DELTA},
  {latitude:24.930805,longitude: 61.803493,latitudeDelta : LATITUDE_DELTA,longitudeDelta : LONGITUDE_DELTA}
];

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 5 
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Profile extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      originalName: '',
      id: '',
      name: '',
      userName: '',
      website: '',
      bio: '',
      email: '',
      profilePic: '',
      verifyProfile: '',
      footPrintCount: 0,
      folowersCount: 0,
      followingCount:0,
      visitsCount: 0,
      footPrintsData: [],
      markers: [],
      businessProfile: 0,
      getLocation: '',
      memoriesCount: 0,
      vlogCount: 0,
      UserTrafficData: [],
      UserEngagementData: [],
      ageData:[],
      mWc : initialViewPort,
      streakImages: [],
      FootprintImaged: [],
      MemorieImages: [],
      VlogImages: [],
      CountryImages: [],
      result: [],regDuplicateCountry:[],regFilterDuplicateCountryCount:[],
      loader : false
    }
    this.map = null
  }

  componentDidMount = () => {
    this.userProfile();
    this.footPrint();
    this.badgesApi();
    console.log('countries',countries)
    this.focusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        this.userProfile();
        this.footPrint();
        this.badgesApi();
      }
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('the next props is', nextProps);
  }
  async badgesApi() {
   // debugger;
    var UId = await AsyncStorage.getItem('userId');
    console.log('test id', UId);
    var data = {
        UserId: UId
    };
    const url = serviceUrl.been_url1 + '/GetBadgesCount';
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo"
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('badges responses', responseJson);
            if (responseJson.status == 'True') {
                this.setState({
                    result: responseJson,
                    streakImages: responseJson.streakImages,
                    FootprintImaged: responseJson.FootprintImaged,
                    MemorieImages: responseJson.MemorieImages,
                    VlogImages: responseJson.VlogImages,
                    CountryImages: responseJson.CountryImages,
                })
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

  userProfile = async () => {
   // debugger;
    var data = {
      userId: await AsyncStorage.getItem('userId')
    };
    this.setState({loader:true})
    const url = serviceUrl.been_url1 + '/UserProfile';
    return fetch(url, {
      method: "POST",
      headers:serviceUrl.headers,
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('user112 profile', responseJson)
        this.setState({loader:false})
        let userData = responseJson.result[0].UserDetails[0]

        if (responseJson.status == "True") {

          if (responseJson.result[0].UserDetails[0].ProfileType === "1") {
            this.setState({
              folowersCount: responseJson.result[0].FollowersCount,
              followingCount: responseJson.result[0].FollowingsCount,
              footPrintCount: responseJson.result[0].FootprintsCount,
              businessProfile: userData.ProfileType.toString(),
              id: userData._id,
              userName: userData.UserName,
              originalName: userData.name == "null"?"":  userData.name  ,
              profilePic: userData.ProfilePic,
              website: userData.Website == "null"  ? "" :  userData.Website ,
              bio: userData.Bio == "null" ?   "" :  userData.Bio ,
              homeLocation: userData.HomeLocation,
              verifyProfile: userData.VerificationRequest,
              memoriesCount: responseJson.result[0].NewsFeedDet.filter(v =>
                v.Image.includes('.jpg') || v.Image.includes('.jpeg') || v.Image.includes('.png')).length,
              vlogCount: responseJson.result[0].NewsFeedDet.filter(v => v.Image.includes('.mp4')).length,
            })
          }
          else {

            console.log("userdata.username", userData);
            this.setState({
              folowersCount: responseJson.result[0].FollowersCount,
              followingCount: responseJson.result[0].FollowingsCount,
              footPrintCount: responseJson.result[0].FootprintsCount,
              businessProfile: userData.ProfileType.toString(),
              id: userData._id,
              userName: userData.UserName,
              originalName: userData.name == "null"?"":  userData.name  ,
              profilePic: userData.ProfilePic,
              website: userData.Website == "null"  ? "" :  userData.Website ,
              bio: userData.Bio == "null" ?   "" :  userData.Bio ,
              homeLocation: userData.HomeLocation,
              verifyProfile: userData.VerificationRequest,
              memoriesCount: responseJson.result[0].NewsFeedDet.filter(v =>
                v.Image.includes('.jpg') || v.Image.includes('.jpeg') || v.Image.includes('.png')).length,
              vlogCount: responseJson.result[0].NewsFeedDet.filter(v => v.Image.includes('.mp4')).length,
            })
          }
          setTimeout(()=>{
            this.datamanipulating(responseJson.result[0].NewsFeedDet);
          },250)
          
        }
      })
      .catch((error) => {
        this.setState({loader:false})
      });
  };

  datamanipulating = (nfdata) =>{
   debugger;
    if(nfdata && nfdata.length > 0){
      // console.log('the nf data',nfdata);
     let markersWithCords = [];
     let markers = []
     nfdata.map((m,i)=>{
        const c = typeof m.coords == 'string' ? JSON.parse(m.coords) : m.coords;
        
        m.coordinates = {}
        if(c.latitude != undefined){
          m.coordinates = c
          markersWithCords.push(c)
        }
        // m.coordinates = 
        //{ latitude: c.lat, longitude:  c.lng }
       
        m.userId = m.userId
        m.UserProfilePic = m.UserProfilePic
        m.postImg = m.Image
        m.path  = m.story ? serviceUrl.been_image_urlExplore:
        serviceUrl.newsFeddStoriesUrl
        m.Location = m.title
        // setTimeout(()=>{
          markers.push(m)
        // },250)
        
        // console.log('the parsed m',m);
        // return m;
      });
      // console.log('the empty string');
      // console.log('the markers',markers);
      let validCountry = []
      const filteredUniqueCountry = markers.map(fc=>{
        const addressSplited = fc?.formattedAddress?.split(', ')
        const lastIndex = addressSplited?.length - 1 || undefined
        if(lastIndex && addressSplited[lastIndex] !== 'undefined'){
          addressSplited[lastIndex] && validCountry.push(addressSplited[lastIndex])
        }
      })
      const uniqueCountries = [...new Set(validCountry)]
      //United States of America
      console.log('myPlauniqueCountriesce1', uniqueCountries)
      const myPlace1 = {
        type:"FeatureCollection",
        features : []
    }
      countries.features.map(co => {
        uniqueCountries.map(uc=>{
          if(co.properties.name == uc){
            myPlace1.features.push(co)
          }
        })
      })
      
      console.log('myPlace1', myPlace1)
      // console.log('the markers with cords only', markers );
      // 
      this.setState({markers,myGeoJson : myPlace1})
      setTimeout(()=>{
        this.setState({mWc : markers.map(({coordinates})=>coordinates )})
        },250)
    } 
  }

  onLayout = () => { 
   
    if(this.state.mWc.length != 0){ 
      console.log('the cakks markers',this.state.mWc)
      setTimeOut = setTimeout( () => { 
        this.map.fitToCoordinates(
            this.state.mWc, 
            { edgePadding:
               {
                 right:getPixels(10),
                 left:getPixels(10),
                 top:getPixels(10),
                 bottom:getPixels(10),
               }, 
              animated: true, }); 
        }, 500 ); 
      }
     }


  async footPrint() {
    var userId = await AsyncStorage.getItem('userId');
    const url = serviceUrl.been_url + "/GetFootPrints";
    var data = {
      UserId: userId
    };
    return fetch(url, {
      method: "POST",
      headers: serviceUrl.headers,

      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('the fp resp',responseJson);
        if (responseJson.status == "True") {
          this.setState({
            isLoader: false,
            footPrintsCount: responseJson.FootprintCount,
            visitsCount: responseJson.Visitscount,  
            footPrintsData: responseJson
          });
        } else {
          this.setState({ isLoader: false });
          //toastMsg('danger', response.data.message)
        }
      })
      .catch(function (error) {
        this.setState({ isLoader: false });
        //toastMsg('danger', 'Sorry..something network error.Please try again.')
      });
  }

  getFootPrint(){
    debugger
   this.props.navigation.navigate('FootPrints', { data: this.state.footPrintsData });
  }
  editProfile() {
    this.props.navigation.navigate('Edit_Profile')
  }
  newsfeed() {
    this.props.navigation.navigate('Newsfeed')
  }
  settings() {
    this.props.navigation.navigate('SettingsScreen')
  }
  tagPost(data) {
    var data = { screenName: "Profile" }
    this.props.navigation.navigate('TaggedPost', { data: data })
  }
  async profileAnalytics() {
    debugger
    var data = {
        userId: await AsyncStorage.getItem('userId')
    };
    const url = serviceUrl.been_url1 + '/ChartData';
    return fetch(url, {
        method: "POST",
        headers: serviceUrl.headers,
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.status == "True") {
                console.log('utr', responseJson.UserTraffic[0].Followers.toString())
                let uTr = responseJson.UserTraffic;
                //UserTraffic
                AsyncStorage.setItem('Followers', responseJson.UserTraffic[0].Followers.length > 0 ? responseJson.UserTraffic[0].Followers.toString() : null);
                AsyncStorage.setItem('UnFollowers', responseJson.UserTraffic[0].UnFollowers.length > 0 ? responseJson.UserTraffic[0].UnFollowers.toString() : null);
                AsyncStorage.setItem('visitors', responseJson.UserTraffic[0].visitors > 0 ? responseJson.UserTraffic[0].visitors .toString(): 0);
                //UserEngagement
                AsyncStorage.setItem('LikeCount', responseJson.UserEngagement[0].LikeCount.length > 0 ? responseJson.UserEngagement[0].LikeCount.toString() : null);
                AsyncStorage.setItem('CommentCount', responseJson.UserEngagement[0].CommentCount.length > 0 ? responseJson.UserEngagement[0].CommentCount.toString() : null);
                AsyncStorage.setItem('SavedCount', responseJson.UserEngagement[0].SavedCount.length > 0 ? responseJson.UserEngagement[0].SavedCount.toString() : 0);
                AsyncStorage.setItem('ShareCount', responseJson.UserEngagement[0].ShareCount.length > 0 ? responseJson.UserEngagement[0].ShareCount.toString() : 0);

                let uEng = responseJson.UserEngagement
                let UserTraffic = responseJson.UserTraffic.length > 0 && [uTr[0].Followers.length, uTr[0].UnFollowers.length, uTr[0].visitors]
                let UserEngagement = responseJson.UserEngagement.length > 0 && [uEng[0].LikeCount.length,
                uEng[0].CommentCount.length, uEng[0].SavedCount.length, uEng[0].ShareCount.length]
                let age = responseJson.Age;
                var AgeArr = age.filter(a => a.Age);
                console.log("21132", AgeArr)
                AsyncStorage.setItem('ageRatio', AgeArr.toString())

                var ageArray = age.map(({ Gender }) => ({ Sex: Gender }))
                let ages = ageArray.map(r1 => r1.Sex)
                    , agesstr = ages.map(a1 => a1)
                let ageFilter = agesstr.filter(e2 => e2 != null);
                AsyncStorage.setItem('age', ageFilter.toString());
                AsyncStorage.setItem('ageTotal', AgeArr.toString());

                // console.log('agebjf',age.length> 0 ? age.filter(a => a.Age ) .toString() : 0)
                let ageRange1 = responseJson.Age.length > 0 && age.filter(a => a.Age > 18 && a.Age < 27).length
                let ageRange2 = responseJson.Age.length > 0 && age.filter(a => a.Age > 28 && a.Age < 37).length
                let ageRange3 = responseJson.Age.length > 0 && age.filter(a => a.Age > 38 && a.Age < 47).length
                let ageRange4 = responseJson.Age.length > 0 && age.filter(a => a.Age > 48 && a.Age < 57).length
                let ageRange5 = responseJson.Age.length > 0 && age.filter(a => a.Age > 58 && a.Age < 67).length
                let ageRange6 = responseJson.Age.length > 0 && age.filter(a => a.Age > 68 && a.Age < 77).length
                let ageRange7 = responseJson.Age.length > 0 && age.filter(a => a.Age > 78 && a.Age < 87).length
                let ageRange8 = responseJson.Age.length > 0 && age.filter(a => a.Age > 88 && a.Age < 97).length

                let trafficAge = responseJson.UserEngagement.length > 0 && [ageRange1, ageRange2, ageRange3, ageRange4, ageRange5, ageRange6, ageRange7, ageRange8]
                console.log("Age range", trafficAge);
                let Region = responseJson.Region[0]
                let Region1 = responseJson.Region[0].code
                let Region2 = responseJson.Region[0].Country
                console.log('Region1', Region2)
                const resultx = [...Region2.reduce((mp, o) => {
                    if (!mp.has(o.Country)) mp.set(o.Country, { ...o, count: 0 });
                    mp.get(o.Country).count++;
                    return mp;
                }, new Map).values()];

                //Country duplicate splitted
                var countryAerr = resultx.map(({ Country }) => ({ Regi1: Country }))
                let regCountrydup = countryAerr.map(rCounrty => rCounrty.Regi1)
                    , RegionstrCountrydup = regCountrydup.map(a => a)
                let regDuplicateCountry = RegionstrCountrydup.filter(e2Cou => e2Cou != null);
                console.log(regDuplicateCountry)

                //Country count duplicate splitted

                var countryCount = resultx.map(({ count }) => ({ Regi: count }))
                let regCountry1 = countryCount.map(r => r.Regi)
                    , RegionstrCountry1 = regCountry1.map(a1 => a1)
                let regFilterDuplicateCountryCount = RegionstrCountry1.filter(e2Cou => e2Cou != null);
                console.log(regFilterDuplicateCountryCount)


                var countryAerr = Region2.map(({ Country }) => ({ Regi1: Country }))
                let regCountry = countryAerr.map(rCounrty => rCounrty.Regi1)
                    , RegionstrCountry = regCountry.map(a => a)
                let regFilterCountry = RegionstrCountry.filter(e2Cou => e2Cou != null);
                console.log('regFilterCountry', regFilterCountry)
                AsyncStorage.setItem('RegionCountry', regFilterCountry.toString());
                var RegionArr = Region1.map(({ code }) => ({ Regi: code }))
                let reg = RegionArr.map(r => r.Regi)
                    , Regionstr = reg.map(a => a)
                let regFilter = Regionstr.filter(e2 => e2 != null);
                AsyncStorage.setItem('RegionCode', regFilter.toString());
           
                this.setState({
                    UserTrafficData: UserTraffic,
                    UserEngagementData: UserEngagement,
                    ageData: trafficAge, regFilt: regFilter,
                    regDuplicateCountry:regDuplicateCountry,
                    regFilterDuplicateCountryCount:regFilterDuplicateCountryCount

                })
                const data = {
                    uTd: this.state.UserTrafficData,
                    uEngmt: this.state.UserEngagementData,
                    uAge: this.state.ageData,
                    age: age,
                    uReg: Region,regDuplicateCountry:regDuplicateCountry,
                    regFilterDuplicateCountryCount:regFilterDuplicateCountryCount

                };
                console.log('the pa', data);
                this.props.navigation.navigate('ProfileAnalytics', { analytics: data })
            }
        })
        .catch((error) => {
        });
};

  follwers() {
    var data={
      followerCount:this.state.folowersCount,
      followingCount:this.state.followingCount
    }
    this.props.navigation.navigate('FollowTab',{data:data});
  }
  badgesScreen() {
    debugger
    var data = {
      footprints: this.state.footPrintCount,
      memoriesCount: this.state.memoriesCount,
      vlogCount: this.state.vlogCount
    }
    this.props.navigation.navigate('Badges', { data: data })
  }


  renderToolbarIconsView() {
    return (

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginRight: 20, }}>

        <TouchableOpacity onPress={() => this.tagPost()}>
          <Image style={{ width: 26, height: 26, marginRight: 17 }}
            source={require(imagePath + 'notes.png')}
          />
        </TouchableOpacity>

        {this.state.businessProfile === "1" ?
          <View style={[styles.topicons, { height: 21, width: 24, marginRight: 17 }]} >
            <TouchableOpacity onPress={() => this.profileAnalytics()}>
              <Image source={require(imagePath1 + 'bar-chart.png')}
                // resizeMode={'center'}
                style={{ width: '100%', height: '100%' }} />
            </TouchableOpacity></View> : null}

        <TouchableOpacity onPress={() => this.settings()}>
          <Image style={{ width: 22, height: 26, marginRight: 15 }}
            source={require(imagePath + 'setting.png')} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.editProfile()}>
          <Image source={require(localProfile + 'user.png')} resizeMode={'stretch'}
            style={{ width: 24, height: 22, marginRight: 5 }} />
        </TouchableOpacity>

      </View>
    )
  }


  render() {
    const keyboardVerticalOffset = Platform.OS === "ios" ? 64 : 0;
    const { footPrintsCount, memoriesCount, vlogCount,userName } = this.state;
    // const badges = footPrintsCount + memoriesCount + vlogCount;
    const badges = this.state.FootprintImaged.length + this.state.CountryImages.length + this.state.streakImages.length + this.state.MemorieImages.length +this.state.VlogImages.length;
    const badgeCount = isNaN(badges) ? 0 : badges;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    const { newsFeddStoriesUrl,been_image_urlExplore } = serviceUrl;
    return (
      <View style={{ flexDirection: 'column', backgroundColor: '#fff', flex: 1,marginTop:0 }}>
        <StatusBar backgroundColor='#FFF' barStyle='dark-content'  />
        <View style={{ flex: 9, }}>
          <Toolbar {...this.props} userNameTitle={userName}  rightMultiImgView={this.renderToolbarIconsView()} />
          <View style={{ height: '45%',}}>
            <View style={{ width: '100%', height: hp(45), marginBottom: 10, }} >
              <View style={styles.container2}>
                <View style={{ width: '75%', marginTop: '3%' }}>
                  <View>
                    {this.state.verifyProfile == "Approved" ? (
                      <View>
                        {this.state.profilePic == null ? (
                          <View >
                            <ImageBackground 
                              style={[businessProfileStyle.profile, { width: 100, height: 100, }]} 
                              rezizeMode={'stretch'} borderRadius={50}
                              source={require(imagePath + 'profile.png')}>
                              {/* <Image source={require(imagePath1 + 'verify.png')} style={businessProfileStyle.verify} /> */}
                            </ImageBackground>
                            <Text style={[styles.newText12, {  alignSelf: 'center'}]}>{ this.state.originalName}</Text>

                            <View style={{ height: 520, marginTop: '3%', marginLeft: 10 }}>
                              <View style={{ height: 75, marginTop: 1, width: "95%" }}>
                                <Text style={[styles.newText1, { }]}>{ this.state.bio}</Text>
                              </View>
                              <View style={{ marginTop: 5, height: 50, marginRight: 0, marginLeft: -0,}}>
                                {this.state.businessProfile === "1" ?

                                  <View style={[businessProfileStyle.editProfile, { marginLeft: '1%', width: wp('60%'), borderColor: 'transparent', marginTop: '1%', }]}>
                                    <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => this.props.navigation.navigate('Promote')}>
                                      <ImageBackground source={require(imagePath + 'button.png')} style={{ width: 200, height: '100%' }} borderRadius={10}>
                                        <Text style={[common_styles.Common_btn_txt, { fontSize: 15, alignSelf: 'center', textAlign: 'center', marginTop: 5 }]} >Promote</Text>
                                      </ImageBackground>
                                    </TouchableOpacity>
                                  </View>
                                  : null}
                              </View>
                            </View>
                          </View>)
                          : (
                            <View style={{ width: '100%', height: '150%', }}>
                              <ImageBackground 
                                style={[businessProfileStyle.profile, 
                                  { width: 100, height: 100, alignSelf: 'center' }]} 
                                 rezizeMode={'stretch'} borderRadius={50}
                                source={{ uri: serviceUrl.profilePic + this.state.profilePic }}>
                                <Image source={require(imagePath1 + 'TickSmall.png')} style={[businessProfileStyle.verify, { marginLeft: wp('18%') }]} />
                              </ImageBackground>

                              <Text style={[styles.newText12, {  alignSelf: 'center', }]}>{ this.state.originalName }</Text>

                              <View style={{ height: 520, marginTop: '3%', marginLeft: 10, }}>
                                <View style={{ height: 75, marginTop: 1, width: "95%" }}>
                                  <Text style={[styles.newText1, { }]}>{this.state.bio == "undefined" ? "" : this.state.bio}</Text>
                                </View>
                                <View style={{ marginTop: 1, height: 50, marginRight: 0, marginLeft: -0 }}>
                                  {this.state.businessProfile === "1" ?

                                    <View style={[businessProfileStyle.editProfile, { marginLeft: '1%', width: wp('60%'), borderColor: 'transparent', marginTop: '1%', }]}>
                                      <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Promote') }}>
                                        <ImageBackground source={require(imagePath + 'button.png')} style={{ width: 200, height: '100%', justifyContent: 'center' }} borderRadius={10}>
                                          <Text style={[common_styles.Common_btn_txt, { fontSize: 15, alignSelf: 'center', textAlign: 'center', }]} >Promote</Text>
                                        </ImageBackground>
                                      </TouchableOpacity>
                                    </View>
                                    : null}
                                </View>
                              </View>

                            </View>
                          )}
                      </View>
                    ) :
                      (<View>
                        {this.state.profilePic == null ?
                          <View>
                            <Image style={[businessProfileStyle.profile, { width: 100, height: 100, alignSelf: 'center' }]} rezizeMode={'stretch'} borderRadius={50}
                              source={require(imagePath + 'profile.png')}></Image>
                            <Text style={[styles.newText12, {  alignSelf: 'center'}]}>{ this.state.originalName}</Text>

                            <View style={{ height: 520, marginTop: '3%', marginLeft: 10, }}>
                              <View style={{  marginTop: 1, width: "95%" }}>
                                <Text style={[styles.newText1, { fontSize: 12, fontFamily: Common_Color.fontLight }]}>{ this.state.bio}</Text>
                              </View>
                              <View style={{ marginTop: 1, height: 50, marginRight: 0, marginLeft: -0 }}>
                                {this.state.businessProfile === "1" ?
                                  <View style={[businessProfileStyle.editProfile, { marginLeft: '1%', width: wp('60%'), borderColor: 'transparent', marginTop: '1%', }]}>
                                    <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Promote') }}>
                                      <ImageBackground source={require(imagePath + 'button.png')} style={{ width: 200, height: '100%', justifyContent: 'center' }} borderRadius={10}>
                                        <Text style={[common_styles.Common_btn_txt, { fontSize: 15, alignSelf: 'center', textAlign: 'center', }]} >Promote</Text>
                                      </ImageBackground>
                                    </TouchableOpacity>
                                  </View>
                                  : null}
                              </View>
                            </View>
                          </View>
                          :
                          <View>
                            <Image style={[businessProfileStyle.profile, 
                              { width: 100, height: 100, alignSelf: 'center',
                              // transform:[{rotate:this.getImageSize()}] 
                             }]} 
                              rezizeMode={'contain'} borderRadius={50}
                              source={{ uri: serviceUrl.profilePic + this.state.profilePic }}
                              
                            />
                            <Text style={[styles.newText12, { alignSelf: 'center', }]}>{this.state.originalName }</Text>

                            <View style={{ height: 520, marginTop: '3%', marginLeft: 10, }}>
                              <View style={{  marginTop: 1, width: "95%" }}>
                                <Text style={[styles.newText1, { fontSize: 12, fontFamily: Common_Color.fontLight }]}>{ this.state.bio}</Text>
                              </View>
                              <View style={{ marginTop: 1, height: 50, marginRight: 0, marginLeft: -0 }}>
                                {this.state.businessProfile === "1" ?
                                  <View style={[businessProfileStyle.editProfile, { marginLeft: '1%', width: wp('60%'), borderColor: 'transparent', marginTop: '1%', }]}>
                                    <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { this.props.navigation.navigate('Promote') }}>
                                      <ImageBackground source={require(imagePath + 'button.png')} style={{ width: 200, height: '100%', justifyContent: 'center' }} borderRadius={10}>
                                        <Text style={[common_styles.Common_btn_txt, { fontSize: 15, alignSelf: 'center', textAlign: 'center', }]} >Promote</Text>
                                      </ImageBackground>
                                    </TouchableOpacity>
                                  </View>
                                  : null}
                              </View>
                            </View>
                          </View>}
                      </View>
                      )}

                  </View>

                </View>

                {/* Followers */}

                <View style={{ marginLeft: '2%', marginTop: '1%', height: '100%', }}>

                  <View>
                    <TouchableOpacity onPress={() => this.follwers()}>
                      <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '8%', }}>
                        <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                          resizeMode={'stretch'} source={require('../../Assets/Images/BussinesIcons/Brackets.png')}>
                        </Image>
                        <View style={{ position: 'absolute', top: 8, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{   marginTop: 10,fontSize: Searchresult.FontSize,   }}>
                            {this.state.folowersCount > 0 ? this.state.folowersCount : 0}
                          </Text>
                          <Text style={{ fontSize: Viewmore.FontSize,  fontFamily: Viewmore.Font, }}> Follower </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>


                  {/* Footprints */}
                 
                    <TouchableOpacity onPress={() => this.getFootPrint()}>
                      <View style={{ width: 80, height: 70, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                        <Image style={{ width: '100%', height: '120%', alignSelf: 'center' }}
                          resizeMode={'stretch'} source={require(imagePath1 + 'Brackets.png')}>
                        </Image>
                        <View style={{ position: 'absolute', top: 10, left: 0, right: 0, bottom: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{  marginTop: 10, fontSize: Searchresult.FontSize,    }}> {this.state.footPrintsCount > 0 ? this.state.footPrintsCount : 0}  </Text>
                          <Text style={{ fontSize: Viewmore.FontSize,  fontFamily: Viewmore.Font, }}> Footprints </Text>
                        </View>
                      </View></TouchableOpacity>
                    
                  {/* Badges */}
                  <View>
                    <TouchableOpacity onPress={() => this.badgesScreen()}>
                      <View style={{ width: 80, height: 80, overflow: 'hidden', marginRight: '10%', marginTop: '5%', }}>
                        <Image style={{ width: '100%', height: '100%', alignSelf: 'center' }}
                           source={require( imagePath1 + 'Floral-grey.png')}>
                        </Image>
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 18, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{   marginTop: 10, fontSize: Searchresult.FontSize, marginLeft:4 }}> {badgeCount > 0 ? badgeCount : 0}  </Text>
                          <Text style={{ fontSize: Viewmore.FontSize,  fontFamily: Viewmore.Font,}}> Badges </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                  </View>
                </View>
              </View>
            </View>
          </View>



          <View style={{ width: '100%', height: hp(60), }}>
            
            <MapView
              ref={el => (this.map = el)}
              style={styles.map}
              // followUserLocation={true}
              zoomEnabled={true}
              showsUserLocation={false}
              showsCompass={true}
              
              // minZoomLevel={0}
              // maxZoomLevel={20}
              //customMapStyle={Dstyles.mapStyle}
              // onLayout  = {this.onLayout}
              moveOnMarkerPress={true}    >
                
              {this.state.markers.length > 0 && this.state.markers.map((marker, index) => (

                marker.coordinates.latitude != undefined ?
                  <MapView.Marker key={index} coordinate={marker.coordinates}>

                    <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center', }}>
                      <ImageBackground source={require(imagePath+'loc_marker_unseen.png')} style={{ width: 20, height: 20, justifyContent: 'center' }} resizeMode={'stretch'} >
                        <Image source={{ uri: marker.path + marker.postImg.split(',')[0] }} style={{
                          height: 15, width: 15, borderRadius: 35, marginLeft: '7%', marginBottom: '12%'
                        }} />
                      </ImageBackground >
                    </View>

                  </MapView.Marker>
                  :
                  null
              ))}


                {this.state.myGeoJson && (
                  <Geojson strokeColor='red' fillColor='#f0f2' geojson={this.state.myGeoJson} />
                )}
          
            </MapView>

          </View>

        </View>
        <FooterTabBar {...this.props} tab={0} />


        {this.state.loader && (
          <View style={{
            height,
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,.3)',
            width: width,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Loader />
          </View>
        )}
        

      </View >
    )
  }
}
const styles = StyleSheet.create({
  topicons: { width: 26, height: 26, marginRight: 5,marginTop:'0%' },
  map: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff"
  },
  newText: {  fontSize: 14, fontFamily: Common_Color.fontMedium, textAlign: 'center' },
  newText1: {  fontSize: Description.FontSize, fontFamily: Description.Font,  textAlign: 'left', marginTop: 5, marginBottom: 5, marginLeft: '3%' },
  newText12: { fontSize: Username.FontSize, fontFamily: Username.Font,  textAlign: 'left', marginTop: 5, marginBottom: 5, marginLeft: '3%' },
  container: {
    flex: 1,
  },


  container2: { flexDirection: 'row', width: '100%', marginLeft: 'auto', marginRight: 'auto', height: 40 },

  container: {
    flex: 1,
  },
  iconView: { width: '14%', height: '10%' },
  icon: { width: wp(8), height: hp(6) },
  icon1: { width: 20, height: 22, borderRadius: 5, marginTop: 5 },
  footericon: { width: '23%', marginLeft: '5%', marginBottom: '5%' },
  fontColor: {
    color: '#b4b4b4'
  },
  fontsize: { fontSize: 12, color: '#010101', textAlign: 'auto', fontFamily: Common_Color.fontMedium },
  fontsize1: { fontSize: 16, color: '#010101', fontFamily: Common_Color.fontBold },
  footerIconImage: { width: wp(8), height: hp(4.5), },
  editProfile: {
    width: '94%', height: 35, marginLeft: 'auto', marginRight: 'auto', marginBottom: 10,
  },
})



