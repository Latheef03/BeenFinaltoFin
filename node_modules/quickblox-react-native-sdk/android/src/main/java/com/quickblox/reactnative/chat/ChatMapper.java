package com.quickblox.reactnative.chat;

import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.quickblox.chat.model.QBAttachment;
import com.quickblox.chat.model.QBChatDialog;
import com.quickblox.chat.model.QBChatMessage;
import com.quickblox.chat.model.QBDialogCustomData;
import com.quickblox.chat.model.QBDialogType;
import com.quickblox.core.request.QBRequestGetBuilder;
import com.quickblox.core.request.QueryRule;
import com.quickblox.reactnative.helpers.DateHelper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class ChatMapper {

    private ChatMapper() {
        //empty
    }

    static WritableMap qbAttachmentToMap(QBAttachment attachment) {
        WritableMap map = new WritableNativeMap();

        if (!TextUtils.isEmpty(attachment.getType())) {
            map.putString("type", attachment.getType());
        }
        if (!TextUtils.isEmpty(attachment.getId())) {
            map.putString("id", attachment.getId());
        }
        if (!TextUtils.isEmpty(attachment.getUrl())) {
            map.putString("url", attachment.getUrl());
        }
        if (!TextUtils.isEmpty(attachment.getName())) {
            map.putString("name", attachment.getName());
        }
        if (!TextUtils.isEmpty(attachment.getContentType())) {
            map.putString("contentType", attachment.getContentType());
        }
        if (!TextUtils.isEmpty(attachment.getData())) {
            map.putString("data", attachment.getData());
        }
        if (attachment.getSize() > 0) {
            map.putDouble("size", attachment.getSize());
        }
        if (attachment.getHeight() != 0) {
            map.putInt("height", attachment.getHeight());
        }
        if (attachment.getWidth() != 0) {
            map.putInt("width", attachment.getWidth());
        }
        if (attachment.getDuration() != 0) {
            map.putInt("duration", attachment.getDuration());
        }

        return map;
    }

    static QBChatMessage mapToQBChatMessage(ReadableMap map) {
        QBChatMessage message = new QBChatMessage();

        String id = "";
        if (map.hasKey("id")) {
            id = map.getString("id");
        }

        Integer senderId = null;
        if (map.hasKey("senderId")) {
            senderId = map.getInt("senderId");
        }

        String dialogId = "";
        if (map.hasKey("dialogId")) {
            dialogId = map.getString("dialogId");
        }

        message.setId(id);
        message.setSenderId(senderId);
        message.setDialogId(dialogId);

        return message;
    }

    static WritableMap qbChatMessageToMap(QBChatMessage message) {
        WritableMap map = new WritableNativeMap();

        if (!TextUtils.isEmpty(message.getId())) {
            map.putString("id", message.getId());
        }
        if (message.getAttachments() != null && message.getAttachments().size() > 0) {
            WritableArray attachmentsArray = new WritableNativeArray();
            for (QBAttachment qbAttachment : message.getAttachments()) {
                WritableMap attachment = qbAttachmentToMap(qbAttachment);
                attachmentsArray.pushMap(attachment);
            }
            map.putArray("attachments", attachmentsArray);
        }
        if (message.getProperties() != null && message.getProperties().size() > 0) {
            WritableNativeMap writableMap = new WritableNativeMap();
            for (Map.Entry<String, String> entry : message.getProperties().entrySet()) {
                String propertyName = entry.getKey();
                String propertyValue = entry.getValue();
                writableMap.putString(propertyName, propertyValue);
            }
            map.putMap("properties", writableMap);
        }
        if (message.getDateSent() != 0) {
            map.putDouble("dateSent", message.getDateSent() * 1000);
        }
        if (message.getSenderId() != null && message.getSenderId() > 0) {
            map.putInt("senderId", message.getSenderId());
        }
        if (message.getRecipientId() != null && message.getRecipientId() > 0) {
            map.putInt("recipientId", message.getRecipientId());
        }
        if (message.getReadIds() != null && message.getReadIds().size() > 0) {
            WritableArray readIdsArray = Arguments.fromList((List) message.getReadIds());
            map.putArray("readIds", readIdsArray);
        }
        if (message.getDeliveredIds() != null && message.getDeliveredIds().size() > 0) {
            WritableArray deliveredIdsArray = Arguments.fromList((List) message.getDeliveredIds());
            map.putArray("deliveredIds", deliveredIdsArray);
        }
        if (!TextUtils.isEmpty(message.getDialogId())) {
            map.putString("dialogId", message.getDialogId());
        }
        map.putBoolean("markable", message.isMarkable());
        map.putBoolean("delayed", message.isDelayed());
        if (!TextUtils.isEmpty(message.getBody())) {
            map.putString("body", message.getBody());
        }

        return map;
    }

    static WritableMap qbChatDialogToMap(QBChatDialog dialog) {
        WritableMap map = new WritableNativeMap();

        if (dialog.getCreatedAt() != null) {
            Date date = dialog.getCreatedAt();
            String createdAt = DateHelper.convertDateToISO(date);
            map.putString("createdAt", createdAt);
        }
        if (!TextUtils.isEmpty(dialog.getLastMessage())) {
            map.putString("lastMessage", dialog.getLastMessage());
        }
        if (dialog.getLastMessageDateSent() > 0) {
            map.putDouble("lastMessageDateSent", dialog.getLastMessageDateSent() * 1000);
        }
        if (dialog.getLastMessageUserId() != null && dialog.getLastMessageUserId() > 0) {
            map.putInt("lastMessageUserId", dialog.getLastMessageUserId());
        }
        if (!TextUtils.isEmpty(dialog.getName())) {
            map.putString("name", dialog.getName());
        }
        if (!TextUtils.isEmpty(dialog.getPhoto())) {
            map.putString("photo", dialog.getPhoto());
        }
        if (dialog.getType().getCode() > 0) {
            map.putInt("type", dialog.getType().getCode());
        }
        if (dialog.getUnreadMessageCount() != null && dialog.getUnreadMessageCount() > 0) {
            map.putInt("unreadMessagesCount", dialog.getUnreadMessageCount());
        }
        if (dialog.getUpdatedAt() != null) {
            Date date = dialog.getUpdatedAt();
            String updatedAt = DateHelper.convertDateToISO(date);
            map.putString("updatedAt", updatedAt);
        }
        if (dialog.getUserId() != null && dialog.getUserId() > 0) {
            map.putInt("userId", dialog.getUserId());
        }
        if (!TextUtils.isEmpty(dialog.getRoomJid())) {
            map.putString("roomJid", dialog.getRoomJid());
        }
        if (!TextUtils.isEmpty(dialog.getDialogId())) {
            map.putString("id", dialog.getDialogId());
        }
        if (dialog.getOccupants() != null && dialog.getOccupants().size() > 0) {
            WritableArray writableArray = Arguments.fromList(dialog.getOccupants());
            map.putArray("occupantsIds", writableArray);
        }
        if (dialog.getCustomData() != null && !TextUtils.isEmpty(dialog.getCustomData().getClassName())) {
            WritableMap customDataMap = qbDialogCustomDataToMap(dialog.getCustomData());
            String className = dialog.getCustomData().getClassName();
            customDataMap.putMap(className, customDataMap);
            map.putMap("customData", customDataMap);
        }
        if (dialog.isJoined() || dialog.getType().equals(QBDialogType.PRIVATE)) {
            map.putBoolean("isJoined", true);
        } else {
            map.putBoolean("isJoined", false);
        }

        return map;
    }

    static WritableMap qbDialogCustomDataToMap(QBDialogCustomData customData) {
        WritableMap map = new WritableNativeMap();

        HashMap<String, Object> objectHashMap = customData.getFields();
        for (Map.Entry<String, Object> entry : objectHashMap.entrySet()) {
            String propertyKey = entry.getKey();
            if (customData.getInteger(propertyKey) != null) {
                map.putInt(propertyKey, customData.getInteger(propertyKey));
            }
            if (customData.getFloat(propertyKey) != null) {
                Double data = Double.valueOf(customData.getFloat(propertyKey));
                map.putDouble(propertyKey, data);
            }
            if (customData.getBoolean(propertyKey) != null) {
                map.putBoolean(propertyKey, customData.getBoolean(propertyKey));
            }
            if (!TextUtils.isEmpty(customData.getString(propertyKey))) {
                map.putString(propertyKey, customData.getString(propertyKey));
            }
            if (customData.getArray(propertyKey) != null && customData.getArray(propertyKey).size() > 0) {
                List<Object> propertyList = customData.getArray(propertyKey);
                WritableArray array = fillArrayOfCustomData(propertyList);
                map.putArray(propertyKey, array);
            }
        }

        return map;
    }

    private static <T> WritableArray fillArrayOfCustomData(List<T> arrayOfCustomData) {
        WritableArray array = new WritableNativeArray();

        for (T dataObject : arrayOfCustomData) {
            if (dataObject instanceof Integer) {
                array.pushInt((Integer) dataObject);
            }
            if (dataObject instanceof Float) {
                array.pushDouble((Double) dataObject);
            }
            if (dataObject instanceof Boolean) {
                array.pushBoolean((Boolean) dataObject);
            }
            if (dataObject instanceof String) {
                array.pushString((String) dataObject);
            }
        }

        return array;
    }

    static QBRequestGetBuilder addDialogSortToRequestBuilder(QBRequestGetBuilder requestGetBuilder, ReadableMap sortMap) {
        if (sortMap != null) {
            String fieldValue = sortMap.hasKey("field") ? sortMap.getString("field") : null;
            String sortField = ChatConstants.DialogsSort.getFieldByValue(fieldValue).eventValue;

            boolean ascendingValue = sortMap.hasKey("ascending") && sortMap.getBoolean("ascending");
            if (ascendingValue) {
                requestGetBuilder.sortAsc(sortField);
            } else {
                requestGetBuilder.sortDesc(sortField);
            }
        }

        return requestGetBuilder;
    }

    static QBRequestGetBuilder addDialogFilterToRequestBuilder(QBRequestGetBuilder requestGetBuilder, ReadableMap filterMap) {
        if (filterMap != null) {
            String fieldValue = filterMap.hasKey("field") ? filterMap.getString("field") : null;
            String filterField = ChatConstants.DialogsFilter.getFieldByValue(fieldValue).eventValue;

            String operatorValue = filterMap.hasKey("operator") ? filterMap.getString("operator") : null;
            String filterOperator = ChatConstants.DialogsFilter.getOperatorByValue(operatorValue).eventValue;

            String filterValue = filterMap.hasKey("value") ? filterMap.getString("value") : null;

            if (filterOperator.equals(ChatConstants.DialogsFilterOperator.LT.eventValue)) {
                requestGetBuilder.lt(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.DialogsFilterOperator.LTE.eventValue)) {
                requestGetBuilder.lte(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.DialogsFilterOperator.GT.eventValue)) {
                requestGetBuilder.gt(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.DialogsFilterOperator.GTE.eventValue)) {
                requestGetBuilder.gte(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.DialogsFilterOperator.NE.eventValue)) {
                requestGetBuilder.ne(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.DialogsFilterOperator.IN.eventValue)) {
                requestGetBuilder.in(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.DialogsFilterOperator.NIN.eventValue)) {
                requestGetBuilder.nin(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.DialogsFilterOperator.ALL.eventValue)) {
                requestGetBuilder.all(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.DialogsFilterOperator.CTN.eventValue)) {
                requestGetBuilder.ctn(filterField, filterValue);
            } else {
                requestGetBuilder.addRule(filterField, QueryRule.EQ, fieldValue);
            }
        }

        return requestGetBuilder;
    }

    static QBRequestGetBuilder addMessageSortToRequestBuilder(QBRequestGetBuilder requestGetBuilder, ReadableMap sortMap) {
        if (sortMap != null) {
            String fieldValue = sortMap.hasKey("field") ? sortMap.getString("field") : null;
            String sortField = ChatConstants.MessagesSort.getFieldByValue(fieldValue).eventValue;

            boolean ascendingValue = sortMap.hasKey("ascending") && sortMap.getBoolean("ascending");
            if (ascendingValue) {
                requestGetBuilder.sortAsc(sortField);
            } else {
                requestGetBuilder.sortDesc(sortField);
            }
        }

        return requestGetBuilder;
    }

    static QBRequestGetBuilder addMessageFilterToRequestBuilder(QBRequestGetBuilder requestGetBuilder, ReadableMap filterMap) {
        if (filterMap != null) {
            String fieldValue = filterMap.hasKey("field") ? filterMap.getString("field") : null;
            String filterField = ChatConstants.MessagesFilter.getFieldByValue(fieldValue).eventValue;

            String operatorValue = filterMap.hasKey("operator") ? filterMap.getString("operator") : null;
            String filterOperator = ChatConstants.MessagesFilter.getOperatorByValue(operatorValue).eventValue;

            String filterValue = filterMap.hasKey("value") ? filterMap.getString("value") : null;

            if (filterOperator.equals(ChatConstants.MessagesFilterOperator.LT.eventValue)) {
                requestGetBuilder.lt(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.MessagesFilterOperator.LTE.eventValue)) {
                requestGetBuilder.lte(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.MessagesFilterOperator.GT.eventValue)) {
                requestGetBuilder.gt(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.MessagesFilterOperator.GTE.eventValue)) {
                requestGetBuilder.gte(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.MessagesFilterOperator.NE.eventValue)) {
                requestGetBuilder.ne(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.MessagesFilterOperator.IN.eventValue)) {
                requestGetBuilder.in(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.MessagesFilterOperator.NIN.eventValue)) {
                requestGetBuilder.nin(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.MessagesFilterOperator.OR.eventValue)) {
                requestGetBuilder.all(filterField, filterValue);
            } else if (filterOperator.equals(ChatConstants.MessagesFilterOperator.CTN.eventValue)) {
                requestGetBuilder.ctn(filterField, filterValue);
            } else {
                requestGetBuilder.addRule(filterField, QueryRule.EQ, fieldValue);
            }
        }

        return requestGetBuilder;
    }

    static ArrayList getFilterValueFromMap(ReadableMap filterMap) {
        ArrayList filterValue = null;
        if (filterMap != null && filterMap.hasKey("value")) {
            try {
                ReadableArray array = filterMap.getArray("value");
                filterValue = Arguments.toList(array);
                filterMap.getArray("value");
            } catch (ClassCastException e) {
                //ignore
            }
            if (filterValue == null) {
                try {
                    String filter = filterMap.getString("value");
                    String[] filterArray = TextUtils.split(filter, ",");
                    filterValue = new ArrayList(Arrays.asList(filterArray));
                } catch (ClassCastException e) {
                    //ignore
                }
            }
        }
        return filterValue;
    }
}