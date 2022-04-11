package com.quickblox.reactnative.webrtc;

import com.quickblox.videochat.webrtc.BaseSession;
import com.quickblox.videochat.webrtc.QBRTCTypes;

import java.util.HashMap;
import java.util.Map;

public class WebRTCConstants {
    static final String RTC_SESSION_TYPE = "RTC_SESSION_TYPE";
    static final String RTC_SESSION_STATE = "RTC_SESSION_STATE";
    static final String RTC_PEER_CONNECTION_STATE = "RTC_PEER_CONNECTION_STATE";
    static final String EVENT_TYPE = "EVENT_TYPE";
    static final String RTC_VIEW_SCALE_TYPE = "RTC_VIEW_SCALE_TYPE";
    static final String AUDIO_OUTPUT = "AUDIO_OUTPUT";

    private WebRTCConstants() {
        //empty
    }

    ///////////////////////////////////////////////////////////////////////////
    // RTC SESSION TYPE
    ///////////////////////////////////////////////////////////////////////////
    enum RTCSessionType {
        VIDEO("VIDEO", 1),
        AUDIO("AUDIO", 2);

        String eventName;
        Integer eventType;

        RTCSessionType(String eventName, Integer eventType) {
            this.eventName = eventName;
            this.eventType = eventType;
        }

        static QBRTCTypes.QBConferenceType getTypeByValue(Integer value) {
            QBRTCTypes.QBConferenceType conferenceType = null;

            if (value.equals(RTCSessionType.VIDEO.eventType)) {
                conferenceType = QBRTCTypes.QBConferenceType.QB_CONFERENCE_TYPE_VIDEO;
            } else if (value.equals(RTCSessionType.AUDIO.eventType)) {
                conferenceType = QBRTCTypes.QBConferenceType.QB_CONFERENCE_TYPE_AUDIO;
            }

            return conferenceType;
        }

        static Integer getValueByType(QBRTCTypes.QBConferenceType conferenceType) {
            Integer value = null;
            if (conferenceType.equals(QBRTCTypes.QBConferenceType.QB_CONFERENCE_TYPE_AUDIO)) {
                value = AUDIO.eventType;
            } else if (conferenceType.equals(QBRTCTypes.QBConferenceType.QB_CONFERENCE_TYPE_VIDEO)) {
                value = VIDEO.eventType;
            }
            return value;
        }

        static Map<String, Integer> getAll() {
            Map<String, Integer> values = new HashMap<>();
            values.put(VIDEO.eventName, VIDEO.eventType);
            values.put(AUDIO.eventName, AUDIO.eventType);
            return values;
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    // RTC_SESSION_STATE
    ///////////////////////////////////////////////////////////////////////////
    enum RTCSessionState {
        NEW("NEW", 0),
        PENDING("PENDING", 1),
        CONNECTING("CONNECTING", 2),
        CONNECTED("CONNECTED", 3),
        CLOSED("CLOSED", 4);

        String eventName;
        Integer eventType;

        RTCSessionState(String eventName, Integer eventType) {
            this.eventName = eventName;
            this.eventType = eventType;
        }

        static Integer getValueByState(BaseSession.QBRTCSessionState state) {
            Integer value = null;
            if (state.equals(BaseSession.QBRTCSessionState.QB_RTC_SESSION_NEW)) {
                value = NEW.eventType;
            } else if (state.equals(BaseSession.QBRTCSessionState.QB_RTC_SESSION_PENDING)) {
                value = PENDING.eventType;
            } else if (state.equals(BaseSession.QBRTCSessionState.QB_RTC_SESSION_CONNECTING)) {
                value = CONNECTING.eventType;
            } else if (state.equals(BaseSession.QBRTCSessionState.QB_RTC_SESSION_CONNECTED)) {
                value = CONNECTED.eventType;
            } else if (state.equals(BaseSession.QBRTCSessionState.QB_RTC_SESSION_CLOSED)) {
                value = CLOSED.eventType;
            }
            return value;
        }

        static Map<String, Integer> getAll() {
            Map<String, Integer> values = new HashMap<>();
            values.put(NEW.eventName, NEW.eventType);
            values.put(PENDING.eventName, PENDING.eventType);
            values.put(CONNECTING.eventName, CONNECTING.eventType);
            values.put(CONNECTED.eventName, CONNECTED.eventType);
            values.put(CLOSED.eventName, CLOSED.eventType);
            return values;
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    // EVENT_TYPE
    ///////////////////////////////////////////////////////////////////////////
    enum EventType {
        CALL("CALL", "@QB/CALL"),
        CALL_END("CALL_END", "@QB/CALL_END"),

        NOT_ANSWER("NOT_ANSWER", "@QB/NOT_ANSWER"),
        REJECT("REJECT", "@QB/REJECT"),
        ACCEPT("ACCEPT", "@QB/ACCEPT"),
        HANG_UP("HANG_UP", "@QB/HANG_UP"),

        RECEIVED_VIDEO_TRACK("RECEIVED_VIDEO_TRACK", "@QB/RECEIVED_VIDEO_TRACK"),
        PEER_CONNECTION_STATE_CHANGED("PEER_CONNECTION_STATE_CHANGED", "@QB/PEER_CONNECTION_STATE_CHANGED");

        String eventName;
        String eventType;

        EventType(String eventName, String eventType) {
            this.eventName = eventName;
            this.eventType = eventType;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();

            values.put(CALL.eventName, CALL.eventType);
            values.put(CALL_END.eventName, CALL_END.eventType);

            values.put(NOT_ANSWER.eventName, NOT_ANSWER.eventType);
            values.put(REJECT.eventName, REJECT.eventType);
            values.put(ACCEPT.eventName, ACCEPT.eventType);
            values.put(HANG_UP.eventName, HANG_UP.eventType);

            values.put(RECEIVED_VIDEO_TRACK.eventName, RECEIVED_VIDEO_TRACK.eventType);
            values.put(PEER_CONNECTION_STATE_CHANGED.eventName, PEER_CONNECTION_STATE_CHANGED.eventType);

            return values;
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    // RTC_PEER_CONNECTION_STATE
    ///////////////////////////////////////////////////////////////////////////
    enum RTCPeerConnectionState {
        NEW("NEW", 0),
        CONNECTED("CONNECTED", 1),
        DISCONNECTED("DISCONNECTED", 2),
        FAILED("FAILED", 3),
        CLOSED("CLOSED", 4);

        String eventName;
        Integer eventType;

        RTCPeerConnectionState(String eventName, Integer eventType) {
            this.eventName = eventName;
            this.eventType = eventType;
        }

        static Map<String, Integer> getAll() {
            Map<String, Integer> values = new HashMap<>();

            values.put(NEW.eventName, NEW.eventType);
            values.put(CONNECTED.eventName, CONNECTED.eventType);
            values.put(FAILED.eventName, FAILED.eventType);
            values.put(DISCONNECTED.eventName, DISCONNECTED.eventType);
            values.put(CLOSED.eventName, CLOSED.eventType);

            return values;
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    // RTC_VIEW_SCALE_TYPE
    ///////////////////////////////////////////////////////////////////////////
    enum RTCViewScaleType {
        FILL("FILL", 0),
        FIT("FIT", 1),
        AUTO("AUTO", 2);

        String eventName;
        Integer eventType;

        RTCViewScaleType(String eventName, Integer eventType) {
            this.eventName = eventName;
            this.eventType = eventType;
        }

        static Map<String, Integer> getAll() {
            Map<String, Integer> values = new HashMap<>();

            values.put(FILL.eventName, FILL.eventType);
            values.put(FIT.eventName, FIT.eventType);
            values.put(AUTO.eventName, AUTO.eventType);

            return values;
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    //AUDIO OUTPUT
    ///////////////////////////////////////////////////////////////////////////
    enum AudioOutput {
        EARSPEAKER("EARSPEAKER", 0),
        LOUDSPEAKER("LOUDSPEAKER", 1),
        HEADPHONES("HEADPHONES", 2),
        BLUETOOTH("BLUETOOTH", 3);

        String name;
        Integer value;

        AudioOutput(String name, Integer value) {
            this.name = name;
            this.value = value;
        }

        static Map<String, Integer> getAll() {
            Map<String, Integer> values = new HashMap<>();
            values.put(EARSPEAKER.name, EARSPEAKER.value);
            values.put(LOUDSPEAKER.name, LOUDSPEAKER.value);
            values.put(HEADPHONES.name, HEADPHONES.value);
            values.put(BLUETOOTH.name, BLUETOOTH.value);
            return values;
        }
    }
}