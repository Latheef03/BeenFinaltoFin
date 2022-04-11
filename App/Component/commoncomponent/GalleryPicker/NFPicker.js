/**
 *@import modules 
 */
import React, { Component } from 'react';
import {
  View, Image, FlatList, PermissionsAndroid, Platform, Text, Picker, TouchableOpacity,
  StatusBar, ToastAndroid, Animated, fall, TouchableHighlight
  , Easing
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import styles, { changeColor } from './styles';
import { deviceWidth as dw, deviceHeight as dh, invalidText } from '../../_utils/CommonUtils';
import { Common_Color } from '../../../Assets/Colors/Common_Color';
import Modal from 'react-native-modalbox';


/**
 *@Represents
 *@class Gallery Picker
 *@extends Component
 */

export default class NFPicker extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      route: '',
      albumNames: [],
      selectedAlbumName: '',
      MI_isSelected: false,
      isSelectedImage: false,
      selectedImgCount: '',
      imgSelectExceed: false,
      blobType: '',
      multiPicNeed: true,
      visibleList: false

    };


  }

  async componentDidMount() {
    // this.focusSubscription = this.props.navigation.addListener(
    //   "focus",
    //   () => {

    //   })
    this.checkPermission();

  }



  checkPermission = async () => {
    console.log('the hit chk permision')
    if (Platform.OS === 'android') {
      console.log('yes this is android')
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission Needed',
          message: 'Been would like to access your Gallery to further move.!',
        },
      );
      console.log('result is ', result);
      if (result !== 'granted') {
        console.log('Access to pictures was denied');
        return;
      }
    }

    const { navigation } = this.props;
    let screen = this.props.route.params.screen
    //navigation.getParam('screen');
    let blobtype = this.props.route.params.type
    //navigation.getParam('type');
    let multiPic = this.props.route.params.multiPic
    //navigation.getParam('multiPic');

    console.log('theat routes is ', screen, '===', blobtype)
    if (screen !== undefined && blobtype !== undefined) {
      this.setState({
        route: screen,
        blobType: blobtype
      }, () => {
        this.getGallery();
        this.getAlbumNames()
      })
    }

    if (multiPic != undefined) {
      this.setState({
        multiPicNeed: multiPic
      })
    }


    // this.getGallery('',blobtype);
    // this.getAlbumNames()
  }

  onScrollEndHandler = () =>{
    console.log('the end reached');
    // console.log('the end has next page',this.state.hasNextPage);
    if(this.state.hasNextPage){
      this.loadMore()
    }
  }

  loadMore = (grpname = '', bt) => {
    // console.log('get gallery ', this.state.data);
    const { blobType } = this.state;
    let gpName = grpname == '' ? null : { groupName: grpname };
    let AType = blobType == '' ? 'Photos' : blobType;
    let params = {
      first: 50,
      after : this.state.endCursor,
      assetType: AType,
      ...gpName,
    }
    // console.log('params', params);
    CameraRoll.getPhotos(params)
      .then(res => {
        // console.log('albums results', res);
        let galleryBlobs = res.edges.length > 0 && res.edges.map((m, i) => {
          m.node.isSelect = false;
          m.node.id =  this.state.lastId++
          return m;
        });
        console.log('ddd', galleryBlobs);
        this.setState({
          data: [...this.state.data,...galleryBlobs],
          hasNextPage: res.page_info.has_next_page,
          startCursor: res.page_info.start_cursor,
          endCursor: res.page_info.end_cursor,
          offset : this.state.offset + 1,
        },()=>{
          this.setState({
            lastId : this.state.data.length + 1
          })
        });
        // if(res.page_info.has_next_page){
        //   console.log('has next page');
        //   // this.getGallery()
        // }
      })
      .catch(error => {
        console.log('the error is ', error);
      });
  }

  getGallery = (grpname = '', bt) => {
    console.log('get gallery ', grpname);
    const { blobType } = this.state;
    let gpName = grpname == '' ? null : { groupName: grpname,groupTypes: 'Album', };
    
    let AType = blobType == '' ? 'Photos' : blobType;
    let params = {
      first: 50,
      assetType: AType,
      ...gpName,
      // groupName: "Lathered"
    }
    // if(params.groupName){
    //   this.setState({data : []})
    // }
    console.log('params', params);
    CameraRoll.getPhotos(params)
      .then(res => {
        console.log('albums results', res);
        let galleryBlobs = res.edges.length > 0 && res.edges.map((m, i) => {
          m.node.isSelect = false;
          m.node.id = i + 1;
          return m;
        });
        console.log('ddd', galleryBlobs);
        this.setState({
          data: galleryBlobs,
          hasNextPage: res.page_info.has_next_page,
          startCursor: res.page_info.start_cursor,
          endCursor: res.page_info.end_cursor,
          offset : 1,
          lastId : galleryBlobs.length + 1
        });
        // if(res.page_info.has_next_page){
        //   console.log('has next page');
        //   // this.getGallery()
        // }
      })
      .catch(error => {
        console.log('the error is ', error);
      });
  }

  getAlbumNames = () => {
    const { blobType } = this.state;
    let blobs = blobType == '' ? 'Photos' : blobType
    let params = {
      assetType: blobs,
    }
    CameraRoll.getAlbums(params)
      .then(res => {
        console.log('albums results', res);
        this.setState({ albumNames: res });
      })
      .catch(error => {
        console.log('the error is ', error);
      });
  }

  iSSelectMultiIcon = (items, index) => {
    const { blobType, } = this.state
    const { node } = items;
    if (blobType !== 'Videos') {
      return (
        <View style={[styles.selectCircleForNF, {
          backgroundColor: node.isSelect ? 'red' : '#fff',
          right: index % 3 == 2 ? 16 : 8,
        }]} >
          {/* <Image source={require('../../../Assets/Images/check_white.png')} 
            style={styles.tick}
            /> */}
          {/* <Text style={{ color: '#fff', textAlign: 'center' }}>{node.count}</Text> */}
        </View>
      )
    } else {
      return null
    }
  }

  selectItem(item, i, multiSelect) {

    const { data, imgSelectExceed, route, blobType } = this.state;
    const selectedNumber = data.filter(item => item.node.isSelect).length;

    if (blobType == 'Videos') {
      const filteredMultiIMage = data.filter(m => m.node.id == item.node.id);
      console.log('item id', item.node.id);
      let datas = {
        e: filteredMultiIMage,
        sImg: true
      };
      this.props.navigation.navigate(route, { imgProp: datas });
    } else {
      item.node.isSelect = !item.node.isSelect;
      const index = data.findIndex(v => item.node.id === v.node.id);
      const itemNumber = data.filter(item => item.node.isSelect).length;
      item.node.count = itemNumber;
      data[index] = item;

      this.setState({
        data: data,
        // imgSelectExceed : itemNumber == 2 ? true : false
      });
    }




    // if (!multiSelect) {
    //   let data = {
    //     e: [item],
    //     sImg : true
    //   }
    //   this.props.navigation.navigate(route, { imgProp: data });
    // } else {
    // const counts = data.filter(item => item.node.count );
    // console.log('countss',counts);
    // item = !item.node.isSelect ? v.node.count ? v.node.count - 1 : 0 })

    // itemNumber > 0 && !item.node.isSelect && data.map(v=>{
    //   if(v.node.count){
    //     console.log('coutnsss',v.node.count)
    //     v.node.count = v.node.count >= 1 ?  v.node.count - 1 : v.node.count  
    //     // v.node.count = v.node.count === 0 ? v.node.count + 1 : null
    //     // console.log('logss',v.node.count);
    //   }
    //   return v
    // });
    // console.log('total',datas);

    // }

    // if(imgSelectExceed){
    //     ToastAndroid.showWithGravityAndOffset(
    //       "Only 9 images can be selected.!",
    //       ToastAndroid.SHORT,
    //       ToastAndroid.BOTTOM,
    //       25,
    //       50
    //     );
    //     return false;
    // }

  };

  sendMultiImage = () => {
    const { data, route, blobType } = this.state;
    // console.log('dataaa',data);
    if (!data) {
      return false;
    }
    const filteredMultiIMage = data.filter(m => m.node.isSelect);
    console.log('filter', filteredMultiIMage);
    if (filteredMultiIMage.length == 0) {
      if (Platform.OS !== 'ios') {
        ToastAndroid.showWithGravityAndOffset(
          "Must select atleast one",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return false;
      }
    }

    if (blobType == 'Videos' && filteredMultiIMage.length > 1) {
      if (Platform.OS !== 'ios') {
        ToastAndroid.showWithGravityAndOffset(
          "you can't select multiple video at once",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return false;
      }
    }

    if (filteredMultiIMage.length > 9) {
      if (Platform.OS !== 'ios') {
        ToastAndroid.showWithGravityAndOffset(
          "Can select only 9 images at once",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50
        );
        return false;
      }
    }

    let datas = {
      e: filteredMultiIMage,
      sImg: true
    };
    // data.map(m => !m.node.isSelect );
    const removeSelected = data.map(m => {
      m.node.isSelect = false;
      return m;
    });
    // console.log('remove selected',removeSelected);
    this.setState({ data: removeSelected, MI_isSelected: false })
    this.props.navigation.navigate(route, { imgProp: datas });
    // console.log('filterrd image',filteredMultiIMage);

  }

  renderedItems = (item, index) => {
    // console.log('items sr',item.node.image.uri)
    const { MI_isSelected, imgSelectExceed, } = this.state;
    return (
      <TouchableOpacity activeOpacity={0.8}
        //disabled = {imgSelectExceed?true:false}
        onPress={() => this.selectItem(item, index, MI_isSelected)}
      >

        <View key={index} style={[styles.imageViewForNF,
        {
          borderRightWidth: index % 3 == 2 ? 10 : 0,
          borderRightColor: index % 3 == 2 ? '#fff' : '#00000000',

        }
        ]}

        >
          <Image style={{ width: '100%', height: '100%', }}
            source={{ uri: item.node.image.uri }}
            resizeMode='cover'
          // resizeMethod="resize"
          />
        </View>


        {this.iSSelectMultiIcon(item, index)}
      </TouchableOpacity>
    )
  }

  pickerItems = () => {
    const { albumNames } = this.state
    return albumNames.constructor === Array && albumNames.length > 0 &&
      albumNames.map((k, i) => {
        return (
          // <View key={`id${i}`} style={{height : dh * .1,backgroundColor:'#c1c1c1'}}>
          //   <Text>{k.title}</Text>
          // </View>
          <Picker.Item key={i} label={k.title} value={k.title} />
        )
      });
  }

  renderAlbumItems = (item, index) => {
    // console.log('the items',item,'the ind',index)
    return (
      <View key={`id${index}`} style={{
        width: dw * .9, height: dh * .1, backgroundColor: '#c1c1c1',
        justifyContent: 'center'
      }}>
        <Text>{item.title}</Text>
      </View>
    )
  }

  FlatListItemSeparator = () => {
    return (
      <View style={{ height: .8, width: "100%", backgroundColor: "#ddd", }}
      />
    );
  }

  headerList = () => {
    const { blobType } = this.state
    return (
      <View>
        <TouchableHighlight onPress={() => this.setSelectedValue()}>
          <View style={{ width: dw * .9, justifyContent: 'center', }}>
            <Text style={{
              textAlign: 'center', padding: 12, fontSize: 12,
              fontFamily: Common_Color.fontMedium,
            }}>
              {blobType == 'Videos' ? 'All Videos' : 'All Photos'}
            </Text>
          </View>

        </TouchableHighlight>
        <View style={{ height: .8, width: "100%", backgroundColor: "#ddd", }}
        />
      </View>
    )
  }

  setSelectedValue = (value) => {
    console.log('the selecsd', value);
    this.refs.listmodal.close()
    this.setState({
      selectedAlbumName: value
    })
    if (invalidText(value)) {
      this.getGallery();
    } else {
      this.getGallery(value);
    }
  }

  selectMultiIcon = () => {
    const { MI_isSelected, blobType, multiPicNeed } = this.state;

    if (blobType == 'Videos') {
      if (Platform.OS !== 'ios') {
        ToastAndroid.showWithGravityAndOffset(
          "you can't select multiple video at once",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return false;
      }
    }
    if (!multiPicNeed) {
      if (Platform.OS !== 'ios') {
        ToastAndroid.showWithGravityAndOffset(
          "you can't select multiple picture in chat",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return false;
      }
    }
    this.setState({
      MI_isSelected: !MI_isSelected
    })

  }

  bottomView = () => {
    const { isSelectedImage, MI_isSelected, data } = this.state;
    const selectedCount = data.constructor == Array && data.filter(item => item.node.isSelect).length;
    if (MI_isSelected && selectedCount > 0) {
      return (
        <View style={styles.bottomView}>
          <TouchableOpacity onPress={() => this.sendMultiImage()}>
            <View style={styles.buttonView}>
              <Text style={styles.text}>NEXT</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    const { selectedAlbumName, MI_isSelected, blobType, visibleList } = this.state;

    return (
      <View style={[styles.maincontainer,]}>
        {/* <StatusBar  hidden 
        //backgroundColor="#fff" barStyle="dark-content" 
        />   */}
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />

        <View style={[styles.topView, { marginTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight }]}>

          <View style={styles.albumViewForNF}>

            <TouchableHighlight underlayColor={'#c1c1c1'} onPress={() => this.props.navigation.goBack()}
              style={{ justifyContent: 'center', }}>
              <View style={{ width: dw * 0.1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <Image source={require('../../../Assets/Images/backArrow.png')}
                  //  resizeMode={'center'}
                  style={{ width: 25, height: 25 }}
                />
              </View>
            </TouchableHighlight>

            <View style={{ justifyContent: 'center', alignItems: 'center', width: dw * 0.8, }}>


              <View style={{
                height: '40%', width: dw * 0.8,
                justifyContent: 'center', flexDirection: 'row'
              }}
              >
                <TouchableHighlight onPress={() => this.refs.listmodal.open()}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 15, paddingLeft: 15, }}>
                    <Text style={{ textAlign: 'center', fontSize: 12, fontFamily: Common_Color.fontMedium }}>
                      {!invalidText(selectedAlbumName) ?
                        selectedAlbumName.length > 12 ? selectedAlbumName.substring(0, 12) + '...' : selectedAlbumName
                        :
                        `All ${blobType == 'Videos' ? 'Videos' : 'Photos'} `
                      }
                    </Text>
                    <Image source={require('../../../Assets/Images/pickerIcon.png')}
                      // resizeMode={'center'}
                      style={{
                        width: 8, height: 8, alignSelf: 'center', marginLeft: 3
                        //top:dh * .035,right:dw * 0.29,position:'absolute',zIndex:1 
                      }}
                    />
                  </View>
                </TouchableHighlight>
              </View>
              {/* <Picker
              selectedValue={selectedAlbumName}
              style={{ height: '40%', width: 160,marginLeft:40,fontWeight:'bold',fontSize:12,
              backgroundColor: "transparent",  }}
              mode = {'dialog'}
              itemStyle={{ fontSize : 8, color : 'blue' }}
              onValueChange={(itemValue, itemIndex) => this.setSelectedValue(itemValue)}
             >
              <Picker.Item style={{fontSize:25}} label={`All ${blobType=='Videos'?'Videos':'Photos'} `} value="null" />
              {this.pickerItems()}
            </Picker> */}
              <Text style={{ fontSize: 10, color: '#313131', fontFamily: Common_Color.fontLight }}>Tap here to change album</Text>
            </View>

            <TouchableHighlight underlayColor='#c1c1c1' onPress={() => { blobType == 'Videos' ? null : this.sendMultiImage() }} style={{
              justifyContent: 'center',

            }}>
              <View style={{
                width: dw * 0.1, justifyContent: 'center', alignItems: 'center',
                overflow: 'hidden'
              }}>

                <Image source={require('../../../Assets/Images/backArrow.png')}
                  // resizeMode = {'center'}
                  style={{ width: 25, height: 25, transform: [{ rotate: '180deg' }] }}
                />

              </View>
            </TouchableHighlight>

            <View>

            </View>
          </View>

          {/* <View style={styles.multiSelectionView}>
            <TouchableOpacity onPress={()=>this.selectMultiIcon()}>
              <View style={[styles.boxBack,{borderColor: MI_isSelected ?'red':'#181818'}]} />
              <View style={[styles.boxFront,{borderColor: MI_isSelected ?'red':'#181818'}]} />
            </TouchableOpacity>
          </View> */}
        </View>


        <FlatList
          style={{ marginTop: 20, }}
          showsVerticalScrollIndicator={false}
          data={this.state.data}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          onEndReached={this.onScrollEndHandler}
          onEndThreshold={100}
          numColumns={3}
          renderItem={({ item, index }) => this.renderedItems(item, index)}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
        // removeClippedSubviews={true}
        />
        {/* <View style={{backgroundColor:'red',width:dw * 0.1,height:dh }} /> */}

        {this.bottomView()}

        <Modal style={{ width: dw * .9, height: dh * .6, backgroundColor: '#00000000' }}
          position={"center"}
          ref={"listmodal"}
          entry="bottom"
          useNativeDriver={true}
          backButtonClose={true}
          animationDuration={100}
          swipeToClose={true}
        >
          <View style={{
            width: dw * .9, height: dh * .6, backgroundColor: '#FFF',
            justifyContent: "center", overflow: 'hidden',
            alignItems: "center", borderRadius: 20
          }}>
            <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="light-content" />
            <FlatList
              data={this.state.albumNames}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={this.headerList}
              renderItem={({ item, index }) => (
                <TouchableHighlight onPress={() => this.setSelectedValue(item.title)}>
                  <View key={`id${index}`} style={{ width: dw * .9, justifyContent: 'center', }}>

                    <Text style={{ textAlign: 'center', padding: 12, fontSize: 12, fontFamily: Common_Color.fontMedium }}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableHighlight>
              )}
              keyExtractor={(item, index) => index.toString()}
            />

          </View>


        </Modal>

        {/* <Modal 
          animationType="fade"
          transparent={true}
          visible={visibleList}
          onRequestClose={() => {
            this.setState({visibleList:false})
          }}
          transparent = {true}
          style={{backgroundColor:'red'}}
           
          >
          
            <View style={{width:dw * .9,height:dh * .5,backgroundColor:'plum',
              justifyContent: "center",
              alignItems: "center",
             }}>


            </View>
            
         
        </Modal> */}

      </View>

    );
  }
}