package com.quickblox.reactnative.file;

import java.util.HashMap;
import java.util.Map;

class FileConstants {

    static final String EVENT_TYPE = "EVENT_TYPE";

    private FileConstants() {
        //empty
    }

    enum FileUploadProgress {
        FILE_UPLOAD_PROGRESS("FILE_UPLOAD_PROGRESS", "@QB/FILE_UPLOAD_PROGRESS");

        String eventName;
        String eventValue;

        FileUploadProgress(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(FILE_UPLOAD_PROGRESS.eventName, FILE_UPLOAD_PROGRESS.eventValue);
            return values;
        }
    }
}