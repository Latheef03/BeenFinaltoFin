import React, { Component } from 'react'
import { View, StyleSheet, Image, StatusBar,Dimensions, Text, Animated, PanResponder, TouchableOpacity } from 'react-native'
import serviceUrl from '../../Assets/Script/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, Container, Footer, FooterTab, Content, Button, Spinner, Left } from "native-base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Stories2 from '../Story/Stories2';
let Common_Api = require('../../Assets/Json/Common.json')
import Common_Style from '../../Assets/Styles/Common_Style'
import { Toolbar } from '../commoncomponent'
import stylesFromToolbar from '../commoncomponent/Toolbar/styles'

export default class ExploreStories extends Component {
static navigationOptions = {
header: null,
};

constructor(props) {
super(props);
this.state = {
id: '',
dataSource: '',
convertedImages1: '',
gestureName: 'none',
statusLists: [],
move: true,
}
}
componentWillMount() {
// this.onLoad();
}

componentDidMount = () => {
const {navigation} = this.props
this.focusSubscription = navigation.addListener(
"focus",
() => {
// const placeid = navigation.getParam('placeId')
// console.log('the place id es',placeid);
// this.onLoad();

}
);
};

onLoad = async () => { 
this.setState({ isLoader: true });
var id = await AsyncStorage.getItem('userId');
Common_Api.PostUserId.userId = id;
const url = serviceUrl.been_url + "/GetStoryList";
fetch(url, { method: "POST",headers: {'Content-Type': 'application/json','Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkJlZW5fQWRtaW4iLCJlbWFpbCI6ImJlZW5hZG1pbkBnbWFpbC5jb20ifSwiaWF0IjoxNTczNTQ1Mjc1fQ.LLgQsl1Gfk6MKugsoiQjkTdkV6D_8BMJ3Dh-2IVKcuo'},
body: JSON.stringify(Common_Api.PostUserId)
})
.then(async response => response.json())
.then(responseJson => {
// console.log('called api resp',responseJson)
if (responseJson.status == "True") {
console.log('respomnse json', responseJson);
this.setState({statusLists: responseJson.result,});
} else {
this.setState({ isLoader: false });
//toastMsg('danger', response.data.message)
}
})
.catch(function (error) {
this.setState({ isLoader: false });
});
}

renderRightImgdone() {
return <View style={[stylesFromToolbar.leftIconContainer]}>
<View >
<Image style={{ width: 20, height: 20 }} />
</View>
</View>
}

render() {
const {statusLists} = this.state;
const placeid = this.props.route.params.placeId

return (
<View style={{flex:1,marginTop:0}}>
<StatusBar backgroundColor="#ffffff" barStyle='dark-content' />

<Toolbar {...this.props} centerTitle="Explore Stories" rightImgView={this.renderRightImgdone()} />

<View style={{ width: '100%',height:'100%' }}>
<Stories2 placeId={placeid} navigation={this.props.navigation} />
{/* {statusLists.length > 0 ?
(
<Stories2 navigation={this.props.navigation} />
) :
statusLists.length == 0 ?
<View style={styles.hasNoMem}>
<Image source={require('../../Assets/Images/3099422-256.png')} style={{ height: 65, width: 65, }} />
<Text style={Common_Style.noDataText}> You have no Stories Yet!</Text>
</View>
:
<View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
<Spinner style={{ marginTop: '60%' }} color="#fb0143" />
</View>} */}

</View>
</View>
);
}
}

const styles = StyleSheet.create(
{
image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "red", margin: '3%' },
hasNoMem: { justifyContent: 'center', alignItems: 'center', alignContent:'center',marginTop:'75%' },
}
)









