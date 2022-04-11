package com.quickblox.reactnative.pushsubscriptions;

import android.text.TextUtils;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.quickblox.messages.model.QBSubscription;

class PushSubscriptionsMapper {

    private PushSubscriptionsMapper() {
        //empty
    }

    static WritableMap qbSubscriptionToMap(QBSubscription subscription) {
        WritableMap map = new WritableNativeMap();

        if (subscription.getId() != null && subscription.getId() > 0) {
            map.putInt("id", subscription.getId());
        }
        if (!TextUtils.isEmpty(subscription.getDevice().getId())) {
            map.putString("deviceUdid", subscription.getDevice().getId());
        }
        if (!TextUtils.isEmpty(subscription.getRegistrationID())) {
            map.putString("deviceToken", subscription.getRegistrationID());
        }
        if (!TextUtils.isEmpty(subscription.getDevice().getPlatform().getCaption())) {
            String devicePlatform = subscription.getDevice().getPlatform().getCaption();
            map.putString("devicePlatform", devicePlatform);
        }
        if (!TextUtils.isEmpty(subscription.getNotificationChannel().getCaption())) {
            String value = subscription.getNotificationChannel().getCaption();
            String pushChannel = PushSubscriptionsConstants.PushChannelNames
                    .getNameByValue(value).eventValue;
            map.putString("pushChannel", pushChannel);
        }

        return map;
    }
}