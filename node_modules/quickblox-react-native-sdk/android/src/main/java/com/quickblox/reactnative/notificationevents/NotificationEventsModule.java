package com.quickblox.reactnative.notificationevents;

import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.quickblox.core.QBEntityCallback;
import com.quickblox.core.exception.QBResponseException;
import com.quickblox.core.helper.StringifyArrayList;
import com.quickblox.core.request.QBPagedRequestBuilder;
import com.quickblox.messages.QBPushNotifications;
import com.quickblox.messages.model.QBEnvironment;
import com.quickblox.messages.model.QBEvent;
import com.quickblox.messages.model.QBEventType;
import com.quickblox.messages.model.QBNotificationType;
import com.quickblox.messages.model.QBPushType;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class NotificationEventsModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "RNQBNotificationEventsModule";

    private ReactApplicationContext reactContext;

    public NotificationEventsModule(ReactApplicationContext reactContext) {
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

        //NOTIFICATION_EVENT_TYPE
        constants.put(NotificationEventsConstants.NOTIFICATION_EVENT_TYPE,
                NotificationEventsConstants.NotificationEventTypeNames.getAll());

        //NOTIFICATION_TYPE
        constants.put(NotificationEventsConstants.NOTIFICATION_TYPE,
                NotificationEventsConstants.NotificationTypeNames.getAll());

        //NOTIFICATION_EVENT_PERIOD
        constants.put(NotificationEventsConstants.NOTIFICATION_EVENT_PERIOD,
                NotificationEventsConstants.NotificationEventPeriod.getAll());

        //PUSH_TYPE
        constants.put(NotificationEventsConstants.PUSH_TYPE, NotificationEventsConstants.PushType.getAll());

        return constants;
    }

    @ReactMethod
    public void create(ReadableMap data, final Promise promise) {
        Integer id = data != null && data.hasKey("id") ? data.getInt("id") : null;
        Boolean active = data != null && data.hasKey("active") ? data.getBoolean("active") : null;
        String name = data != null && data.hasKey("name") ? data.getString("name") : null;
        String type = data != null && data.hasKey("type") ? data.getString("type") : null;
        String notificationType = data != null && data.hasKey("notificationType") ? data.getString("notificationType") : null;
        Integer pushType = data != null && data.hasKey("pushType") ? data.getInt("pushType") : null;
        Double date = data != null && data.hasKey("date") ? data.getDouble("date") : null;
        Integer endDate = data != null && data.hasKey("endDate") ? data.getInt("endDate") : null;
        String period = data != null && data.hasKey("period") ? data.getString("period") : null;
        Integer occuredCount = data != null && data.hasKey("occuredCount") ? data.getInt("occuredCount") : null;
        Integer senderId = data != null && data.hasKey("senderId") ? data.getInt("senderId") : null;
        ReadableArray recipientsIds = data != null && data.hasKey("recipientsIds") ? data.getArray("recipientsIds") : null;
        ReadableArray recipientsTagsAny = data != null && data.hasKey("recipientsTagsAny") ? data.getArray("recipientsTagsAny") : null;
        ReadableArray recipientsTagsAll = data != null && data.hasKey("recipientsTagsAll") ? data.getArray("recipientsTagsAll") : null;
        ReadableArray recipientsTagsExclude = data != null && data.hasKey("recipientsTagsExclude") ? data.getArray("recipientsTagsExclude") : null;
        ReadableMap payload = data != null && data.hasKey("payload") ? data.getMap("payload") : null;

        if (TextUtils.isEmpty(type) || TextUtils.isEmpty(notificationType) || senderId == null || senderId <= 0) {
            promise.reject(new Exception("The type, notificationType, senderId are required parameters"));
            return;
        }

        QBEvent qbEvent = new QBEvent();
        qbEvent.setNotificationType(QBNotificationType.PUSH);

        qbEvent.setUserId(senderId);

        if (id != null && id > 0) {
            qbEvent.setId(id);
        }

        if (active != null) {
            qbEvent.setActive(active);
        }

        qbEvent.setEnvironment(QBEnvironment.DEVELOPMENT);

        if (!TextUtils.isEmpty(name)) {
            qbEvent.setName(name);
        }

        QBEventType eventType = NotificationEventsConstants.NotificationEventTypeNames.getQBEventTypeByValue(type);
        qbEvent.setType(eventType);

        if (eventType.equals(QBEventType.FIXED_DATE) || eventType.equals(QBEventType.PERIOD_DATE)) {
            if (date == null || date <= 0) {
                promise.reject(new Exception("The date is required parameter for type " + eventType.toString()));
                return;
            } else {
                long modifiedDate = date.longValue();
                modifiedDate = modifiedDate / 1000;
                int eventDate = (int) modifiedDate;
                qbEvent.setDate(eventDate);
            }
        }

        if (!TextUtils.isEmpty(notificationType)) {
            QBNotificationType qbNotificationType = NotificationEventsConstants.NotificationTypeNames
                    .getQBNotificationTypeByValue(notificationType);
            qbEvent.setNotificationType(qbNotificationType);
        }

        if (pushType != null && pushType > 0) {
            QBPushType qbPushType = NotificationEventsConstants.PushType.getQBPushTypeByValue(pushType);
            qbEvent.setPushType(qbPushType);
        }

        if (endDate != null && endDate > 0) {
            qbEvent.setEndDate(endDate);
        }

        if (!TextUtils.isEmpty(period)) {
            Integer qbEventPeriod = Integer.valueOf(period);
            qbEvent.setPeriod(qbEventPeriod);
        }

        if (occuredCount != null && occuredCount > 0) {
            qbEvent.setOccuredCount(occuredCount);
        }

        if (recipientsIds != null && recipientsIds.size() > 0) {
            StringifyArrayList<Integer> userIds = new StringifyArrayList<>();
            for (int index = 0; index < recipientsIds.size(); index++) {
                Integer userId = recipientsIds.getInt(index);
                userIds.add(userId);
            }
            qbEvent.setUserIds(userIds);
        }

        if (recipientsTagsAny != null && recipientsTagsAny.size() > 0) {
            StringifyArrayList<String> userTagsAny = new StringifyArrayList<>();
            for (int index = 0; index < recipientsTagsAny.size(); index++) {
                String userTag = recipientsTagsAny.getString(index);
                userTagsAny.add(userTag);
            }
            qbEvent.setUserTagsAny(userTagsAny);
        }

        if (recipientsTagsAll != null && recipientsTagsAll.size() > 0) {
            StringifyArrayList<String> userTagsAll = new StringifyArrayList<>();
            for (int index = 0; index < recipientsTagsAll.size(); index++) {
                String userTag = recipientsTagsAll.getString(index);
                userTagsAll.add(userTag);
            }
            qbEvent.setUserTagsAll(userTagsAll);
        }

        if (recipientsTagsExclude != null && recipientsTagsExclude.size() > 0) {
            StringifyArrayList<String> userTagsExclude = new StringifyArrayList<>();
            for (int index = 0; index < recipientsTagsExclude.size(); index++) {
                String userTag = recipientsTagsExclude.getString(index);
                userTagsExclude.add(userTag);
            }
            qbEvent.setUserTagsExclude(userTagsExclude);
        }

        if (payload != null && payload.toHashMap().size() > 0) {
            HashMap<String, Object> payloadMap = payload.toHashMap();
            JSONObject json = new JSONObject(payloadMap);
            String qbEventPayload = json.toString();
            qbEvent.setMessage(qbEventPayload);
        }

        QBPushNotifications.createEvent(qbEvent).performAsync(new QBEntityCallback<QBEvent>() {
            @Override
            public void onSuccess(QBEvent qbEvent, Bundle bundle) {
                WritableMap map = NotificationEventsMapper.qbEventToMap(qbEvent);
                promise.resolve(map);
            }

            @Override
            public void onError(QBResponseException e) {
                promise.reject(e);
            }
        });
    }

    @ReactMethod
    public void update(ReadableMap data, final Promise promise) {
        Integer id = data != null && data.hasKey("id") ? data.getInt("id") : null;
        Boolean active = data != null && data.hasKey("active") ? data.getBoolean("active") : null;
        ReadableMap payload = data != null && data.hasKey("payload") ? data.getMap("payload") : null;
        Double date = data != null && data.hasKey("date") ? data.getDouble("date") : null;
        String period = data != null && data.hasKey("period") ? data.getString("period") : null;
        String name = data != null && data.hasKey("name") ? data.getString("name") : null;

        QBEvent qbEvent = new QBEvent();
        qbEvent.setNotificationType(QBNotificationType.PUSH);

        if (id == null || id <= 0) {
            promise.reject(new Exception("The id is required parameter"));
            return;
        }

        qbEvent.setEnvironment(QBEnvironment.DEVELOPMENT);

        qbEvent.setId(id);

        if (active != null) {
            qbEvent.setActive(active);
        }

        if (payload != null && payload.toHashMap().size() > 0) {
            HashMap<String, Object> payloadMap = payload.toHashMap();
            JSONObject json = new JSONObject(payloadMap);
            String qbEventPayload = json.toString();
            qbEvent.setMessage(qbEventPayload);
        }

        if (date != null && date > 0) {
            long modifiedDate = date.longValue();
            modifiedDate = modifiedDate / 1000;
            int eventDate = (int) modifiedDate;
            qbEvent.setDate(eventDate);
        }

        if (!TextUtils.isEmpty(period)) {
            Integer qbEventPeriod = Integer.valueOf(period);
            qbEvent.setPeriod(qbEventPeriod);
        }

        if (!TextUtils.isEmpty(name)) {
            qbEvent.setName(name);
        }

        QBPushNotifications.updateEvent(qbEvent).performAsync(new QBEntityCallback<QBEvent>() {
            @Override
            public void onSuccess(QBEvent qbEvent, Bundle bundle) {
                WritableMap map = NotificationEventsMapper.qbEventToMap(qbEvent);
                promise.resolve(map);
            }

            @Override
            public void onError(QBResponseException e) {
                promise.reject(e);
            }
        });
    }

    @ReactMethod
    public void remove(ReadableMap data, final Promise promise) {
        Integer eventId = data != null && data.hasKey("id") ? data.getInt("id") : null;

        if (eventId == null || eventId <= 0) {
            promise.reject(new Exception("The parameter id is required"));
            return;
        }

        QBPushNotifications.deleteEvent(eventId).performAsync(new QBEntityCallback<Void>() {
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

    @ReactMethod
    public void getById(ReadableMap data, final Promise promise) {
        Integer eventId = data != null && data.hasKey("id") ? data.getInt("id") : null;

        if (eventId == null || eventId <= 0) {
            promise.reject(new Exception("The parameter id is required"));
            return;
        }

        QBPushNotifications.getEvent(eventId).performAsync(new QBEntityCallback<QBEvent>() {
            @Override
            public void onSuccess(QBEvent qbEvent, Bundle bundle) {
                WritableMap map = NotificationEventsMapper.qbEventToMap(qbEvent);
                promise.resolve(map);
            }

            @Override
            public void onError(QBResponseException e) {
                promise.reject(e);
            }
        });
    }

    @ReactMethod
    public void get(ReadableMap data, final Promise promise) {
        int page = data != null && data.hasKey("page") ? data.getInt("page") : 1;
        int perPage = data != null && data.hasKey("perPage") ? data.getInt("perPage") : 10;

        QBPagedRequestBuilder requestBuilder = new QBPagedRequestBuilder();
        requestBuilder.setPage(page);
        requestBuilder.setPerPage(perPage);

        QBPushNotifications.getEvents(requestBuilder, null).performAsync(new QBEntityCallback<ArrayList<QBEvent>>() {
            @Override
            public void onSuccess(ArrayList<QBEvent> qbEvents, Bundle bundle) {
                WritableArray array = new WritableNativeArray();
                for (QBEvent qbEvent : qbEvents) {
                    WritableMap map = NotificationEventsMapper.qbEventToMap(qbEvent);
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
}