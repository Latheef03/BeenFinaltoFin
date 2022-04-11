package com.quickblox.reactnative.pushsubscriptions;

import java.util.HashMap;
import java.util.Map;

class PushSubscriptionsConstants {

    static final String PUSH_CHANNEL = "PUSH_CHANNEL";

    private PushSubscriptionsConstants() {
        //empty
    }

    enum PushChannelNames {

        GCM("GCM", "gcm"),
        APNS("APNS", "apns"),
        APNS_VOIP("APNS_VOIP", "apns_voip"),
        EMAIL("EMAIL", "email");

        String eventName;
        String eventValue;

        PushChannelNames(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> pushChannelNames = new HashMap<>();
            pushChannelNames.put(GCM.eventName, GCM.eventValue);
            pushChannelNames.put(APNS.eventName, GCM.eventValue);
            pushChannelNames.put(APNS_VOIP.eventName, APNS.eventValue);
            pushChannelNames.put(EMAIL.eventName, APNS_VOIP.eventValue);
            return pushChannelNames;
        }

        static PushChannelNames getNameByValue(String value) {
            PushChannelNames channelNames = null;
            if (value.equals(PushChannelNames.GCM.eventValue)) {
                channelNames = GCM;
            } else if (value.equals(PushChannelNames.APNS.eventValue)) {
                channelNames = APNS;
            } else if (value.equals(PushChannelNames.APNS_VOIP.eventValue)) {
                channelNames = APNS_VOIP;
            } else if (value.equals(PushChannelNames.EMAIL.eventValue)) {
                channelNames = EMAIL;
            }
            return channelNames;
        }
    }
}