package com.quickblox.reactnative.users;

import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.quickblox.reactnative.helpers.DateHelper;
import com.quickblox.users.model.QBUser;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;

class UsersMapper {

    private UsersMapper() {
        //empty
    }

    static WritableMap qbUserToMap(QBUser user) {
        WritableMap map = new WritableNativeMap();

        if (user.getFileId() != null && user.getFileId() > 0) {
            map.putInt("blobId", user.getFileId());
        }
        if (!TextUtils.isEmpty(user.getCustomData())) {
            map.putString("customData", user.getCustomData());
        }
        if (!TextUtils.isEmpty(user.getEmail())) {
            map.putString("email", user.getEmail());
        }
        if (!TextUtils.isEmpty(user.getExternalId())) {
            map.putString("externalId", user.getExternalId());
        }
        if (!TextUtils.isEmpty(user.getFacebookId())) {
            map.putString("facebookId", user.getFacebookId());
        }
        if (!TextUtils.isEmpty(user.getFullName())) {
            map.putString("fullName", user.getFullName());
        }
        if (user.getId() != null && user.getId() != 0) {
            map.putInt("id", user.getId());
        }
        if (!TextUtils.isEmpty(user.getLogin())) {
            map.putString("login", user.getLogin());
        }
        if (!TextUtils.isEmpty(user.getPhone())) {
            map.putString("phone", user.getPhone());
        }
        if (user.getTags() != null && user.getTags().size() > 0) {
            WritableArray writableArray = Arguments.fromList(user.getTags());
            map.putArray("tags", writableArray);
        }
        if (!TextUtils.isEmpty(user.getTwitterId())) {
            map.putString("twitterId", user.getTwitterId());
        }
        if (!TextUtils.isEmpty(user.getWebsite())) {
            map.putString("website", user.getWebsite());
        }
        if (user.getLastRequestAt() != null) {
            Date date = user.getLastRequestAt();
            String lastRequestAt = DateHelper.convertDateToISO(date);
            map.putString("lastRequestAt", lastRequestAt);
        }

        return map;
    }

    static String sortMapToSort(ReadableMap sortMap) {
        String sort = null;

        String sortAscDesc = "asc";
        String sortType = "";
        String sortField = "";

        if (sortMap != null) {
            boolean ascendingValue = sortMap.hasKey("ascending") && sortMap.getBoolean("ascending");
            sortAscDesc = UsersConstants.UsersSort.getAscDesc(ascendingValue);

            String fieldValue = sortMap.hasKey("field") ? sortMap.getString("field") : null;
            sortField = UsersConstants.UsersSort.getFieldByValue(fieldValue).eventValue;

            String typeValue = sortMap.hasKey("type") ? sortMap.getString("type") : null;
            sortType = UsersConstants.UsersSort.getTypeByValue(typeValue).eventValue;
        }

        if (!TextUtils.isEmpty(sortAscDesc) && !TextUtils.isEmpty(sortType) && !TextUtils.isEmpty(sortField)) {
            sort = sortAscDesc + " " + sortType + " " + sortField;
        }

        return sort;
    }

    static String filterMapToFilter(ReadableMap filterMap) {
        String filter = null;

        String filterType = "";
        String filterField = "";
        String filterOperator = "";

        if (filterMap != null) {
            String typeValue = filterMap.hasKey("type") ? filterMap.getString("type") : null;
            filterType = UsersConstants.UsersFilter.getTypeByValue(typeValue).eventValue;

            String fieldValue = filterMap.hasKey("field") ? filterMap.getString("field") : null;
            filterField = UsersConstants.UsersFilter.getFieldByValue(fieldValue).eventValue;

            String operatorValue = filterMap.hasKey("operator") ? filterMap.getString("operator") : null;
            filterOperator = UsersConstants.UsersFilter.getOperatorByValue(operatorValue).eventValue;
        }

        if (!TextUtils.isEmpty(filterType) && !TextUtils.isEmpty(filterField) && !TextUtils.isEmpty(filterOperator)) {
            filter = filterType + " " + filterField + " " + filterOperator + " ";
        }

        return filter;
    }

    static ArrayList getFilterValueFromMap(ReadableMap filterMap) {
        ArrayList filterValue = null;
        if (filterMap != null && filterMap.hasKey("value")) {
            try {
                String filter = filterMap.getString("value");
                String[] filterArray = TextUtils.split(filter, ",");
                filterValue = new ArrayList(Arrays.asList(filterArray));
            } catch (ClassCastException e) {
                //ignore
            }
        }
        return filterValue;
    }
}