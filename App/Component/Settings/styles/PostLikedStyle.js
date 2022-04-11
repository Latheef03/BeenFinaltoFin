import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react'
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create(
    {

        image: { width: 30, height: 30, borderRadius: 50, borderWidth: 1,  margin: '3%' },
        locationView: { marginLeft: wp(3), marginTop: hp(1) },
        hasNoMem: { justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,   },
        container: { width: wp('42.5%'), height: hp('33%'), marginTop: hp('3%'), borderRadius: 10, marginLeft: wp('5%') }
    }
)

export default (styles);