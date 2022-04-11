package com.quickblox.reactnative.helpers;

import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.List;
import java.util.Map;

public class EventsHelper {
    private static final String PAYLOAD = "payload";
    private static final String TYPE = "type";

    private EventsHelper() {
        //empty
    }

    public static <T> WritableMap buildResult(String eventName, T payload) {
        WritableMap map = new WritableNativeMap();

        if (!TextUtils.isEmpty(eventName)) {
            map.putString(TYPE, eventName);
        }

        if (payload != null) {
            fillPayloadMap(map, payload);
        }
        return map;
    }

    private static <T> void fillPayloadMap(WritableMap payloadMap, T payload) {
        if (payload instanceof String) {
            payloadMap.putString(PAYLOAD, (String) payload);
        } else if (payload instanceof Integer) {
            payloadMap.putInt(PAYLOAD, (Integer) payload);
        } else if (payload instanceof Boolean) {
            payloadMap.putBoolean(PAYLOAD, (Boolean) payload);
        } else if (payload instanceof Double) {
            payloadMap.putDouble(PAYLOAD, (Double) payload);
        } else if (payload instanceof List) {
            WritableArray array = Arguments.fromList((List) payload);
            payloadMap.putArray(PAYLOAD, array);
        } else if (payload instanceof WritableMap) {
            payloadMap.putMap(PAYLOAD, (WritableMap) payload);
        } else if (payload instanceof WritableArray) {
            payloadMap.putArray(PAYLOAD, (WritableArray) payload);
        } else if (payload instanceof Map) {
            try {
                Map<String, Object> objectsMap = (Map<String, Object>) payload;
                WritableMap writableMap = Arguments.makeNativeMap(objectsMap);
                payloadMap.putMap(PAYLOAD, writableMap);
            } catch (ClassCastException e) {
                //ignore
            }
        }
    }
}