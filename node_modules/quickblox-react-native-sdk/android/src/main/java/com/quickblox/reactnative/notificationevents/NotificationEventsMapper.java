package com.quickblox.reactnative.notificationevents;

import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.quickblox.messages.model.QBEvent;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class NotificationEventsMapper {

    private NotificationEventsMapper() {
        //empty
    }

    static WritableMap qbEventToMap(QBEvent event) {
        WritableMap map = new WritableNativeMap();

        if (event.getId() != null && event.getId() > 0) {
            map.putInt("id", event.getId());
        }
        if (!TextUtils.isEmpty(event.getName())) {
            map.putString("name", event.getName());
        }
        if (event.isActive() != null) {
            map.putBoolean("active", event.isActive());
        }
        if (event.getNotificationType() != null && !TextUtils.isEmpty(event.getNotificationType().getCaption())) {
            String value = event.getNotificationType().getCaption();
            String notificationType = NotificationEventsConstants.NotificationTypeNames.getTypeByValue(value).eventValue;
            map.putString("notificationType", notificationType);
        }
        if (!TextUtils.isEmpty(event.getNotificationChannel().getCaption())) {
            String eventNotificationChannel = event.getNotificationChannel().getCaption();
            Integer pushType = NotificationEventsConstants.PushType.getValueByType(eventNotificationChannel).eventValue;
            map.putInt("pushType", pushType);
        }
        if (event.getDate() != null && event.getDate() > 0) {
            double date = event.getDate().doubleValue();
            map.putDouble("date", date);
        }
        if (event.getEndDate() != null && event.getEndDate() > 0) {
            double endDate = event.getEndDate().doubleValue();
            map.putDouble("endDate", endDate);
        }
        if (event.getPeriod() != null && event.getPeriod() > 0) {
            Integer value = event.getPeriod();
            Integer period = NotificationEventsConstants.NotificationEventPeriod.getPeriodByValue(value).eventValue;
            map.putInt("period", period);
        }
        if (event.getOccuredCount() != null && event.getOccuredCount() > 0) {
            map.putInt("occuredCount", event.getOccuredCount());
        }
        if (event.getUserId() != null && event.getUserId() > 0) {
            map.putInt("senderId", event.getUserId());
        }
        if (event.getUserIds() != null && event.getUserIds().size() > 0) {
            WritableArray array = Arguments.fromList(event.getUserIds());
            map.putArray("recipientsIds", array);
        }
        if (event.getUserTagsAny() != null && event.getUserTagsAny().size() > 0) {
            WritableArray array = Arguments.fromList(event.getUserTagsAny());
            map.putArray("recipientsTagsAny", array);
        }
        if (event.getUserTagsAll() != null && event.getUserTagsAll().size() > 0) {
            WritableArray array = Arguments.fromList(event.getUserTagsAll());
            map.putArray("recipientsTagsAll", array);
        }
        if (event.getUserTagsExclude() != null && event.getUserTagsExclude().size() > 0) {
            WritableArray array = Arguments.fromList(event.getUserTagsAny());
            map.putArray("recipientsTagsExclude", array);
        }
        if (!TextUtils.isEmpty(event.getMessage())) {
            String qbEventMessage = event.getMessage();
            WritableMap payload = getMessage(qbEventMessage);
            map.putMap("payload", payload);
        }

        return map;
    }

    private static WritableMap getMessage(String qbEventMessage) {
        WritableMap map = new WritableNativeMap();
        String[] splittedMessage = TextUtils.split(qbEventMessage, "&");
        if (splittedMessage != null && splittedMessage.length > 0) {
            List<String> splittedList = new ArrayList<>();
            Collections.addAll(splittedList, splittedMessage);
            for (String element : splittedList) {
                String key = element.substring(0, element.indexOf("="));
                String value = element.substring(element.indexOf("=") + 1);
                map.putString(key, value);
            }
        }

        return map;
    }
}