
package com.quickblox.reactnative.customobjects;

import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.quickblox.core.QBEntityCallback;
import com.quickblox.core.exception.QBResponseException;
import com.quickblox.core.helper.StringifyArrayList;
import com.quickblox.core.request.QBRequestGetBuilder;
import com.quickblox.core.request.QBRequestUpdateBuilder;
import com.quickblox.customobjects.QBCustomObjects;
import com.quickblox.customobjects.model.QBCustomObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CustomObjectsModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "RNQBCustomObjectsModule";

    private ReactApplicationContext reactContext;

    public CustomObjectsModule(ReactApplicationContext reactContext) {
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

        //PERMISSIONS LEVEL
        constants.put(CustomObjectsConstants.PERMISSIONS_LEVEL, CustomObjectsConstants
                .PermissionsLevelNames.getPermissionsLevelNames());

        //OBJECTS_SEARCH_OPERATOR
        constants.put(CustomObjectsConstants.OBJECTS_SEARCH_OPERATOR, CustomObjectsConstants.ForSearchType.getTypes());

        //OBJECTS_UPDATE_OPERATOR
        constants.put(CustomObjectsConstants.OBJECTS_UPDATE_OPERATOR, CustomObjectsConstants.ForUpdateType.getTypes());

        //PULL_FILTER
        constants.put(CustomObjectsConstants.PULL_FILTER, CustomObjectsConstants.PullFilter.getAll());

        return constants;
    }

    @ReactMethod
    public void create(ReadableMap data, final Promise promise) {
        String className = data != null && data.hasKey("className") ? data.getString("className") : null;
        ReadableMap fields = data != null && data.hasKey("fields") ? data.getMap("fields") : null;
        ReadableArray objects = data != null && data.hasKey("objects") ? data.getArray("objects") : null;


        if (fields != null && fields.toHashMap().size() > 0) {
            QBCustomObject customObject = CustomObjectsMapper.buildCustomObjectFromMap(fields);
            if (!TextUtils.isEmpty(className)) {
                customObject.setClassName(className);
            }

            QBCustomObjects.createObject(customObject).performAsync(new QBEntityCallback<QBCustomObject>() {
                @Override
                public void onSuccess(QBCustomObject customObject, Bundle bundle) {
                    WritableMap customObjectMap = CustomObjectsMapper.qbCustomObjectToMap(customObject);
                    promise.resolve(customObjectMap);
                }

                @Override
                public void onError(QBResponseException e) {
                    promise.reject(e);
                }
            });
        } else if (objects != null && objects.toArrayList().size() > 0) {
            ArrayList<Object> objectsArrayList = objects.toArrayList();
            List<QBCustomObject> qbCustomObjects = new ArrayList<>();
            for (Object object : objectsArrayList) {
                HashMap<String, Object> map = (HashMap<String, Object>) object;
                WritableNativeMap objectMap = Arguments.makeNativeMap(map);
                QBCustomObject customObject = CustomObjectsMapper.buildCustomObjectFromMap(objectMap);
                if (!TextUtils.isEmpty(className)) {
                    customObject.setClassName(className);
                }
                qbCustomObjects.add(customObject);
            }
            QBCustomObjects.createObjects(qbCustomObjects).performAsync(new QBEntityCallback<ArrayList<QBCustomObject>>() {
                @Override
                public void onSuccess(ArrayList<QBCustomObject> qbCustomObjects, Bundle bundle) {
                    WritableArray customObjectsArray = new WritableNativeArray();
                    for (QBCustomObject customObject : qbCustomObjects) {
                        WritableMap customObjectMap = CustomObjectsMapper.qbCustomObjectToMap(customObject);
                        customObjectsArray.pushMap(customObjectMap);
                    }
                    promise.resolve(customObjectsArray);
                }

                @Override
                public void onError(QBResponseException e) {
                    promise.reject(e);
                }
            });
        }
    }

    @ReactMethod
    public void remove(ReadableMap data, final Promise promise) {
        String className = data != null && data.hasKey("className") ? data.getString("className") : null;
        ReadableArray idsArray = data != null && data.hasKey("ids") ? data.getArray("ids") : null;

        if (TextUtils.isEmpty(className) || idsArray == null || idsArray.size() == 0) {
            promise.reject(new Exception("The className and ids are required parameters"));
            return;
        }

        ArrayList arrayList = Arguments.toList(idsArray);

        StringifyArrayList<String> idsList = new StringifyArrayList<>();
        for (Object item : arrayList) {
            String customObjectId = (String) item;
            idsList.add(customObjectId);
        }

        QBCustomObjects.deleteObjects(className, idsList).performAsync(new QBEntityCallback<ArrayList<String>>() {
            @Override
            public void onSuccess(ArrayList<String> ids, Bundle bundle) {
                promise.resolve(null);
            }

            @Override
            public void onError(QBResponseException e) {
                promise.reject(e);
            }
        });
    }

    @ReactMethod
    public void getByIds(ReadableMap data, final Promise promise) {
        String className = data != null && data.hasKey("className") ? data.getString("className") : null;
        ReadableArray objectsIds = data != null && data.hasKey("objectsIds") ? data.getArray("objectsIds") : null;

        if (TextUtils.isEmpty(className) || objectsIds == null || objectsIds.size() == 0) {
            promise.reject(new Exception("The className and objectsIds are required parameters"));
            return;
        }

        StringifyArrayList<String> idsList = new StringifyArrayList<>();
        for (int index = 0; index < objectsIds.size(); index++) {
            String id = objectsIds.getString(index);
            idsList.add(id);
        }

        QBCustomObjects.getObjectsByIds(className, idsList).performAsync(new QBEntityCallback<ArrayList<QBCustomObject>>() {
            @Override
            public void onSuccess(ArrayList<QBCustomObject> qbCustomObjects, Bundle bundle) {
                WritableArray array = new WritableNativeArray();
                for (QBCustomObject customObject : qbCustomObjects) {
                    WritableMap map = CustomObjectsMapper.qbCustomObjectToMap(customObject);
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
    public void get(ReadableMap data, final Promise promise) {
        String className = data != null && data.hasKey("className") ? data.getString("className") : null;
        ReadableMap sortMap = data != null && data.hasKey("sort") ? data.getMap("sort") : null;
        ReadableMap filterMap = data != null && data.hasKey("filter") ? data.getMap("filter") : null;
        int limit = data != null && data.hasKey("limit") ? data.getInt("limit") : 100;
        int skip = data != null && data.hasKey("skip") ? data.getInt("skip") : 0;
        ReadableArray include = data != null && data.hasKey("include") ? data.getArray("include") : null;
        ReadableArray exclude = data != null && data.hasKey("exclude") ? data.getArray("exclude") : null;

        if (TextUtils.isEmpty(className)) {
            promise.reject(new Exception("The className is required parameter"));
            return;
        }

        QBRequestGetBuilder requestGetBuilder = new QBRequestGetBuilder();
        requestGetBuilder.setLimit(limit);
        requestGetBuilder.setSkip(skip);

        CustomObjectsMapper.addFilterToRequestBuilder(requestGetBuilder, filterMap);
        CustomObjectsMapper.addSortToRequestBuilder(requestGetBuilder, sortMap);

        if (include != null && include.size() > 0) {
            ArrayList includeList = Arguments.toList(include);
            requestGetBuilder.outputInclude(includeList);
        }

        if (exclude != null && exclude.size() > 0) {
            ArrayList excludeList = Arguments.toList(exclude);
            requestGetBuilder.outputExclude(excludeList);
        }

        QBCustomObjects.getObjects(className, requestGetBuilder).performAsync(new QBEntityCallback<ArrayList<QBCustomObject>>() {
            @Override
            public void onSuccess(ArrayList<QBCustomObject> qbCustomObjects, Bundle bundle) {
                WritableArray array = new WritableNativeArray();
                for (QBCustomObject customObject : qbCustomObjects) {
                    WritableMap map = CustomObjectsMapper.qbCustomObjectToMap(customObject);
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
    public void update(ReadableMap data, final Promise promise) {
        String className = data != null && data.hasKey("className") ? data.getString("className") : null;
        String customObjectId = data != null && data.hasKey("id") ? data.getString("id") : null;
        ReadableMap fields = data != null && data.hasKey("fields") ? data.getMap("fields") : null;
        ReadableArray objects = data != null && data.hasKey("objects") ? data.getArray("objects") : null;

        if (TextUtils.isEmpty(className)) {
            promise.reject(new Exception("The className is required parameters"));
            return;
        }

        if (objects != null && objects.size() > 0) {
            List<QBCustomObject> customObjectList = new ArrayList<>();
            for (int index = 0; index < objects.size(); index++) {
                ReadableMap objectsMap = objects.getMap(index);
                String objectId = objectsMap != null && objectsMap.hasKey("id") ? objectsMap.getString("id") : null;

                ReadableMap objectsFields = objectsMap != null && objectsMap.hasKey("fields") ? objectsMap.getMap("fields") : null;

                QBCustomObject qbCustomObject = new QBCustomObject();
                qbCustomObject.setCustomObjectId(objectId);
                qbCustomObject.setClassName(className);

                if (TextUtils.isEmpty(objectId) || objectsFields == null) {
                    promise.reject(new Exception("The id and fields parameter is required if you send objects parameter"));
                    return;
                }

                for (Map.Entry<String, Object> entry : objectsFields.toHashMap().entrySet()) {
                    String fieldName = entry.getKey();
                    Object fieldValue = entry.getValue();
                    qbCustomObject.put(fieldName, fieldValue);
                }

                customObjectList.add(qbCustomObject);
            }
            updateObjects(customObjectList, promise);
        } else {
            QBCustomObject qbCustomObject = new QBCustomObject();
            qbCustomObject.setCustomObjectId(customObjectId);
            qbCustomObject.setClassName(className);

            QBRequestUpdateBuilder requestBuilder = new QBRequestUpdateBuilder();

            if (fields != null && fields.toHashMap().size() > 0) {
                for (Map.Entry<String, Object> entry : fields.toHashMap().entrySet()) {
                    String fieldName = entry.getKey();
                    Object fieldValue = entry.getValue();

                    if (fieldValue instanceof Map) {
                        HashMap<String, Object> fieldValues = (HashMap<String, Object>) fieldValue;
                        CustomObjectsMapper.addFieldsToUpdateBuilder(requestBuilder, fieldName, fieldValues);
                    } else {
                        qbCustomObject.put(fieldName, fieldValue);
                    }
                }
            }
            updateObject(qbCustomObject, requestBuilder, promise);
        }
    }

    private void updateObject(QBCustomObject customObject, QBRequestUpdateBuilder requestBuilder, final Promise promise) {
        QBCustomObjects.updateObject(customObject, requestBuilder).performAsync(new QBEntityCallback<QBCustomObject>() {
            @Override
            public void onSuccess(QBCustomObject customObject, Bundle bundle) {
                WritableMap map = CustomObjectsMapper.qbCustomObjectToMap(customObject);
                promise.resolve(map);
            }

            @Override
            public void onError(QBResponseException e) {
                promise.reject(e);
            }
        });
    }

    private void updateObjects(List<QBCustomObject> customObjectList, final Promise promise) {
        QBCustomObjects.updateObjects(customObjectList).performAsync(new QBEntityCallback<ArrayList<QBCustomObject>>() {
            @Override
            public void onSuccess(ArrayList<QBCustomObject> qbCustomObjects, Bundle bundle) {
                WritableArray customObjectsArray = new WritableNativeArray();
                for (QBCustomObject customObject : qbCustomObjects) {
                    WritableMap customObjectMap = CustomObjectsMapper.qbCustomObjectToMap(customObject);
                    customObjectsArray.pushMap(customObjectMap);
                }
                promise.resolve(customObjectsArray);
            }

            @Override
            public void onError(QBResponseException e) {
                promise.reject(e);
            }
        });
    }
}