package com.quickblox.reactnative.file;

import android.text.TextUtils;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.quickblox.content.model.QBFile;
import com.quickblox.reactnative.helpers.DateHelper;

import java.util.Date;

class FileMapper {

    private FileMapper() {
        //empty
    }

    static WritableMap qbFileToMap(QBFile file) {
        WritableMap map = new WritableNativeMap();

        if (file.getId() != null && file.getId() > 0) {
            map.putInt("id", file.getId());
        }
        if (!TextUtils.isEmpty(file.getUid())) {
            map.putString("uid", file.getUid());
        }
        if (!TextUtils.isEmpty(file.getContentType())) {
            map.putString("contentType", file.getContentType());
        }
        if (!TextUtils.isEmpty(file.getName())) {
            map.putString("name", file.getName());
        }
        if (file.getSize() > 0) {
            map.putInt("size", file.getSize());
        }
        if (file.getCompletedAt() != null && !TextUtils.isEmpty(file.getCompletedAt().toString())) {
            Date date = file.getCompletedAt();
            String completedAt = DateHelper.convertDateToISO(date);
            map.putString("completedAt", completedAt);
        }
        if (file.isPublic() != null) {
            map.putBoolean("isPublic", file.isPublic());
        }
        if (file.getLastReadAccessTime() != null && !TextUtils.isEmpty(file.getLastReadAccessTime().toString())) {
            Date date = file.getLastReadAccessTime();
            String lastReadAccessTime = DateHelper.convertDateToISO(date);
            map.putString("lastReadAccessTime", lastReadAccessTime);
        }
        if (!TextUtils.isEmpty(file.getTags())) {
            map.putString("tags", file.getTags());
        }

        return map;
    }
}