import React from 'react';
import { View,Image,StyleSheet } from 'react-native';

export default DisplaySketch = ({sketch}) =>(
    sketch.length > 0 &&
    sketch.map((m, i) => (
        <View key={`id${i}`} style={{ ...StyleSheet.absoluteFillObject }} >
            <Image style={{ width: "100%", height: "100%" }}
               source={{ uri: m.uri }}
             />
        </View>
      ))
)