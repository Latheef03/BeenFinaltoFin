/**
 *@import modules 
 */
import React, { Component } from 'react';
import {
  View, Image, FlatList, PermissionsAndroid, Platform, Text, Picker, TouchableOpacity,
  StatusBar, ToastAndroid
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import styles, { changeColor } from './styles';
import {deviceHeight as dh , deviceWidth as dw,invalidText} from '../../_utils/CommonUtils';
import {Common_Color} from '../../../Assets/Colors'
import Modal from 'react-native-modalbox'


/**
 *@Represents
 *@class Gallery Picker
 *@extends Component
 */

export default class GalleryPicker extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      route: '',
      albumNames: '',
      selectedAlbumName: '',
      MI_isSelected: false,
      isSelectedImage: false,
      selectedImgCount: '',
      imgSelectExceed: false,
      blobType: '',
      multiPicNeed: true,MultiModal:false
    };
  }

  async componentDidMount() {
    this.checkPermission()
  }

  checkPermission = async () => {
   // debugger;
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission Needed',
          message: 'Been would like to access your Gallery to further move.!',
        },
      );
      // console.log('result is ', result);
      if (result !== 'granted') {
        console.log('Access to pictures was denied');
        return;
      }
    }


    let screen = this.props.route.params.screen
    let blobtype = this.props.route.params.type
    let multiPic = this.props.route.params.multiPic
    

    // console.log('theat routes is ', screen, '===', blobtype)
    if (screen !== undefined && blobtype !== undefined) {
      this.setState({
        route: screen,
        blobType: blobtype
      })
    }

    if (multiPic != undefined) {
      this.setState({
        multiPicNeed: multiPic
      })
    }


    this.getGallery();
    this.getAlbumNames()
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
    console.log('params', params);
    CameraRoll.getPhotos(params)
      .then(res => {
        // console.log('albums results', res);
        let galleryBlobs = res.edges.length > 0 && res.edges.map((m, i) => {
          m.node.isSelect = false;
          m.node.id = i + 1;
          return m;
        });
        // console.log('ddd', galleryBlobs);
        this.setState({
          data: [...this.state.data,...galleryBlobs],
          hasNextPage: res.page_info.has_next_page,
          startCursor: res.page_info.start_cursor,
          endCursor: res.page_info.end_cursor,
          offset : this.state.offset + 1
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

  getGallery = (grpname = '') => {
    // console.log('get gallery ');
    const { blobType } = this.state;
    let gpName = grpname == '' ? null : { groupName: grpname,groupTypes: 'Album', };
    let AType = blobType == '' ? 'Photos' : blobType;
    let params = {
      first: 50,
      assetType: AType,
      ...gpName,
    }
    console.log('params', params);
    CameraRoll.getPhotos(params)
      .then(res => {
        // console.log('albums results', res);
        let galleryBlobs = res.edges.length > 0 && res.edges.map((m, i) => {
          m.node.isSelect = false;
          m.node.id = i + 1;
          return m;
        });
        // console.log('ddd', galleryBlobs);
        this.setState({ 
          data: galleryBlobs,
          hasNextPage: res.page_info.has_next_page,
          startCursor: res.page_info.start_cursor,
          endCursor: res.page_info.end_cursor,  
        });
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
        // console.log('albums results', res);
        this.setState({ albumNames: res });
      })
      .catch(error => {
        console.log('the error is ', error);
      });
  }

  iSSelectMultiIcon = (items) => {
    const { MI_isSelected, } = this.state
    const { node } = items;
    if (MI_isSelected) {
      return (
        <View style={[styles.selectCircle, {
          backgroundColor: node.isSelect ? 'red' : '#fff',
        }]} >
          <Image source={require('../../../Assets/Images/check_white.png')}
            style={styles.tick}
          />
          {/* <Text style={{ color: '#fff', textAlign: 'center' }}>{node.count}</Text> */}
        </View>
      )
    }
  }

  selectItem(item, i, multiSelect) {
debugger;
    const { data, imgSelectExceed, route } = this.state;
    const selectedNumber = data.filter(item => item.node.isSelect).length;

    if (!multiSelect) {
      let data = {
        e: [item],
        sImg: true
      }
      this.props.navigation.navigate(route, { imgProp: data });
    } else {

      item.node.isSelect = !item.node.isSelect;
      const index = data.findIndex(v => item.node.id === v.node.id);
      const itemNumber = data.filter(item => item.node.isSelect).length;
      item.node.count = itemNumber;
      // const counts = data.filter(item => item.node.count );
      // console.log('countss',counts);
      // item = !item.node.isSelect ? v.node.count ? v.node.count - 1 : 0 })
      data[index] = item;
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
      this.setState({
        data: data,
        // imgSelectExceed : itemNumber == 2 ? true : false
      });

    }

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
    debugger
    const { data, route } = this.state;
    if (!data) {
      return false;
    }
    const filteredMultiIMage = data.filter(m => m.node.isSelect);
    if (filteredMultiIMage.length > 9) {
      ToastAndroid.showWithGravityAndOffset(
        "Can select only 9 images at once",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50
      );
      return false;
    }
    let datas = {
      e: filteredMultiIMage,
      sImg: true,MultiModal:true
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
   // debugger;
    // console.log('items sr',index)
    const { MI_isSelected, imgSelectExceed } = this.state;
    return (
      <TouchableOpacity activeOpacity={0.8}
        //disabled = {imgSelectExceed?true:false}
        onPress={() => this.selectItem(item, index, MI_isSelected)}>

        <View key={index} style={[styles.imageView, { borderRightWidth: index % 3 == 2 ? 0 : 1 }]}>
          <Image style={{ width: '100%', height: '100%' }}
            source={{ uri: item.node.image.uri }} />

        </View>
        {this.iSSelectMultiIcon(item)}
      </TouchableOpacity>
    )
  }

  pickerItems = () => {
    const { albumNames } = this.state
    return albumNames.constructor === Array && albumNames.length > 0 &&
      albumNames.map((k, i) => {
        return (
          <Picker.Item key={i} label={k.title} value={k.title} />
        )
      });
  }
  
  setSelectedValue = (value) =>{
    this.refs.listmodal.close()
    this.setState({
      selectedAlbumName: value
    })
    if(invalidText(value)){
      this.getGallery();
    } else {
      this.getGallery(value);
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View style={{height: .8,width: "100%",backgroundColor: "#ddd",}}
      />
    );
  }

  onLayoutGet = e =>{
    console.log('the layout',e);
  }

  headerList = () =>{
    return(
      <View>
        <TouchableOpacity onPress={() => this.setSelectedValue()}>
          <View style={{ width: dw * .9, justifyContent: 'center', }}>
            <Text style={{ textAlign: 'center', padding: 12,fontSize:12,
            fontFamily:Common_Color.fontMedium,}}>
              ALBUMS
            </Text>
          </View>

        </TouchableOpacity>
        <View style={{ height: .8, width: "100%", backgroundColor: "#ddd", }}
        />
      </View>
    )
  }

 

  selectMultiIcon = () =>{
    const {MI_isSelected,blobType,multiPicNeed} = this.state;

    if(blobType == 'Videos'){
          ToastAndroid.showWithGravityAndOffset(
          "you can't select multiple video at once",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return false;
    }
    if (!multiPicNeed) {
      ToastAndroid.showWithGravityAndOffset(
        "you can't select multiple picture in chat",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return false;
    }
    this.setState({
      MI_isSelected: !MI_isSelected
    })

  }

  bottomView = () => {
   // debugger;
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
    const { selectedAlbumName, MI_isSelected } = this.state;
    return (
      <View style={[styles.maincontainer,{marginTop:Platform.OS==='ios' ? 50:StatusBar.currentHeight }]}>
        {/* <StatusBar hidden /> */}
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <View style={styles.topView}>
          <View style={styles.albumView}>

          <View style={{width:dw * 0.8,justifyContent:'center',alignItems:'flex-start',
           }}>
            

            <View style={{ height: dh * .4, width:dw * 0.8 ,
              justifyContent:'flex-start',flexDirection:'row'}}
            >
               <TouchableOpacity onPress={()=>this.refs.listmodal.open()}>
                 <View style={{ flexDirection: 'row',height:'100%', alignItems: 'center', paddingRight: 15, paddingLeft: 15,}}>
                   <Text style={{ textAlign: 'left',fontSize:12,fontFamily:Common_Color.fontMedium,
                     }}>
                    {!invalidText(selectedAlbumName) ? 
                      selectedAlbumName.length > 12 ? selectedAlbumName.substring(0,12)+'...' : selectedAlbumName
                      :
                      `ALBUMS`
                    }  
                   </Text>
                   <Image source={require('../../../Assets/Images/pickerIcon.png')}
                   // resizeMode={'center'}
                     style={{
                       width: 10, height: 10, alignSelf: 'center',marginLeft:3
                       //top:dh * .035,right:dw * 0.29,position:'absolute',zIndex:1 
                     }}
                   />
                 </View>
               </TouchableOpacity>
            </View>   
           </View>
            {/* <Picker
              selectedValue={selectedAlbumName}
              style={{ height: '100%', width: 130, }}
              mode={'dialog'}
              onValueChange={(itemValue, itemIndex) => this.setSelectedValue(itemValue)}
            >
              <Picker.Item label="ALBUMS" value="null" />
              {this.pickerItems()}
            </Picker> */}
          </View>

          <View style={styles.multiSelectionView}>
            <TouchableOpacity onPress={() => this.selectMultiIcon()}>
              <View style={[styles.boxBack, { borderColor: MI_isSelected ? 'red' : '#181818' }]} />
              <View style={[styles.boxFront, { borderColor: MI_isSelected ? 'red' : '#181818' }]} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.data}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          onEndReached={this.onScrollEndHandler}
          onEndThreshold={100}
          numColumns={3}
          renderItem={({ item, index }) => this.renderedItems(item, index)}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
        />

        {this.bottomView()}

        <Modal style={{width:dw * .9,height:dh * .6,backgroundColor:'#00000000'}} 
          position={"center"} 
          ref={"listmodal"} 
          entry = "bottom"
          useNativeDriver = {true}
          backButtonClose = {true}
          animationDuration = {100}
          swipeToClose={true}
          >
            <View style={{width:dw * .9,height:dh * .6,backgroundColor:'#FFF',
              justifyContent: "center",overflow: 'hidden',
              alignItems: "center",borderRadius:20
             }}>
              <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
               <FlatList
                data = {this.state.albumNames}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                showsVerticalScrollIndicator = {false}
                ListHeaderComponent = {this.headerList}
                renderItem={({ item, index }) => (
                 <TouchableOpacity onPress={()=>this.setSelectedValue(item.title)}>
                  <View key={`id${index}`} style={{ width:dw * .9,justifyContent: 'center',}}
                    onLayout={e=>this.onLayoutGet(e)}
                  >
                  
                    <Text style={{textAlign:'center',padding:12,fontSize:12,fontFamily:Common_Color.fontMedium}}> 
                       {item.title} 
                    </Text>
                  </View>
                 </TouchableOpacity>
                )}
                keyExtractor = {(item,index)=>index.toString()}
               />

            </View>

         
        </Modal>
      </View>

    );
  }
}