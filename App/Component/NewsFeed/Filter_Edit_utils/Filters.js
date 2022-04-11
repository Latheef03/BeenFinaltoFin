import React, { useState, useEffect } from 'react'
import {
    Normal, Sepia, Warm, Cool, Grayscale,
    Vintage, Tint, ToBGR, Invert, Technicolor,
    Polaroid,
} from 'react-native-color-matrix-image-filters';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import FData from './FiltersData';


export default Filters = ({ sImage, MIData, revertData }) => {

    const setFilterForImage = (fID) => {
        const updatedSI = {
            ...sImage,
            filterId : fID
        }
        const updatedMi = MIData.map((img)=>{
            if(img.imageIndex == sImage.imageIndex){
                img = updatedSI
            }
            return img;
        });
        revertData(updatedSI,updatedMi);
    }

    return (
        <ScrollView horizontal={true} style={{ width: '100%', height: '28%', }} showsHorizontalScrollIndicator={false}>
            <NormalFilt src={sImage.uri} fId={0} onPress={(fid) => setFilterForImage(fid)} />
            <SepiaFilt src={sImage.uri} fId={1} onPress={(fid) => setFilterForImage(fid)} />
            <WarmFilt src={sImage.uri} fId={2} onPress={(fid) => setFilterForImage(fid)} />
            <CoolFilt src={sImage.uri} fId={3} onPress={(fid) => setFilterForImage(fid)} />
            <GrayscaleFilt src={sImage.uri} fId={4} onPress={(fid) => setFilterForImage(fid)} />
            <VintageFilt src={sImage.uri} fId={5} onPress={(fid) => setFilterForImage(fid)} />
            <TintFilt src={sImage.uri} fId={6} onPress={(fid) => setFilterForImage(fid)} />
            <ToBGRFilt src={sImage.uri} fId={7} onPress={(fid) => setFilterForImage(fid)} />
            <InvertFilt src={sImage.uri} fId={8} onPress={(fid) => setFilterForImage(fid)} />
            <TechnicolorFilt src={sImage.uri} fId={9} onPress={(fid) => setFilterForImage(fid)} />
            <PolaroidFilt src={sImage.uri} fId={10} onPress={(fid) => setFilterForImage(fid)} />
        </ScrollView>
    )
}

const NormalFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <Normal>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </Normal>
    </TouchableOpacity>
);
const SepiaFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <Sepia>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </Sepia>
    </TouchableOpacity >
);
const WarmFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <Warm>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </Warm>
    </TouchableOpacity >
);
const CoolFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <Cool>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </Cool>
    </TouchableOpacity >
);
const GrayscaleFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <Grayscale>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </Grayscale>
    </TouchableOpacity >
);

const VintageFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <Vintage>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </Vintage>
    </TouchableOpacity >
);
const TintFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <Tint>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </Tint>
    </TouchableOpacity >
);
const ToBGRFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <ToBGR>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </ToBGR>
    </TouchableOpacity >
);
const InvertFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <Invert>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </Invert>
    </TouchableOpacity >
);
const TechnicolorFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <Technicolor>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </Technicolor>
    </TouchableOpacity >
);
const PolaroidFilt = ({ src, fId, onPress }) => (
    <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(fId)} >
        <Polaroid>
            <Image source={{ uri: src }} style={styles.imgSty} />
        </Polaroid>
    </TouchableOpacity >
);

const styles = {
    imgSty: {
        width: 90, height: 100, marginRight: 10
    }
}