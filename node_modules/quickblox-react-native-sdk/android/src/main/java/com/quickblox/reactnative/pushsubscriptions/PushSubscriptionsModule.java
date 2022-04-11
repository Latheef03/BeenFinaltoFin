
package com.quickblox.reactnative.pushsubscriptions;

import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.quickblox.core.QBEntityCallback;
import com.quickblox.core.exception.QBResponseException;
import com.quickblox.core.helper.Utils;
import com.quickblox.messages.QBPushNotifications;
import com.quickblox.messages.model.QBEnvironment;
import com.quickblox.messages.model.QBNotificationChannel;
import com.quickblox.messages.model.QBSubscription;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class PushSubscriptionsModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "RNQBPushSubscriptionsModule";

    private ReactApplicationContext reactContext;

    public PushSubscriptionsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        //NOTIFICATION CHANNEL NAMES
        constants.put(PushSubscriptionsConstants.PUSH_CHANNEL,
                PushSubscriptionsConstants.PushChannelNames.getAll());

        return constants;
    }

    @ReactMethod
    public void create(ReadableMap data, final Promise promise) {
        String deviceToken = data != null && data.hasKey("deviceToken") ? data.getString("deviceToken") : null;
        String pushChannel = data != null && data.hasKey("pushChannel") ? data.getString("pushChannel") : null;

        if (TextUtils.isEmpty(deviceToken)) {
            promise.reject(new Exception("The registrationId is required parameter"));
            return;
        }

        QBSubscription qbSubscription = new QBSubscription();
        qbSubscription.setNotificationChannel(QBNotificationChannel.GCM);
        String deviceId = Utils.generateDeviceId(reactContext);
        qbSubscription.setDeviceUdid(deviceId);
        qbSubscription.setRegistrationID(deviceToken);

        if (!TextUtils.isEmpty(pushChannel)) {
            QBNotificationChannel notificationChannel = QBNotificationChannel.valueOf(pushChannel);
            qbSubscription.setNotificationChannel(notificationChannel);
        }

        qbSubscription.setEnvironment(QBEnvironment.DEVELOPMENT);

        QBPushNotifications.createSubscription(qbSubscription).performAsync(new QBEntityCallback<ArrayList<QBSubscription>>() {
            @Override
            public void onSuccess(ArrayList<QBSubscription> qbSubscriptions, Bundle bundle) {
                WritableArray array = new WritableNativeArray();
                for (QBSubscription subscription : qbSubscriptions) {
                    WritableMap map = PushSubscriptionsMapper.qbSubscriptionToMap(subscription);
                    array.pushMap(map);
                }
                promise.resolve(array);
            }

            @Override
            public void onError(QBResponseException e) {
                promise.reject(e);
            }
        });
    }

    @ReactMethod
    public void get(final Promise promise) {
        QBPushNotifications.getSubscriptions().performAsync(new QBEntityCallback<ArrayList<QBSubscription>>() {
            @Override
            public void onSuccess(ArrayList<QBSubscription> qbSubscriptions, Bundle bundle) {
                WritableArray array = new WritableNativeArray();
                for (QBSubscription subscription : qbSubscriptions) {
                    WritableMap map = PushSubscriptionsMapper.qbSubscriptionToMap(subscription);
                    array.pushMap(map);
                }
                promise.resolve(array);
            }

            @Override
            public void onError(QBResponseException e) {
                promise.reject(e);
            }
        });
    }

    @ReactMethod
    public void remove(ReadableMap data, final Promise promise) {
        Integer subscriptionId = data != null && data.hasKey("id") ? data.getInt("id") : null;

        if (subscriptionId == null) {
            promise.reject(new Exception("The subscriptionId is required parameter"));
            return;
        }

        QBPushNotifications.deleteSubscription(subscriptionId).performAsync(new QBEntityCallback<Void>() {
            @Override
            public void onSuccess(Void aVoid, Bundle bundle) {
                promise.resolve(null);
            }

            @Override
            public void onError(QBResponseException e) {
                promise.reject(e);
            }
        });
    }
}