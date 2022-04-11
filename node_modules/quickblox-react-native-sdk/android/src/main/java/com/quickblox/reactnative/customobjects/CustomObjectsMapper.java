package com.quickblox.reactnative.customobjects;

import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.quickblox.core.request.QBRequestGetBuilder;
import com.quickblox.core.request.QBRequestUpdateBuilder;
import com.quickblox.customobjects.model.QBCustomObject;
import com.quickblox.customobjects.model.QBPermissions;
import com.quickblox.customobjects.model.QBPermissionsLevel;
import com.quickblox.reactnative.helpers.DateHelper;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class CustomObjectsMapper {

    private CustomObjectsMapper() {
        //empty
    }

    static WritableMap qbCustomObjectToMap(QBCustomObject customObject) {
        WritableMap map = new WritableNativeMap();

        if (!TextUtils.isEmpty(customObject.getCustomObjectId())) {
            map.putString("id", customObject.getCustomObjectId());
        }
        if (!TextUtils.isEmpty(customObject.getParentId()) && !customObject.getParentId().equals("null")) {
            map.putString("parentId", customObject.getParentId());
        }
        if (customObject.getCreatedAt() != null) {
            Date date = customObject.getCreatedAt();
            String createdAt = DateHelper.convertDateToISO(date);
            map.putString("createdAt", createdAt);
        }
        if (customObject.getUpdatedAt() != null) {
            Date date = customObject.getUpdatedAt();
            String updatedAt = DateHelper.convertDateToISO(date);
            map.putString("updatedAt", updatedAt);
        }
        if (!TextUtils.isEmpty(customObject.getClassName())) {
            map.putString("className", customObject.getClassName());
        }
        if (customObject.getUserId() != null && customObject.getUserId() > 0) {
            map.putInt("userId", customObject.getUserId());
        }
        if (customObject.getFields() != null && customObject.getFields().size() > 0) {
            HashMap<String, Object> fields = customObject.getFields();
            WritableMap fieldsMap = getPropertiesMap(fields);
            map.putMap("fields", fieldsMap);
        }
        if (customObject.getPermission() != null) {
            QBPermissions permissions = customObject.getPermission();
            WritableMap permissionMap = qbPermissionsToMap(permissions);
            map.putMap("permission", permissionMap);
        }

        return map;
    }

    private static WritableMap getPropertiesMap(HashMap<String, Object> fields) {
        WritableMap map = new WritableNativeMap();
        for (Map.Entry<String, Object> entry : fields.entrySet()) {
            String fieldName = entry.getKey();
            Object fieldValue = entry.getValue();

            if (fieldValue instanceof String) {
                map.putString(fieldName, (String) fieldValue);
            } else if (fieldValue instanceof Integer) {
                map.putInt(fieldName, (Integer) fieldValue);
            } else if (fieldValue instanceof List) {
                WritableArray array = Arguments.fromList((List) fieldValue);
                map.putArray(fieldName, array);
            }
        }
        return map;
    }

    private static WritableMap qbPermissionsToMap(QBPermissions permissions) {
        WritableMap map = new WritableNativeMap();

        if (!TextUtils.isEmpty(permissions.getCustomObjectId())) {
            map.putString("customObjectId", permissions.getCustomObjectId());
        }
        if (permissions.getReadLevel() != null) {
            WritableMap readLevel = qbPermissionsLevelToMap(permissions.getDeleteLevel());
            map.putMap("readLevel", readLevel);
        }
        if (permissions.getUpdateLevel() != null) {
            WritableMap updateLevel = qbPermissionsLevelToMap(permissions.getUpdateLevel());
            map.putMap("updateLevel", updateLevel);
        }
        if (permissions.getDeleteLevel() != null) {
            WritableMap deleteLevel = qbPermissionsLevelToMap(permissions.getDeleteLevel());
            map.putMap("deleteLevel", deleteLevel);
        }

        return map;
    }

    private static WritableMap qbPermissionsLevelToMap(QBPermissionsLevel permissionsLevel) {
        WritableMap map = new WritableNativeMap();

        if (!TextUtils.isEmpty(permissionsLevel.getAccess())) {
            String accessLevel = permissionsLevel.getAccess();
            String access = CustomObjectsConstants.PermissionsLevelNames.getPermissionByValue(accessLevel).eventValue;
            map.putString("access", access);
        }
        if (permissionsLevel.getUsersIds() != null && permissionsLevel.getUsersIds().size() > 0) {
            ArrayList<String> userIdsList = permissionsLevel.getUsersIds();
            WritableArray userIdsArray = Arguments.fromList(userIdsList);
            map.putArray("usersIds", userIdsArray);
        }
        if (permissionsLevel.usersGroups != null && permissionsLevel.usersGroups.size() > 0) {
            ArrayList<String> usersGroupsList = permissionsLevel.usersGroups;
            WritableArray usersGroupsArray = Arguments.fromList(usersGroupsList);
            map.putArray("usersGroups", usersGroupsArray);
        }

        return map;
    }

    static QBCustomObject buildCustomObjectFromMap(ReadableMap fields) {
        QBCustomObject customObject = new QBCustomObject();

        for (Map.Entry<String, Object> entry : fields.toHashMap().entrySet()) {
            String fieldName = entry.getKey();
            Object fieldValue = entry.getValue();
            customObject.put(fieldName, fieldValue);
        }

        return customObject;
    }

    static QBRequestGetBuilder addFilterToRequestBuilder(QBRequestGetBuilder requestGetBuilder, ReadableMap filterMap) {
        if (filterMap != null) {
            String fieldName = filterMap.hasKey("field") ? filterMap.getString("field") : null;
            String filterOperator = filterMap.hasKey("operator") ? filterMap.getString("operator") : null;
            String fieldValue = filterMap.hasKey("value") ? filterMap.getString("value") : null;

            if (TextUtils.isEmpty(fieldName) || TextUtils.isEmpty(fieldValue) || TextUtils.isEmpty(filterOperator)) {
                return requestGetBuilder;
            }

            if (filterOperator.equals(CustomObjectsConstants.IntegerSearchType.LT.eventName)) {
                requestGetBuilder.lt(fieldName, fieldValue);
            } else if (filterOperator.equals(CustomObjectsConstants.IntegerSearchType.LTE.eventName)) {
                requestGetBuilder.lte(fieldName, fieldValue);
            } else if (filterOperator.equals(CustomObjectsConstants.IntegerSearchType.GT.eventName)) {
                requestGetBuilder.gt(fieldName, fieldValue);
            } else if (filterOperator.equals(CustomObjectsConstants.IntegerSearchType.NIN.eventName)) {
                requestGetBuilder.nin(fieldName, fieldValue);
            } else if (filterOperator.equals(CustomObjectsConstants.FloatSearchType.GTE.eventName)) {
                requestGetBuilder.gte(fieldName, fieldValue);
            } else if (filterOperator.equals(CustomObjectsConstants.StringSearchType.NE.eventName)) {
                requestGetBuilder.ne(fieldName, fieldValue);
            } else if (filterOperator.equals(CustomObjectsConstants.StringSearchType.IN.eventName)) {
                requestGetBuilder.in(fieldName, fieldValue);
            } else if (filterOperator.equals(CustomObjectsConstants.StringSearchType.OR.eventName)) {
                requestGetBuilder.or(fieldName, fieldValue);
            } else if (filterOperator.equals(CustomObjectsConstants.StringSearchType.CTN.eventName)) {
                requestGetBuilder.ctn(fieldName, fieldValue);
            } else if (filterOperator.equals(CustomObjectsConstants.ArraySearchType.ALL.eventName)) {
                requestGetBuilder.all(fieldName, fieldValue);
            }
        }

        return requestGetBuilder;
    }

    static QBRequestGetBuilder addSortToRequestBuilder(QBRequestGetBuilder requestGetBuilder, ReadableMap sortMap) {
        if (sortMap != null) {
            String fieldValue = sortMap.hasKey("field") ? sortMap.getString("field") : null;

            boolean ascendingValue = sortMap.hasKey("ascending") && sortMap.getBoolean("ascending");
            if (ascendingValue) {
                requestGetBuilder.sortAsc(fieldValue);
            } else {
                requestGetBuilder.sortDesc(fieldValue);
            }
        }

        return requestGetBuilder;
    }

    static QBRequestUpdateBuilder addFieldsToUpdateBuilder(QBRequestUpdateBuilder requestBuilder,
                                                           String fieldName, HashMap<String, Object> fieldValues) {
        Object value = null;
        Integer index = null;
        String operator = null;
        String pullFilter = null;

        for (Map.Entry<String, Object> entry : fieldValues.entrySet()) {
            String fieldKey = entry.getKey();
            Object fieldValue = entry.getValue();

            if (fieldKey.equals("value")) {
                value = fieldValue;
            }
            if (fieldKey.equals("index")) {
                index = (Integer) fieldValue;
            }
            if (fieldKey.equals("operator")) {
                operator = (String) fieldValue;
            }
            if (fieldKey.equals("pullFilter")) {
                pullFilter = (String) fieldValue;
            }
        }

        if (index != null) {
            requestBuilder.updateArrayValue(fieldName, index, value);
        }
        if (!TextUtils.isEmpty(operator)) {
            addOperator(requestBuilder, operator, fieldName, value);
        }
        if (!TextUtils.isEmpty(pullFilter)) {
            addPullFilter(requestBuilder, pullFilter, fieldName, value);
        }

        return requestBuilder;
    }

    private static QBRequestUpdateBuilder addOperator(QBRequestUpdateBuilder requestBuilder,
                                                      String operator, String fieldName, Object fieldValue) {

        if (operator.equals(CustomObjectsConstants.IntegerUpdateType.INC.eventName)) {
            requestBuilder.inc(fieldName, fieldValue);
        } else if (operator.equals(CustomObjectsConstants.ArrayUpdateType.ADD_TO_SET.eventName)) {
            requestBuilder.addToSet(fieldName, fieldValue);
        } else if (operator.equals(CustomObjectsConstants.ArrayUpdateType.POP.eventName)) {
            requestBuilder.pop(fieldName, fieldValue);
        } else if (operator.equals(CustomObjectsConstants.ArrayUpdateType.PULL.eventName)) {
            requestBuilder.pull(fieldName, fieldValue);
        } else if (operator.equals(CustomObjectsConstants.ArrayUpdateType.PULL_ALL.eventName)) {
            requestBuilder.pullAll(fieldName, fieldValue);
        } else if (operator.equals(CustomObjectsConstants.ArrayUpdateType.PUSH.eventName)) {
            requestBuilder.push(fieldName, fieldValue);
        }

        return requestBuilder;
    }

    private static QBRequestUpdateBuilder addPullFilter(QBRequestUpdateBuilder requestBuilder,
                                                        String pullFilter, String fieldName, Object fieldValue) {

        requestBuilder.addRule(fieldName, "[" + pullFilter.toLowerCase() + "]", fieldValue);
        return requestBuilder;
    }
}