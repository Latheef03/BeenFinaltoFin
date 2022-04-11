import React, { Component } from 'react'
import {View,Text,ImageBackground,Image,StyleSheet}from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ViewMoreText from 'react-native-view-more-text';


export default class AllpostsCard extends Component
{

    static navigationOptions = {
        title: "All Posts",
        headerStyle: {
          backgroundColor: "#fff",
          height:60
        },
        headerTintColor: "#e3e3e5",
        headerTitleStyle: {
          fontWeight: "bold",
          marginRight: "20%",
          fontFamily: "sans",
          color: "#959595",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          flex: 1
        }
      };


      renderViewMore(onPress) {
        return (
            <Text style={{ textAlign: 'center', marginTop: '2%', marginBottom: '2%', marginLeft: '74%', }} onPress={onPress}>View more</Text>
        )
    }
    renderViewLess(onPress) {
        return (
          <Text style={{ color: '#6f94c9', fontSize: Viewmore.FontSize, fontFamily: Viewmore.Font, marginLeft: '74%' }} onPress={onPress} >View Less</Text>)
        //     <Text style={{ textAlign: 'center', marginTop: '2%', marginBottom: '2%', marginLeft: 25, }} onPress={onPress} >View Less</Text>
        // )
    }
render()
{
    return(
        <View>
            <ScrollView style={{ width: '100%', }}>
          <View style={{ backgroundColor: '#fff', height: 30, }}>
            <Text style={{ color: '#868686', textAlign: 'center', marginTop: 10, fontFamily: 'OpenSans-Bold', alignSelf: 'center', fontSize: 18 }}>Newsfeed</Text></View>

          <View>
            {this.state.newsFeedData != "" || null
              ?
              this.state.newsFeedData.map((data) =>
                <View style={styles.card}>

                  <View style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', }}>
                    <View style={{ flexDirection: 'row' }} >
                      <View style={{ marginTop: '2%', width: '90%', }}>
                      {data.Location === "null" ? null:(<Text style={{ color: '#888888', fontSize: 16 }}>  {data.Location}</Text>)}

                      {data.Country === "null" ? null:( <Text style={{ color: '#747474', fontSize: 15,marginLeft:6 }}>{data.Country}</Text>)}
                        

                       
                      </View>
                      <View style={{ marginTop: '4%', width: '10%' }}>
                        <TouchableOpacity onPress={() => this.modalOpen()}>
                          <Image style={{ width:widthPercentageToDP(6), height: 15, marginLeft: 'auto', marginRight: 'auto', marginTop: '10%' }} 
                       // resizeMode={'stretch'} 
                          source={require('../../Assets/Images/3dots.png')}></Image>
                        </TouchableOpacity>
                      </View>


                    </View>
                    <View>
                      {data.Image == null ? <ImageBackground style={{ width: '100%', height: 230, marginTop: '2%' }} source={require('../../Assets/Images/story2.jpg')}>
                        <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
                          <View style={{ width: '90%', }}></View><View style={{ width: '12%', height: 28, backgroundColor: '#0a3174', borderRadius: 20 }}>
                            <Image style={{ width: 20, height: 20, marginLeft: '21%', marginTop: '7%' }} source={require('../../Assets/Images/camera.png')} ></Image></View>
                        </View>
                      </ImageBackground> :
                        <ImageBackground style={{ width: '100%', height: 230, marginTop: '2%' }} source={{
                          uri: serviceUrl.newsFeddStoriesUrl +
                            data.Image
                        }}>
                          <View style={{ flexDirection: 'row', marginTop: '3%', marginRight: '3%' }}>
                            <View style={{ width: '90%', }}></View><View style={{ width: '12%', height: 28, backgroundColor: '#0a3174', borderRadius: 20 }}>
                              <Image style={{ width: 20, height: 20, marginLeft: '21%', marginTop: '7%' }} source={require('../../Assets/Images/camera.png')} ></Image></View>
                          </View>
                        </ImageBackground>}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: '5%' }}>
                      <View>
                        <View style={{ flexDirection: 'row', }}>
                          {data.UserProfilePic == null ?
                            <Image style={{ width: 25, height: 25, }} borderRadius={50} source={require('../../Assets/Images/assam.jpg')}></Image> :
                            <Image style={{ width: 25, height: 25, }} borderRadius={50}
                              source={{
                                uri: serviceUrl.been_image_urlExplore +
                                  data.UserProfilePic
                              }}></Image>}
                          <View style={{ width: '80%', }}>
                            <Text style={{ width: '80%', marginLeft: '5%', marginTop: 5, color: '#000' }}>{data.UserName}</Text></View>
                        </View>
                        <View style={{ width: '85%', height: 'auto', marginTop: '5%', }}>
                <ViewMoreText
                 numberOfLines={2}
                  renderViewMore={this.renderViewMore}
                  renderViewLess={this.renderViewLess}
                  style={{ textAlign: 'center', marginBottom: '1.5%' }}
                >
                  <Text style={{ color: '#67b6ee',}}>{data.Description === null?'':data.Description}</Text>
                </ViewMoreText>
                {/* <Text style={{ color: '#67b6ee', textAlign: 'left' }}> {data.Description === "null" ? null : data.Description}</Text> */}
              </View>

                        {/* <View style={{ width: '80%', height: 70, marginTop: '10%', }}>
                          <Text style={{ color: '#67b6ee',}}>{data.Description === null?'':data.Description}</Text>
                        </View> */}
                      </View>
                      <View>
                        <TouchableOpacity >
                        <Image style={{ width: 20, height: 20, }} source={
                            data && data.userLiked && data.userLiked == true?
                            require('../../Assets/Images/redheart.png') : 
                            require('../../Assets/Images/heart.png')}></Image>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 10, textAlign: 'center' }} >
                          {data.LikeCount}</Text>
                          <TouchableOpacity >
                        <Image style={{ width: 20, height: 20, marginTop: '20%', }} source={require('../../Assets/Images/comment.png')}></Image>
                        </TouchableOpacity>
                            <Text style={{ fontSize: 10,textAlign:'center' }}>{data.Commentcount}</Text>
                        <TouchableOpacity onPress={() => { this.bookmarkLikes(data) }}>
                        <Image style={{ width: 15, height: 15, marginTop: '20%', marginLeft: 5 }} source={require('../../Assets/Images/bookmark.png')}></Image>
                        </TouchableOpacity>
                          <Text style={{ fontSize: 10, marginLeft: 3,textAlign:'center'  }}>{data.Bookmarkcount}</Text>
                      </View>
                    </View  >
                    {/* <View  >
                      <Text style={{ textAlign: 'center', marginBottom: '3%' }} > View More</Text>
                    </View> */}

                  </View>
                </View>) : null}

          </View>


        </ScrollView>

        </View>
    )
}



}

const styles = StyleSheet.create({
    card: {
      width: '95%', borderWidth: 1,
      borderRadius: 10,
      borderColor: '#ddd',
      borderWidth: 1,
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 12 },
      // shadowOpacity: 10,
      // shadowRadius: 10,
      // elevation: 4,
  
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
      marginTop:heightPercentageToDP(1),
      marginBottom:heightPercentageToDP(1.3),
      backgroundColor: '#fff',
    },
    modalContent: {
      backgroundColor: "#FFF",
      padding: 10,
      borderRadius: 10,
      borderColor: "rgba(0, 0, 0, 0.1)",
      width: "100%",
      marginTop: "25%"
    },
    modalText: {
      fontSize: 16,
      fontFamily: "ProximaNova-Regular ",
      color: "#989898",
      margin: 5,
      marginBottom: 5,
      marginTop: 14,
      marginLeft: 15
    },
    addButtonTouchableOpacity: {
      borderWidth: 1,
      borderColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
      width: 70,
      position: "absolute",
      bottom: 80,
      right: 10,
      height: 70,
      borderRadius: 100,
      backgroundColor: "transparent"
    },
  })
  