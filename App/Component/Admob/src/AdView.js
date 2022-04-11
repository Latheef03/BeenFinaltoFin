import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, DeviceEventEmitter, Text, View} from 'react-native';
import NativeAdView, {
  AdvertiserView,
  CallToActionView,
  HeadlineView,
  IconView,
  StarRatingView,
  StoreView,
  TaglineView,
} from 'react-native-admob-native-ads';
import {MediaView} from './MediaView';
import {adUnitIDs, Events, Logger} from './utils';

export const AdView = React.memo(({ type, loadOnMount = true}) => {
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const nativeAdRef = useRef();

  const onAdFailedToLoad = (event) => {
    setError(true);
    setLoading(false);
    Logger('AD', 'FAILED', event.error.message);
  };

  const onAdLoaded = () => {
    Logger('AD', 'LOADED', 'Ad has loaded successfully');
  };

  const onAdClicked = () => {
    Logger('AD', 'CLICK', 'User has clicked the Ad');
  };

  const onAdImpression = () => {
    Logger('AD', 'IMPRESSION', 'Ad impression recorded');
  };

  const onUnifiedNativeAdLoaded = (event) => {
    Logger('AD', 'RECIEVED', 'Unified ad  Recieved', event);
    setLoading(false);
    setLoaded(true);
    setError(false);
    setAspectRatio(event.aspectRatio);
  };

  const onAdLeftApplication = () => {
    Logger('AD', 'LEFT', 'Ad left application');
  };


  useEffect(() => {
    if (loadOnMount) {
      setLoading(true);
      setLoaded(false);
      setError(false)
      nativeAdRef.current?.loadAd();
    }
    return () => {
      setLoaded(false);
    };
  }, [type]);

  return (
    <NativeAdView
      ref={nativeAdRef}
      onAdLoaded={onAdLoaded}
      onAdFailedToLoad={onAdFailedToLoad}
      onAdLeftApplication={onAdLeftApplication}
      onAdClicked={onAdClicked}
      onAdImpression={onAdImpression}
      onUnifiedNativeAdLoaded={onUnifiedNativeAdLoaded}
      style={{
        width: '100%',
        height:'94%',
         marginLeft: 'auto', marginRight: 'auto',
        //  height:'auto',
      }}
      adUnitID={type === 'image' ? adUnitIDs.image : adUnitIDs.video} // REPLACE WITH NATIVE_AD_VIDEO_ID for video ads.
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginTop:10,
        }}>
        <View
          style={{
            width: '100%',
            height: "100%",
            backgroundColor: '#f0f0f0',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: !loading && !error && loaded ? 0 : 1,
            zIndex:!loading && !error && loaded ? 0 : 10
          }}>
          {loading && <ActivityIndicator size={28} color="#a9a9a9" />}
          {error && <Text style={{color: '#a9a9a9'}}>:-(</Text>}
        </View>

        <View
          style={{
            height: 100,
            marginTop:10,
            width: '100%',
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            opacity: loading || error || !loaded ? 0 : 1,
          }}>
          <IconView
            style={{
              width: 60,
              height: 60,
            }}
          />
          <View
            style={{
              width: '60%',
              maxWidth: '60%',
              paddingHorizontal: 6,
            }}>
            <HeadlineView
              hello="abc"
              style={{
                fontWeight: 'bold',
                fontSize: 13,
              }}
            />
            <TaglineView
              numberOfLines={2}
              style={{
                fontSize: 11,
                color:'green'
              }}
            />
            <AdvertiserView
              style={{
                fontSize: 10,
                color: 'blue',
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <StoreView
                style={{
                  fontSize: 12,
                  color:'#e1e1e1'
                }}
              />
              <StarRatingView
                starSize={12}
                fullStarColor="orange"
                emptyStarColor="gray"
                containerStyle={{
                  width: 75,
                  marginLeft: 20,
                }}
              />
            </View>
          </View>

          <CallToActionView
            style={{
              minHeight: 45,
              paddingHorizontal: 12,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 10,
              maxWidth: 100,
              width:80
            }}
            buttonAndroidStyle={{
              backgroundColor: '#00ff00',
              borderRadius: 5,
            }}
            allCaps
            textStyle={{
              fontSize: 13,
              flexWrap: 'wrap',
              textAlign: 'center',
            }}
          />
        </View>

       <MediaView aspectRatio={aspectRatio} /> 
      </View>
    </NativeAdView>
  );
});
