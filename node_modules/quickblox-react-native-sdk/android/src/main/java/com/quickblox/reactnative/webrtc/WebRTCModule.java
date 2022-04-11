package com.quickblox.reactnative.webrtc;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.quickblox.chat.QBChatService;
import com.quickblox.reactnative.RNQbReactnativePackage;
import com.quickblox.videochat.webrtc.QBRTCSession;
import com.quickblox.videochat.webrtc.QBRTCTypes;

import org.webrtc.CameraVideoCapturer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

public class WebRTCModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "RNQBWebRTCModule";

    protected ReactApplicationContext reactContext;

    private WebRTCCallService webRTCCallService;
    private ServiceConnection callServiceConnection;

    private RNQbReactnativePackage.ModuleEvents moduleEvents;

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        //RTC_SESSION_TYPE
        constants.put(WebRTCConstants.RTC_SESSION_TYPE, WebRTCConstants.RTCSessionType.getAll());

        //RTC_SESSION_TYPE
        constants.put(WebRTCConstants.RTC_SESSION_STATE, WebRTCConstants.RTCSessionState.getAll());

        //RTC_PEER_CONNECTION_STATE
        constants.put(WebRTCConstants.RTC_PEER_CONNECTION_STATE, WebRTCConstants.RTCPeerConnectionState.getAll());

        //EVENT_TYPE
        constants.put(WebRTCConstants.EVENT_TYPE, WebRTCConstants.EventType.getAll());

        //RTC_VIEW_SCALE_TYPES
        constants.put(WebRTCConstants.RTC_VIEW_SCALE_TYPE, WebRTCConstants.RTCViewScaleType.getAll());

        //AUDIO OUTPUT
        constants.put(WebRTCConstants.AUDIO_OUTPUT, WebRTCConstants.AudioOutput.getAll());

        return constants;
    }

    public WebRTCModule(final ReactApplicationContext reactContext, RNQbReactnativePackage.ModuleEvents moduleEvents) {
        super(reactContext);
        this.reactContext = reactContext;
        this.moduleEvents = moduleEvents;

        reactContext.addLifecycleEventListener(new LifecycleEventListener() {
            @Override
            public void onHostResume() {

            }

            @Override
            public void onHostPause() {
                unbindCallService();
            }

            @Override
            public void onHostDestroy() {
            }
        });
    }

    @ReactMethod
    public void init(final Promise promise) {
        if (QBChatService.getInstance().isLoggedIn()) {
            unbindCallService();
            WebRTCCallService.start(reactContext);
            bindCallService(CallServiceConnection.CONNECTED_ACTION, promise);
        } else {
            promise.reject(new Exception("The chat is not connected"));
        }
    }

    @ReactMethod
    public void release(final Promise promise) {
        moduleEvents.onServiceReleased();
        WebRTCCallService.stop(reactContext);
        promise.resolve(null);
    }

    @ReactMethod
    public void getSession(ReadableMap data, final Promise promise) {
        String sessionId = data != null && data.hasKey("sessionId") ? data.getString("sessionId") : null;

        if (TextUtils.isEmpty(sessionId)) {
            promise.reject(new Exception("The id is required parameter"));
            return;
        }

        if (webRTCCallService == null) {
            promise.reject(new Exception("The call service is not connected"));
            return;
        }

        webRTCCallService.getSession(sessionId, new WebRTCCallService.ServiceCallback<QBRTCSession>() {
            @Override
            public void onSuccess(QBRTCSession qbrtcSession) {
                WritableMap sessionMap = WebRTCMapper.qBRTCSessionToMap(qbrtcSession);
                promise.resolve(sessionMap);
            }

            @Override
            public void onError(String errorMessage) {
                //resolve(null) because this flow doesn't apply error message
                promise.resolve(null);
            }
        });
    }

    @ReactMethod
    public void call(ReadableMap data, final Promise promise) {
        ReadableArray opponentsIds = data != null && data.hasKey("opponentsIds") ? data.getArray("opponentsIds") : null;
        Integer sessionType = data != null && data.hasKey("type") ? data.getInt("type") : null;
        ReadableMap userInfo = data != null && data.hasKey("userInfo") ? data.getMap("userInfo") : null;

        if (opponentsIds == null || opponentsIds.size() <= 0 || sessionType == null || sessionType <= 0) {
            promise.reject(new Exception("The opponentsIds, type are required parameters"));
            return;
        }

        if (webRTCCallService == null) {
            promise.reject(new Exception("The call service is not connected"));
            return;
        }

        List<Integer> opponentsIdsList = Arguments.toList(opponentsIds);
        QBRTCTypes.QBConferenceType conferenceType = WebRTCConstants.RTCSessionType.getTypeByValue(sessionType);

        Map<String, String> userInfoMap = new HashMap<>();
        if (userInfo != null && userInfo.toHashMap().size() > 0) {
            for (Map.Entry<String, Object> entry : userInfo.toHashMap().entrySet()) {
                String key = entry.getKey();
                String value = (String) entry.getValue();
                userInfoMap.put(key, value);
            }
        }

        webRTCCallService.startCall(opponentsIdsList, conferenceType, userInfoMap, new WebRTCCallService.ServiceCallback<QBRTCSession>() {
            @Override
            public void onSuccess(QBRTCSession qbrtcSession) {
                WritableMap sessionMap = WebRTCMapper.qBRTCSessionToMap(qbrtcSession);
                promise.resolve(sessionMap);
            }

            @Override
            public void onError(String errorMessage) {
                promise.reject(new Exception(errorMessage));
            }
        });
    }

    @ReactMethod
    public void accept(ReadableMap data, final Promise promise) {
        String sessionId = data != null && data.hasKey("sessionId") ? data.getString("sessionId") : null;
        ReadableMap userInfo = data != null && data.hasKey("userInfo") ? data.getMap("userInfo") : null;

        if (TextUtils.isEmpty(sessionId)) {
            promise.reject(new Exception("The id is required parameter"));
            return;
        }

        if (webRTCCallService == null) {
            promise.reject(new Exception("The call service is not connected"));
            return;
        }

        Map<String, String> userInfoMap = new HashMap<>();
        if (userInfo != null && userInfo.toHashMap().size() > 0) {
            for (Map.Entry<String, Object> entry : userInfo.toHashMap().entrySet()) {
                String key = entry.getKey();
                String value = (String) entry.getValue();
                userInfoMap.put(key, value);
            }
        }

        webRTCCallService.acceptCall(sessionId, userInfoMap, new WebRTCCallService.ServiceCallback<QBRTCSession>() {
            @Override
            public void onSuccess(QBRTCSession qbrtcSession) {
                WritableMap sessionMap = WebRTCMapper.qBRTCSessionToMap(qbrtcSession);

                // TODO: 2019-08-12 need to find more clean solution
                if (sessionMap.getInt("state") == 1) {
                    sessionMap.putInt("state", 3);
                }

                promise.resolve(sessionMap);
            }

            @Override
            public void onError(String errorMessage) {
                promise.reject(new Exception(errorMessage));
            }
        });
    }

    @ReactMethod
    public void reject(ReadableMap data, final Promise promise) {
        String sessionId = data != null && data.hasKey("sessionId") ? data.getString("sessionId") : null;
        ReadableMap userInfo = data != null && data.hasKey("userInfo") ? data.getMap("userInfo") : null;

        if (TextUtils.isEmpty(sessionId)) {
            promise.reject(new Exception("The id is required parameter"));
            return;
        }

        if (webRTCCallService == null) {
            promise.reject(new Exception("The call service is not connected"));
            return;
        }

        Map<String, String> userInfoMap = new HashMap<>();
        if (userInfo != null && userInfo.toHashMap().size() > 0) {
            for (Map.Entry<String, Object> entry : userInfo.toHashMap().entrySet()) {
                String key = entry.getKey();
                String value = (String) entry.getValue();
                userInfoMap.put(key, value);
            }
        }

        webRTCCallService.rejectCall(sessionId, userInfoMap, new WebRTCCallService.ServiceCallback<QBRTCSession>() {
            @Override
            public void onSuccess(QBRTCSession qbrtcSession) {
                WritableMap sessionMap = WebRTCMapper.qBRTCSessionToMap(qbrtcSession);
                promise.resolve(sessionMap);
            }

            @Override
            public void onError(String errorMessage) {
                promise.reject(new Exception(errorMessage));
            }
        });
    }

    @ReactMethod
    public void hangUp(ReadableMap data, final Promise promise) {
        String sessionId = data != null && data.hasKey("sessionId") ? data.getString("sessionId") : null;
        ReadableMap userInfo = data != null && data.hasKey("userInfo") ? data.getMap("userInfo") : null;

        if (TextUtils.isEmpty(sessionId)) {
            promise.reject(new Exception("The id is required parameter"));
            return;
        }

        if (webRTCCallService == null) {
            promise.reject(new Exception("The call service is not connected"));
            return;
        }

        Map<String, String> userInfoMap = new HashMap<>();
        if (userInfo != null && userInfo.toHashMap().size() > 0) {
            for (Map.Entry<String, Object> entry : userInfo.toHashMap().entrySet()) {
                String key = entry.getKey();
                String value = (String) entry.getValue();
                userInfoMap.put(key, value);
            }
        }

        webRTCCallService.hangUpCall(sessionId, userInfoMap, new WebRTCCallService.ServiceCallback<QBRTCSession>() {
            @Override
            public void onSuccess(QBRTCSession qbrtcSession) {
                WritableMap sessionMap = WebRTCMapper.qBRTCSessionToMap(qbrtcSession);
                promise.resolve(sessionMap);
            }

            @Override
            public void onError(String errorMessage) {
                promise.reject(new Exception(errorMessage));
            }
        });
    }

    @ReactMethod
    public void enableVideo(ReadableMap data, final Promise promise) {
        String sessionId = data != null && data.hasKey("sessionId") ? data.getString("sessionId") : null;
        boolean enabled = data != null && data.hasKey("enable") ? data.getBoolean("enable") : true;
        Integer userId = data != null && data.hasKey("userId") ? data.getInt("userId") : null;

        if (TextUtils.isEmpty(sessionId)) {
            promise.reject(new Exception("The sessionId is required parameters"));
            return;
        }

        if (webRTCCallService == null) {
            promise.reject(new Exception("The call service is not connected"));
            return;
        }

        webRTCCallService.setVideoEnabled(enabled, sessionId, userId, new WebRTCCallService.ServiceCallback<Void>() {
            @Override
            public void onSuccess(Void value) {
                promise.resolve(null);
            }

            @Override
            public void onError(String errorMessage) {
                promise.reject(new Exception(errorMessage));
            }
        });
    }


    @ReactMethod
    public void enableAudio(ReadableMap data, final Promise promise) {
        String sessionId = data != null && data.hasKey("sessionId") ? data.getString("sessionId") : null;
        boolean enabled = data != null && data.hasKey("enable") ? data.getBoolean("enable") : true;
        Integer userId = data != null && data.hasKey("userId") ? data.getInt("userId") : null;

        if (TextUtils.isEmpty(sessionId)) {
            promise.reject(new Exception("The sessionId is required parameters"));
            return;
        }

        if (webRTCCallService == null) {
            promise.reject(new Exception("The call service is not connected"));
            return;
        }

        webRTCCallService.setAudioEnabled(enabled, sessionId, userId, new WebRTCCallService.ServiceCallback<Void>() {
            @Override
            public void onSuccess(Void value) {
                promise.resolve(null);
            }

            @Override
            public void onError(String errorMessage) {
                promise.reject(new Exception(errorMessage));
            }
        });
    }

    @ReactMethod
    public void switchCamera(ReadableMap data, final Promise promise) {
        String sessionId = data != null && data.hasKey("sessionId") ? data.getString("sessionId") : null;

        if (TextUtils.isEmpty(sessionId)) {
            promise.reject(new Exception("The id is required parameter"));
            return;
        }

        if (webRTCCallService == null) {
            promise.reject(new Exception("The call service is not connected"));
            return;
        }

        webRTCCallService.switchCamera(sessionId, new CameraVideoCapturer.CameraSwitchHandler() {
            @Override
            public void onCameraSwitchDone(boolean frontCamera) {
                promise.resolve(null);
            }

            @Override
            public void onCameraSwitchError(String errorMessage) {
                promise.reject(new Exception(errorMessage));
            }
        }, new WebRTCCallService.ServiceCallback<Void>() {
            @Override
            public void onSuccess(Void value) {
                //ignore
            }

            @Override
            public void onError(String errorMessage) {
                promise.reject(new Exception(errorMessage));
            }
        });
    }

    @ReactMethod
    public void switchAudioOutput(ReadableMap data, final Promise promise) {
        Integer audioDevice = data != null && data.hasKey("output") ? data.getInt("output") : null;

        if (audioDevice == null) {
            promise.reject(new Exception("The output is required parameter"));
            return;
        }

        if (webRTCCallService == null) {
            promise.reject(new Exception("The call service is not connected"));
            return;
        }

        webRTCCallService.switchAudioOutput(audioDevice, promise);
    }

    private void bindCallService(int action, Promise promise) {
        callServiceConnection = new CallServiceConnection();

        ((CallServiceConnection) callServiceConnection).setAction(action);
        ((CallServiceConnection) callServiceConnection).setPromise(promise);

        Intent intent = new Intent(reactContext, WebRTCCallService.class);
        reactContext.bindService(intent, callServiceConnection, Context.BIND_AUTO_CREATE);
    }

    private void unbindCallService() {
        if (callServiceConnection != null) {
            reactContext.unbindService(callServiceConnection);
            callServiceConnection = null;
        }
    }

    private class CallServiceConnection implements ServiceConnection {
        private static final int CONNECTED_ACTION = 1;

        private int action = 0;
        private Promise promise;

        void setAction(int action) {
            this.action = action;
        }

        void setPromise(Promise promise) {
            this.promise = promise;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
        }

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            WebRTCCallService.CallServiceBinder binder = (WebRTCCallService.CallServiceBinder) service;

            webRTCCallService = binder.getService();
            webRTCCallService.setReactApplicationContext(reactContext);

            moduleEvents.onServiceStarted(webRTCCallService);

            if (action == CONNECTED_ACTION && promise != null) {
                promise.resolve(null);
            }
        }
    }
}