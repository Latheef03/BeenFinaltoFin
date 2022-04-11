package com.quickblox.reactnative.chat;

import java.util.HashMap;
import java.util.Map;

class ChatConstants {

    private ChatConstants() {
        //empty
    }

    static final String EVENT_TYPE = "EVENT_TYPE";
    static final String DIALOG_TYPE = "DIALOG_TYPE";

    static final String DIALOGS_SORT = "DIALOGS_SORT";
    static final String DIALOGS_FILTER = "DIALOGS_FILTER";

    static final String MESSAGES_SORT = "MESSAGES_SORT";
    static final String MESSAGES_FILTER = "MESSAGES_FILTER";

    /*=================== DIALOG TYPES ===================*/
    enum DialogType {
        PUBLIC_CHAT(1, "PUBLIC_CHAT"),
        GROUP_CHAT(2, "GROUP_CHAT"),
        CHAT(3, "CHAT");

        private int type;

        private String name;

        DialogType(int type, String name) {
            this.type = type;
            this.name = name;
        }

        static Map<String, Integer> getDialogTypes() {
            Map<String, Integer> dialogTypes = new HashMap<>();
            dialogTypes.put(DialogType.PUBLIC_CHAT.name, DialogType.PUBLIC_CHAT.type);
            dialogTypes.put(DialogType.GROUP_CHAT.name, DialogType.GROUP_CHAT.type);
            dialogTypes.put(DialogType.CHAT.name, DialogType.CHAT.type);
            return dialogTypes;
        }
    }

    /*=================== CHAT EVENTS ===================*/

    enum ChatEvents {
        MESSAGE("MESSAGE"),
        CONNECTION("CONNECTION"),
        SYSTEM_MESSAGE("SYSTEM_MESSAGE"),
        MESSAGE_STATUS("MESSAGE_STATUS"),
        TYPING("TYPING");

        private String eventName;

        ChatEvents(String eventName) {
            this.eventName = eventName;
        }

        static Map<String, String> getChatEvents() {
            Map<String, String> chatEvents = new HashMap<>();

            //Connection
            chatEvents.put(ChatEventsConnection.CONNECTED.eventName, ChatEventsConnection.CONNECTED.eventValue);
            chatEvents.put(ChatEventsConnection.CONNECTION_CLOSED_ON_ERROR.eventName, ChatEventsConnection.CONNECTION_CLOSED_ON_ERROR.eventValue);
            chatEvents.put(ChatEventsConnection.CONNECTION_CLOSED.eventName, ChatEventsConnection.CONNECTION_CLOSED.eventValue);
            chatEvents.put(ChatEventsConnection.RECONNECTION_FAILED.eventName, ChatEventsConnection.RECONNECTION_FAILED.eventValue);
            chatEvents.put(ChatEventsConnection.RECONNECTION_SUCCESSFUL.eventName, ChatEventsConnection.RECONNECTION_SUCCESSFUL.eventValue);

            //Message
            chatEvents.put(ChatEventsMessage.RECEIVED_NEW_MESSAGE.eventName, ChatEventsMessage.RECEIVED_NEW_MESSAGE.eventValue);

            //System Message
            chatEvents.put(ChatEventsSystemMessage.RECEIVED_NEW_MESSAGE.eventName, ChatEventsSystemMessage.RECEIVED_NEW_MESSAGE.eventValue);

            //Message Status
            chatEvents.put(ChatEventsMessageStatus.MESSAGE_DELIVERED.eventName, ChatEventsMessageStatus.MESSAGE_DELIVERED.eventValue);
            chatEvents.put(ChatEventsMessageStatus.MESSAGE_READ.eventName, ChatEventsMessageStatus.MESSAGE_READ.eventValue);

            //Typing
            chatEvents.put(ChatEventsTyping.USER_IS_TYPING.eventName, ChatEventsTyping.USER_IS_TYPING.eventValue);
            chatEvents.put(ChatEventsTyping.USER_STOPPED_TYPING.eventName, ChatEventsTyping.USER_STOPPED_TYPING.eventValue);

            return chatEvents;
        }
    }

    enum ChatEventsConnection {
        CONNECTED("CONNECTED", "@QB/CONNECTED"),
        CONNECTION_CLOSED_ON_ERROR("CONNECTION_CLOSED_ON_ERROR", "@QB/CONNECTION_CLOSED_ON_ERROR"),
        CONNECTION_CLOSED("CONNECTION_CLOSED", "@QB/CONNECTION_CLOSED"),
        RECONNECTION_FAILED("RECONNECTION_FAILED", "@QB/RECONNECTION_FAILED"),
        RECONNECTION_SUCCESSFUL("RECONNECTION_SUCCESSFUL", "@QB/RECONNECTION_SUCCESSFUL");

        String eventName;
        String eventValue;

        ChatEventsConnection(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }
    }

    enum ChatEventsMessage {
        RECEIVED_NEW_MESSAGE("RECEIVED_NEW_MESSAGE", "@QB/RECEIVED_NEW_MESSAGE");

        String eventName;
        String eventValue;

        ChatEventsMessage(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }
    }

    enum ChatEventsSystemMessage {
        RECEIVED_NEW_MESSAGE("RECEIVED_SYSTEM_MESSAGE", "@QB/RECEIVED_SYSTEM_MESSAGE");

        String eventName;
        String eventValue;

        ChatEventsSystemMessage(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }
    }

    enum ChatEventsMessageStatus {
        MESSAGE_DELIVERED("MESSAGE_DELIVERED", "@QB/MESSAGE_DELIVERED"),
        MESSAGE_READ("MESSAGE_READ", "@QB/MESSAGE_READ");

        String eventName;
        String eventValue;

        ChatEventsMessageStatus(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }
    }

    enum ChatEventsTyping {
        USER_IS_TYPING("USER_IS_TYPING", "@QB/USER_IS_TYPING"),
        USER_STOPPED_TYPING("USER_STOPPED_TYPING", "@QB/USER_STOPPED_TYPING");

        String eventName;
        String eventValue;

        ChatEventsTyping(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }
    }

    /*=================== DIALOGS_SORT ===================*/

    enum DialogsSort {
        FIELD("FIELD", "field");

        String eventName;
        String eventValue;

        DialogsSort(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static DialogSortField getFieldByValue(String value) {
            return DialogSortField.getFieldByValue(value);
        }

        static Map<String, Map<String, String>> getDialogsSorts() {
            Map<String, Map<String, String>> events = new HashMap<>();
            events.put(FIELD.eventName, DialogSortField.getAll());
            return events;
        }
    }

    enum DialogSortField {

        LAST_MESSAGE_DATE_SENT("LAST_MESSAGE_DATE_SENT", "last_message_date_sent");

        String eventName;
        String eventValue;

        DialogSortField(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(LAST_MESSAGE_DATE_SENT.eventName, LAST_MESSAGE_DATE_SENT.eventValue);
            return values;
        }

        static DialogSortField getFieldByValue(String value) {
            DialogSortField dialogSortField = null;
            if (value.equals(LAST_MESSAGE_DATE_SENT.eventValue)) {
                dialogSortField = LAST_MESSAGE_DATE_SENT;
            }
            return dialogSortField;
        }
    }

    /*=================== MESSAGES_SORT ===================*/

    enum MessagesSort {
        FIELD("FIELD", "field");

        String eventName;
        String eventValue;

        MessagesSort(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, Map<String, String>> getMessagesSorts() {
            Map<String, Map<String, String>> events = new HashMap<>();
            events.put(FIELD.eventName, MessagesSortField.getAll());
            return events;
        }

        static MessagesSortField getFieldByValue(String value) {
            return MessagesSortField.getFieldByValue(value);
        }
    }

    enum MessagesSortField {
        DATE_SENT("DATE_SENT", "date_sent");

        String eventName;
        String eventValue;

        MessagesSortField(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(DATE_SENT.eventName, DATE_SENT.eventValue);
            return values;
        }

        static MessagesSortField getFieldByValue(String value) {
            MessagesSortField messagesSort = null;
            if (value.equals(DATE_SENT.eventValue)) {
                messagesSort = DATE_SENT;
            }
            return messagesSort;
        }
    }

    /*=================== MESSAGES_FILTER ===================*/

    enum MessagesFilter {
        FIELD("FIELD", "field"),
        OPERATOR("OPERATOR", "operator");

        String eventName;
        String eventValue;

        MessagesFilter(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, Map<String, String>> getMessagesFilters() {
            Map<String, Map<String, String>> values = new HashMap<>();
            values.put(FIELD.eventName, MessagesFilterField.getAll());
            values.put(OPERATOR.eventName, MessagesFilterOperator.getAll());
            return values;
        }

        static MessagesFilterField getFieldByValue(String value) {
            return MessagesFilterField.getFieldByValue(value);
        }

        static MessagesFilterOperator getOperatorByValue(String value) {
            return MessagesFilterOperator.getOperatorByValue(value);
        }

        static Map<String, Map<String, String>> getDialogsFilters() {
            Map<String, Map<String, String>> values = new HashMap<>();
            values.put(FIELD.eventName, DialogsFilterField.getAll());
            values.put(OPERATOR.eventName, DialogsFilterOperator.getAll());
            return values;
        }
    }

    enum MessagesFilterField {
        ID("ID", "_id"),
        BODY("BODY", "message"),
        DATE_SENT("DATE_SENT", "date_sent"),
        SENDER_ID("SENDER_ID", "sender_id"),
        RECIPIENT_ID("RECIPIENT_ID", "recipient_id"),
        ATTACHMENTS_TYPE("ATTACHMENTS_TYPE", "attachments_type"),
        UPDATED_AT("UPDATED_AT", "updated_at");

        String eventName;
        String eventValue;

        MessagesFilterField(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static MessagesFilterField getFieldByValue(String value) {
            MessagesFilterField messagesFilterField = null;
            if (value.equals(ID.eventValue)) {
                messagesFilterField = ID;
            } else if (value.equals(BODY.eventValue)) {
                messagesFilterField = BODY;
            } else if (value.equals(DATE_SENT.eventValue)) {
                messagesFilterField = DATE_SENT;
            } else if (value.equals(SENDER_ID.eventValue)) {
                messagesFilterField = SENDER_ID;
            } else if (value.equals(RECIPIENT_ID.eventValue)) {
                messagesFilterField = RECIPIENT_ID;
            } else if (value.equals(ATTACHMENTS_TYPE.eventValue)) {
                messagesFilterField = ATTACHMENTS_TYPE;
            } else if (value.equals(UPDATED_AT.eventValue)) {
                messagesFilterField = UPDATED_AT;
            }
            return messagesFilterField;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(ID.eventName, ID.eventValue);
            values.put(BODY.eventName, BODY.eventValue);
            values.put(DATE_SENT.eventName, DATE_SENT.eventValue);
            values.put(SENDER_ID.eventName, SENDER_ID.eventValue);
            values.put(RECIPIENT_ID.eventName, RECIPIENT_ID.eventValue);
            values.put(ATTACHMENTS_TYPE.eventName, ATTACHMENTS_TYPE.eventValue);
            values.put(UPDATED_AT.eventName, UPDATED_AT.eventValue);
            return values;
        }
    }

    enum MessagesFilterOperator {
        LT("LT", "lt"),
        LTE("LTE", "lte"),
        GT("GT", "gt"),
        GTE("GTE", "gte"),
        NE("NE", "ne"),
        IN("IN", "in"),
        NIN("NIN", "nin"),
        OR("OR", "or"),
        CTN("CTN", "ctn");

        String eventName;
        String eventValue;

        MessagesFilterOperator(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static MessagesFilterOperator getOperatorByValue(String value) {
            MessagesFilterOperator messagesFilterOperator = null;
            if (value.equals(LT.eventName)) {
                messagesFilterOperator = LT;
            } else if (value.equals(LTE.eventValue)) {
                messagesFilterOperator = LTE;
            } else if (value.equals(GT.eventValue)) {
                messagesFilterOperator = GT;
            } else if (value.equals(GTE.eventValue)) {
                messagesFilterOperator = GTE;
            } else if (value.equals(NE.eventValue)) {
                messagesFilterOperator = NE;
            } else if (value.equals(IN.eventValue)) {
                messagesFilterOperator = IN;
            } else if (value.equals(NIN.eventValue)) {
                messagesFilterOperator = NIN;
            } else if (value.equals(OR.eventValue)) {
                messagesFilterOperator = OR;
            } else if (value.equals(CTN.eventValue)) {
                messagesFilterOperator = CTN;
            }
            return messagesFilterOperator;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(LT.eventName, LT.eventValue);
            values.put(LTE.eventName, LTE.eventValue);
            values.put(GT.eventName, GT.eventValue);
            values.put(GTE.eventName, GTE.eventValue);
            values.put(NE.eventName, NE.eventValue);
            values.put(IN.eventName, IN.eventValue);
            values.put(NIN.eventName, NIN.eventValue);
            values.put(OR.eventName, OR.eventValue);
            values.put(CTN.eventName, CTN.eventValue);
            return values;
        }
    }

    /*=================== DIALOGS_FILTER ===================*/

    enum DialogsFilter {
        FIELD("FIELD", "field"),
        OPERATOR("OPERATOR", "operator");

        String eventName;
        String eventValue;

        DialogsFilter(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static DialogsFilterField getFieldByValue(String value) {
            return DialogsFilterField.getFieldByValue(value);
        }

        static DialogsFilterOperator getOperatorByValue(String value) {
            return DialogsFilterOperator.getOperatorByValue(value);
        }

        static Map<String, Map<String, String>> getDialogsFilters() {
            Map<String, Map<String, String>> values = new HashMap<>();
            values.put(FIELD.eventName, DialogsFilterField.getAll());
            values.put(OPERATOR.eventName, DialogsFilterOperator.getAll());
            return values;
        }
    }

    enum DialogsFilterField {
        ID("ID", "_id"),
        TYPE("TYPE", "type"),
        NAME("NAME", "name"),
        LAST_MESSAGE_DATE_SENT("LAST_MESSAGE_DATE_SENT", "last_message_date_sent"),
        CREATED_AT("CREATED_AT", "created_at"),
        UPDATED_AT("UPDATED_AT", "updated_at");

        String eventName;
        String eventValue;

        DialogsFilterField(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(ID.eventName, ID.eventValue);
            values.put(TYPE.eventName, TYPE.eventValue);
            values.put(NAME.eventName, NAME.eventValue);
            values.put(LAST_MESSAGE_DATE_SENT.eventName, LAST_MESSAGE_DATE_SENT.eventValue);
            values.put(CREATED_AT.eventName, CREATED_AT.eventValue);
            values.put(UPDATED_AT.eventName, UPDATED_AT.eventValue);
            return values;
        }

        static DialogsFilterField getFieldByValue(String value) {
            DialogsFilterField dialogsFilterField = null;
            if (value.equals(ID.eventValue)) {
                dialogsFilterField = ID;
            } else if (value.equals(TYPE.eventValue)) {
                dialogsFilterField = TYPE;
            } else if (value.equals(NAME.eventValue)) {
                dialogsFilterField = NAME;
            } else if (value.equals(LAST_MESSAGE_DATE_SENT.eventValue)) {
                dialogsFilterField = LAST_MESSAGE_DATE_SENT;
            } else if (value.equals(CREATED_AT.eventValue)) {
                dialogsFilterField = CREATED_AT;
            } else if (value.equals(UPDATED_AT.eventValue)) {
                dialogsFilterField = UPDATED_AT;
            }
            return dialogsFilterField;
        }
    }

    enum DialogsFilterOperator {
        LT("LT", "lt"),
        LTE("LTE", "lte"),
        GT("GT", "gt"),
        GTE("GTE", "gte"),
        NE("NE", "ne"),
        IN("IN", "in"),
        NIN("NIN", "nin"),
        ALL("ALL", "all"),
        CTN("CTN", "ctn");

        String eventName;
        String eventValue;

        DialogsFilterOperator(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(LT.eventName, LT.eventValue);
            values.put(LTE.eventName, LTE.eventValue);
            values.put(GT.eventName, GT.eventValue);
            values.put(GTE.eventName, GTE.eventValue);
            values.put(NE.eventName, NE.eventValue);
            values.put(IN.eventName, IN.eventValue);
            values.put(NIN.eventName, NIN.eventValue);
            values.put(ALL.eventName, ALL.eventValue);
            values.put(CTN.eventName, CTN.eventValue);
            return values;
        }

        static DialogsFilterOperator getOperatorByValue(String value) {
            DialogsFilterOperator dialogsFilterOperator = null;
            if (value.equals(LT.eventName)) {
                dialogsFilterOperator = LT;
            } else if (value.equals(LTE.eventValue)) {
                dialogsFilterOperator = LTE;
            } else if (value.equals(GT.eventValue)) {
                dialogsFilterOperator = GT;
            } else if (value.equals(GTE.eventValue)) {
                dialogsFilterOperator = GTE;
            } else if (value.equals(NE.eventValue)) {
                dialogsFilterOperator = NE;
            } else if (value.equals(IN.eventValue)) {
                dialogsFilterOperator = IN;
            } else if (value.equals(NIN.eventValue)) {
                dialogsFilterOperator = NIN;
            } else if (value.equals(ALL.eventValue)) {
                dialogsFilterOperator = ALL;
            } else if (value.equals(CTN.eventValue)) {
                dialogsFilterOperator = CTN;
            }
            return dialogsFilterOperator;
        }
    }
}