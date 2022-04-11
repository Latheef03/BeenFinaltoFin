import React from 'react';
import { View, StyleSheet, StatusBarIOS,StatusBar } from 'react-native';
import {
  VisitCheckIn, LocationCIn, EnrouteMile, EnrouteBoard, EnrouteText,
  AwardFloral, GymTime, HikeDay, HalfBox, ChaiTime, Rectangle, Delicious, Run,
  HashTag, CurrentDay, CurrentDate
} from './Stickers';
import { deviceHeight as dh } from '../../_utils/CommonUtils'

export default DisplayStorySticker = ({ imgSticker, gPlaces, userHashTag, userData, navigation, onClose }) => {
  // console.log('the navigation DisplayStorySticker',navigation);
  return (
    <View style={{
      ...StyleSheet.absoluteFillObject, zIndex: 0,
      top: dh / 3 + StatusBar.currentHeight
    }}>
      {imgSticker.map((m, i) => (
        <View key={`id${i}`} >
          <VisitCheckIn isActive={m.id == 1}
            location={gPlaces} points={m.id == 1 ? m : {}}
            userData={userData}
            navigation={navigation}
            onClose={onClose}
          />
          <LocationCIn isActive={m.id == 2} points={m.id == 2 ? m : {}} />
          <EnrouteMile isActive={m.id == 3} points={m.id == 3 ? m : {}} />
          <EnrouteBoard isActive={m.id == 4} points={m.id == 4 ? m : {}} />
          <EnrouteText isActive={m.id == 5} points={m.id == 5 ? m : {}} />
          <AwardFloral isActive={m.id == 6} points={m.id == 6 ? m : {}} />
          <GymTime isActive={m.id == 7} points={m.id == 7 ? m : {}} />
          <HikeDay isActive={m.id == 8} points={m.id == 8 ? m : {}} />
          <HalfBox isActive={m.id == 9} points={m.id == 9 ? m : {}} />
          <ChaiTime isActive={m.id == 10} points={m.id == 10 ? m : {}} />
          <Rectangle isActive={m.id == 11} points={m.id == 11 ? m : {}} />
          <Delicious isActive={m.id == 12} points={m.id == 12 ? m : {}} />
          <Run isActive={m.id == 13} points={m.id == 13 ? m : {}} />
          <HashTag isActive={m.id == 14} userHashTag={userHashTag}
            points={m.id == 14 ? m : {}} />
          <CurrentDay isActive={m.id == 15} points={m.id == 15 ? m : {}} />
          <CurrentDate isActive={m.id == 16} points={m.id == 16 ? m : {}} />
        </View>
      ))}
    </View>
  )
}
