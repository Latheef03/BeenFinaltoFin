/**@Import_Modules */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, StatusBarIOS,StatusBar } from 'react-native';
import {
  VisitCheckIn, EnrouteMile, LocationCIn, EnrouteBoard,
  EnrouteText, AwardFloral, GymTime, HikeDay, ChaiTime,
  Rectangle, Delicious, Run, HalfBox, HashTag, CurrentDay, CurrentDate,
}
  from '../../Story/_sticker_compo';
import { deviceWidth as dw, deviceHeight as dh } from '../../_utils/CommonUtils'

/**
  @Main_Component called @DisplaySticker
  @The_Component was written by @MUFTHI :-)
*/
export default class DisplaySticker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hashtagEditable: true,
      // MI : [],
      // SMI : {}
    }
  }

  static getDerivedStateFromProps(props, state) {
    // console.log('the eceive props',props,'and sstate',state);
    if (props.sIndex !== state.sIndex) {
      return {
        SMI: props.SMI,
        MI: props.multiImage
      }
    }
    return null;
  }

  // componentDidMount(){
  //   console.log('component did mount ',this.props.SMI)
  //   this.setState({
  //     SMI : this.props.SMI
  //   })
  // }

  hashView = () => {
    const { sIndex, userHashTag } = this.props
    return (
      <View style={{
        flexDirection: 'row', justifyContent: 'center',
        backgroundColor: '#fff', padding: 10, borderRadius: 10
      }} >
        {/*#color pink = ef1b66 */}
        <Text style={[styles.hashText,]}>
          {userHashTag[sIndex] &&
            userHashTag[sIndex].hashtag &&
            userHashTag[sIndex].hashtag.length > 0
            ? '#' : null}
        </Text>
        <TextInput
          placeholderTextColor={'#ef1b669e'}
          placeholder='#Hashtag'
          underlineColorAndroid='transparent'
          style={styles.hashtagInput}
          onChangeText={(text) => {
            this.props.userHashTagOnType(text)
          }}
          autoCompleteType={'off'}
          autoCapitalize={'characters'}
          spellCheck={false}
          autoCorrect={false}
          // autoCorrect={false}
          //
          maxLength={15}
          editable={this.state.hashtagEditable}
          value={userHashTag[sIndex].hashtag}
        />
      </View>
    )
  }

  EmitterRoutes = (route, events, id) => {
    console.log('the events', route, events, id)
    switch (route) {
      case 'pan':
        this.panEmitter(events, id);
        break;
      case 'rot':
        this.REmitter(events, id);
        break;
      case 'pin':
        this.pinEmitter(events, id);
        break;
    }
  }

  panEmitter = (events, id) => {
    // console.log('the emitter events ==> ', events, '  id ==>', id)
    const { SMI, sIndex } = this.props;
    const index = SMI.imgSticker.findIndex(v => v.id == id);
    console.log('the SMI.imgSticker', SMI.imgSticker);
    let smi_dup
    if (SMI.imageIndex == sIndex) {
       smi_dup = SMI.imgSticker.map(s => {
        
        let s1 = {...s};
        
        if(s1.id == id){
          s1 = {...s1,panCoords:events}
        }
        console.log('the s', s1);
        return s1
      })
      
    }
    console.log('the smi_duo ',smi_dup);
    // if(SMI.imageIndex == sIndex){
    //   SMI.imgSticker[index] = { ...SMI.imgSticker[index],panCoords:events }
    // }
    const UpdatedSMI = {
      ...SMI,
      imgSticker: [...smi_dup]
    }
    this.updateStickerProps(UpdatedSMI)
    console.log('the updates SMI ', UpdatedSMI)
  }

  REmitter = (events, id) => {
    console.log('the emitter events ==> ', events, '  id ==>', id)
    const { SMI, sIndex } = this.props;
    const index = SMI.imgSticker.findIndex(v => v.id == id);
    if (SMI.imageIndex == sIndex) {
      SMI.imgSticker[index] = { ...SMI.imgSticker[index], rotate: events }
    }
    const UpdatedSMI = {
      ...SMI,
      imgSticker: [...SMI.imgSticker]
    }
    this.updateStickerProps(UpdatedSMI)
  }

  pinEmitter = (events, id) => {
    console.log('the emitter events ==> ', events, '  id ==>', id)
    const { SMI, sIndex } = this.props;
    const index = SMI.imgSticker.findIndex(v => v.id == id);
    if (SMI.imageIndex == sIndex) {
      SMI.imgSticker[index] = { ...SMI.imgSticker[index], pinch: events }
    }
    const UpdatedSMI = {
      ...SMI,
      imgSticker: [...SMI.imgSticker]
    }
    this.updateStickerProps(UpdatedSMI)
  }

  updateStickerProps = (updated_props) => {
    const { SMI, multiImage } = this.props;
    console.log('the updated indx ==> ', SMI.imageIndex)
    const updateMultiImage = multiImage.map((image) => {
      if (image.imageIndex === SMI.imageIndex) {
        image = updated_props;
      }
      return image;
    });
    console.log('the updates props', updateMultiImage, updated_props)
    this.props.revertMIData(updateMultiImage, updated_props);
  };



  render() {
    const { isStickersExist, stickers, days, date, getLocation
      , SMI, multiImage, sIndex, deleteStickers } = this.props;

    return (
      isStickersExist && (
        <View style={{
          flex: 1,
          ...StyleSheet.absoluteFillObject,
          zIndex: 0,
          top: dh / 3 + StatusBar.currentHeight
        }}>
          {stickers.map((m, i) => (
            <View key={`id${i}`} style={{
              // position:'absolute',
              // top:StatusBar.currentHeight + 20,right:10
            }}
            >
              <VisitCheckIn isActive={m.id == 1} location={getLocation}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 1 ? m : {}}
                sticId={m.id == 1 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <LocationCIn isActive={m.id == 2}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 2 ? m : {}}
                sticId={m.id == 2 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}

              />
              <EnrouteMile isActive={m.id == 3}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 3 ? m : {}}
                sticId={m.id == 3 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <EnrouteBoard isActive={m.id == 4}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 4 ? m : {}}
                sticId={m.id == 4 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <EnrouteText isActive={m.id == 5}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 5 ? m : {}}
                sticId={m.id == 5 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <AwardFloral isActive={m.id == 6}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 6 ? m : {}}
                sticId={m.id == 6 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <GymTime isActive={m.id == 7}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 7 ? m : {}}
                sticId={m.id == 7 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <HikeDay isActive={m.id == 8}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 8 ? m : {}}
                sticId={m.id == 8 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <HalfBox isActive={m.id == 9}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 9 ? m : {}}
                sticId={m.id == 9 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <ChaiTime isActive={m.id == 10}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 10 ? m : {}}
                sticId={m.id == 10 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <Rectangle isActive={m.id == 11}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 11 ? m : {}}
                sticId={m.id == 11 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <Delicious isActive={m.id == 12}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 12 ? m : {}}
                sticId={m.id == 12 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <Run isActive={m.id == 13}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 13 ? m : {}}
                sticId={m.id == 13 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <HashTag isActive={m.id == 14} children={this.hashView()}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 14 ? m : {}}
                sticId={m.id == 14 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <CurrentDay isActive={m.id == 15} children={days != null ? days : <View />}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 15 ? m : {}}
                sticId={m.id == 15 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />
              <CurrentDate isActive={m.id == 16} children={date != null ? date : <View />}
                multiImage={multiImage}
                SMI={SMI}
                sIndex={sIndex}
                points={m.id == 16 ? m : {}}
                sticId={m.id == 16 ? m.id : -1}
                EmitterRoutes={(r, e, id) => this.EmitterRoutes(r, e, id)}
                deleteStickers={(state, id) => deleteStickers(state, id)}
              />

            </View>
          ))}

        </View>
      )

    )
  }
}

const styles = {
  hashText: {
    padding: 10,
    paddingRight: 0,
    color: '#ef1b66',
    fontSize: 22,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    paddingTop: 18,
    paddingBottom: 18,
    borderTopLeftRadius: 10, borderBottomLeftRadius: 10
  },
  hashtagInput: {
    color: '#ef1b66',
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    paddingLeft: 0,
    backgroundColor: '#fff',
    borderTopRightRadius: 10, borderBottomRightRadius: 10

  },
}