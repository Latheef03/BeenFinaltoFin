package com.quickblox.reactnative.notificationevents;

import com.quickblox.messages.model.QBEventType;
import com.quickblox.messages.model.QBNotificationType;
import com.quickblox.messages.model.QBPushType;

import java.util.HashMap;
import java.util.Map;

class NotificationEventsConstants {

    static final String NOTIFICATION_EVENT_TYPE = "NOTIFICATION_EVENT_TYPE";
    static final String NOTIFICATION_TYPE = "NOTIFICATION_TYPE";
    static final String NOTIFICATION_EVENT_PERIOD = "NOTIFICATION_EVENT_PERIOD";
    static final String PUSH_TYPE = "PUSH_TYPE";

    private NotificationEventsConstants() {
        //empty
    }

    enum NotificationEventTypeNames {
        FIXED_DATE("FIXED_DATE", "fixed_date"),
        PERIOD_DATE("PERIOD_DATE", "period_date"),
        ONE_SHOT("ONE_SHOT", "one_shot");

        String eventName;
        String eventValue;

        NotificationEventTypeNames(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static NotificationEventTypeNames getTypeByValue(String value) {
            NotificationEventTypeNames eventTypeNames = null;
            if (value.equals(FIXED_DATE.eventValue)) {
                eventTypeNames = FIXED_DATE;
            } else if (value.equals(PERIOD_DATE.eventValue)) {
                eventTypeNames = PERIOD_DATE;
            } else if (value.equals(ONE_SHOT.eventValue)) {
                eventTypeNames = ONE_SHOT;
            }
            return eventTypeNames;
        }

        static QBEventType getQBEventTypeByValue(String value) {
            QBEventType eventType = null;
            if (value.equals(FIXED_DATE.eventValue)) {
                eventType = QBEventType.FIXED_DATE;
            } else if (value.equals(PERIOD_DATE.eventValue)) {
                eventType = QBEventType.PERIOD_DATE;
            } else if (value.equals(ONE_SHOT.eventValue)) {
                eventType = QBEventType.ONE_SHOT;
            }
            return eventType;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(FIXED_DATE.eventName, FIXED_DATE.eventValue);
            values.put(PERIOD_DATE.eventName, PERIOD_DATE.eventValue);
            values.put(ONE_SHOT.eventName, ONE_SHOT.eventValue);
            return values;
        }
    }

    enum NotificationTypeNames {
        PUSH("PUSH", "push"),
        EMAIL("EMAIL", "email");

        String eventName;
        String eventValue;

        NotificationTypeNames(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static NotificationTypeNames getTypeByValue(String value) {
            NotificationTypeNames typeNames = null;
            if (value.equals(PUSH.eventValue)) {
                typeNames = PUSH;
            } else if (value.equals(EMAIL.eventValue)) {
                typeNames = EMAIL;
            }
            return typeNames;
        }

        static QBNotificationType getQBNotificationTypeByValue(String value) {
            QBNotificationType notificationType = null;
            if (value.equals(PUSH.eventValue)) {
                notificationType = QBNotificationType.PUSH;
            } else if (value.equals(EMAIL.eventValue)) {
                notificationType = QBNotificationType.EMAIL;
            }
            return notificationType;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(PUSH.eventName, PUSH.eventValue);
            values.put(EMAIL.eventName, EMAIL.eventValue);
            return values;
        }
    }

    enum PushType {
        APNS("APNS", 1),
        APNS_VOIP("APNS_VOIP", 2),
        GCM("GCM", 3),
        MPNS("MPNS", 4);

        String eventName;
        Integer eventValue;

        PushType(String eventName, Integer value) {
            this.eventName = eventName;
            this.eventValue = value;
        }

        static PushType getTypeByValue(Integer value) {
            PushType pushType = null;
            if (value.equals(APNS.eventValue)) {
                pushType = APNS;
            } else if (value.equals(APNS_VOIP.eventValue)) {
                pushType = APNS_VOIP;
            } else if (value.equals(GCM.eventValue)) {
                pushType = GCM;
            } else if (value.equals(MPNS.eventValue)) {
                pushType = MPNS;
            }
            return pushType;
        }

        static PushType getValueByType(String value) {
            value = value.toUpperCase();
            PushType pushType = null;
            if (value.equals(APNS.eventName)) {
                pushType = APNS;
            } else if (value.equals(APNS_VOIP.eventName)) {
                pushType = APNS_VOIP;
            } else if (value.equals(GCM.eventName)) {
                pushType = GCM;
            } else if (value.equals(MPNS.eventName)) {
                pushType = MPNS;
            }
            return pushType;
        }

        static QBPushType getQBPushTypeByValue(Integer value) {
            QBPushType qbPushType = null;
            if (value.equals(APNS.eventValue)) {
                qbPushType = QBPushType.APNS;
            } else if (value.equals(APNS_VOIP.eventValue)) {
                qbPushType = QBPushType.APNS_VOIP;
            } else if (value.equals(GCM.eventValue)) {
                qbPushType = QBPushType.GCM;
            } else if (value.equals(MPNS.eventValue)) {
                qbPushType = QBPushType.MPNS;
            }
            return qbPushType;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(APNS.eventName, String.valueOf(APNS.eventValue));
            values.put(APNS_VOIP.eventName, String.valueOf(APNS_VOIP.eventValue));
            values.put(GCM.eventName, String.valueOf(GCM.eventValue));
            values.put(MPNS.eventName, String.valueOf(MPNS.eventValue));
            return values;
        }
    }

    enum NotificationEventPeriod {
        DAY("DAY", 86400),
        WEEK("WEEK", 604800),
        MONTH("MONTH", 2592000),
        YEAR("YEAR", 31557600);

        String eventName;
        Integer eventValue;

        NotificationEventPeriod(String eventName, Integer eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, Integer> getAll() {
            Map<String, Integer> values = new HashMap<>();
            values.put(DAY.eventName, DAY.eventValue);
            values.put(WEEK.eventName, WEEK.eventValue);
            values.put(MONTH.eventName, MONTH.eventValue);
            values.put(YEAR.eventName, YEAR.eventValue);
            return values;
        }

        static NotificationEventPeriod getPeriodByValue(Integer value) {
            NotificationEventPeriod eventPeriod = null;
            if (value.equals(DAY.eventValue)) {
                eventPeriod = DAY;
            } else if (value.equals(WEEK.eventValue)) {
                eventPeriod = WEEK;
            } else if (value.equals(MONTH.eventValue)) {
                eventPeriod = MONTH;
            } else if (value.equals(YEAR.eventValue)) {
                eventPeriod = YEAR;
            }
            return eventPeriod;
        }
    }
}