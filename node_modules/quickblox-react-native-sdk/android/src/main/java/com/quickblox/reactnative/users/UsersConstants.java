package com.quickblox.reactnative.users;

import java.util.HashMap;
import java.util.Map;

class UsersConstants {

    static final String USERS_SORT = "USERS_SORT";
    static final String USERS_FILTER = "USERS_FILTER";

    private UsersConstants() {
        //empty
    }

    /*=================== USERS SORT ===================*/

    enum UsersSort {

        TYPE("TYPE", "type"),
        FIELD("FIELD", "field");

        String eventName;
        String eventValue;

        UsersSort(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static UsersSortType getTypeByValue(String value) {
            return UsersSortType.getTypeByValue(value);
        }

        static UsersSortField getFieldByValue(String value) {
            return UsersSortField.getFieldByValue(value);
        }

        static Map<String, Map<String, String>> getUsersSorts() {
            Map<String, Map<String, String>> sortsValues = new HashMap<>();
            sortsValues.put(TYPE.eventName, UsersSortType.getAll());
            sortsValues.put(FIELD.eventName, UsersSortField.getAll());
            return sortsValues;
        }

        static String getAscDesc(boolean ascendingValue) {
            String ascDesc = "asc";
            if (!ascendingValue) {
                ascDesc = "desc";
            }
            return ascDesc;
        }
    }

    enum UsersSortType {
        STRING("STRING", "string"),
        NUMBER("NUMBER", "number"),
        DATE("DATE", "date");

        String eventName;
        String eventValue;

        UsersSortType(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> events = new HashMap<>();
            events.put(STRING.eventName, STRING.eventValue);
            events.put(NUMBER.eventName, NUMBER.eventValue);
            events.put(DATE.eventName, DATE.eventValue);
            return events;
        }

        static UsersSortType getTypeByValue(String value) {
            UsersSortType usersSortType = null;
            if (value.equals(STRING.eventValue)) {
                usersSortType = STRING;
            } else if (value.equals(NUMBER.eventValue)) {
                usersSortType = NUMBER;
            } else if (value.equals(DATE.eventValue)) {
                usersSortType = DATE;
            }
            return usersSortType;
        }
    }

    enum UsersSortField {
        ID("ID", "id"),
        FULL_NAME("FULL_NAME", "full_name"),
        EMAIL("EMAIL", "email"),
        LOGIN("LOGIN", "login"),
        PHONE("PHONE", "phone"),
        WEBSITE("WEBSITE", "website"),
        CREATED_AT("CREATED_AT", "created_at"),
        UPDATED_AT("UPDATED_AT", "updated_at"),
        LAST_REQUEST_AT("LAST_REQUEST_AT", "last_request_at"),
        EXTERNAL_USER_ID("EXTERNAL_USER_ID", "external_user_id"),
        TWITTER_ID("TWITTER_ID", "twitter_id"),
        FACEBOOK_ID("FACEBOOK_ID", "facebook_id");

        String eventName;
        String eventValue;

        UsersSortField(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> events = new HashMap<>();
            events.put(ID.eventName, ID.eventValue);
            events.put(FULL_NAME.eventName, FULL_NAME.eventValue);
            events.put(EMAIL.eventName, EMAIL.eventValue);
            events.put(LOGIN.eventName, LOGIN.eventValue);
            events.put(PHONE.eventName, PHONE.eventValue);
            events.put(WEBSITE.eventName, WEBSITE.eventValue);
            events.put(CREATED_AT.eventName, CREATED_AT.eventValue);
            events.put(UPDATED_AT.eventName, UPDATED_AT.eventValue);
            events.put(LAST_REQUEST_AT.eventName, LAST_REQUEST_AT.eventValue);
            events.put(EXTERNAL_USER_ID.eventName, EXTERNAL_USER_ID.eventValue);
            events.put(TWITTER_ID.eventName, TWITTER_ID.eventValue);
            events.put(FACEBOOK_ID.eventName, FACEBOOK_ID.eventValue);
            return events;
        }

        static UsersSortField getFieldByValue(String value) {
            UsersSortField usersSortField = null;
            if (value.equals(ID.eventValue)) {
                usersSortField = ID;
            } else if (value.equals(FULL_NAME.eventValue)) {
                usersSortField = FULL_NAME;
            } else if (value.equals(EMAIL.eventValue)) {
                usersSortField = EMAIL;
            } else if (value.equals(LOGIN.eventValue)) {
                usersSortField = LOGIN;
            } else if (value.equals(PHONE.eventValue)) {
                usersSortField = PHONE;
            } else if (value.equals(WEBSITE.eventValue)) {
                usersSortField = WEBSITE;
            } else if (value.equals(CREATED_AT.eventValue)) {
                usersSortField = CREATED_AT;
            } else if (value.equals(UPDATED_AT.eventValue)) {
                usersSortField = UPDATED_AT;
            } else if (value.equals(LAST_REQUEST_AT.eventValue)) {
                usersSortField = LAST_REQUEST_AT;
            } else if (value.equals(EXTERNAL_USER_ID.eventValue)) {
                usersSortField = EXTERNAL_USER_ID;
            } else if (value.equals(TWITTER_ID.eventValue)) {
                usersSortField = TWITTER_ID;
            } else if (value.equals(FACEBOOK_ID.eventValue)) {
                usersSortField = FACEBOOK_ID;
            }
            return usersSortField;
        }
    }

    /*=================== USERS_FILTER ===================*/

    enum UsersFilter {
        TYPE("TYPE", "type"),
        FIELD("FIELD", "field"),
        OPERATOR("OPERATOR", "operator");

        String eventName;
        String eventValue;

        UsersFilter(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static UsersFilterType getTypeByValue(String value) {
            return UsersFilterType.getTypeByValue(value);
        }

        static UsersFilterField getFieldByValue(String value) {
            return UsersFilterField.getFieldByValue(value);
        }

        static UsersFilterOperator getOperatorByValue(String value) {
            return UsersFilterOperator.getOperatorByValue(value);
        }

        static Map<String, Map<String, String>> getUsersFilters() {
            Map<String, Map<String, String>> events = new HashMap<>();
            events.put(TYPE.eventName, UsersFilterType.getAll());
            events.put(FIELD.eventName, UsersFilterField.getAll());
            events.put(OPERATOR.eventName, UsersFilterOperator.getAll());
            return events;
        }
    }

    enum UsersFilterType {
        STRING("STRING", "string"),
        NUMBER("NUMBER", "number"),
        DATE("DATE", "date");

        String eventName;
        String eventValue;

        UsersFilterType(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(STRING.eventName, STRING.eventValue);
            values.put(NUMBER.eventName, NUMBER.eventValue);
            values.put(DATE.eventName, DATE.eventValue);
            return values;
        }

        static UsersFilterType getTypeByValue(String value) {
            UsersFilterType usersFilterType = null;
            if (value.equals(STRING.eventValue)) {
                usersFilterType = STRING;
            } else if (value.equals(NUMBER.eventValue)) {
                usersFilterType = NUMBER;
            } else if (value.equals(DATE.eventValue)) {
                usersFilterType = DATE;
            }
            return usersFilterType;
        }
    }

    enum UsersFilterField {
        ID("ID", "id"),
        FULL_NAME("FULL_NAME", "full_name"),
        EMAIL("EMAIL", "email"),
        LOGIN("LOGIN", "login"),
        PHONE("PHONE", "phone"),
        WEBSITE("WEBSITE", "website"),
        CREATED_AT("CREATED_AT", "created_at"),
        UPDATED_AT("UPDATED_AT", "updated_at"),
        LAST_REQUEST_AT("LAST_REQUEST_AT", "last_request_at"),
        EXTERNAL_USER_ID("EXTERNAL_USER_ID", "external_user_id"),
        TWITTER_ID("TWITTER_ID", "twitter_id"),
        FACEBOOK_ID("FACEBOOK_ID", "facebook_id");

        String eventName;
        String eventValue;

        UsersFilterField(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(ID.eventName, ID.eventValue);
            values.put(FULL_NAME.eventName, FULL_NAME.eventValue);
            values.put(EMAIL.eventName, EMAIL.eventValue);
            values.put(LOGIN.eventName, LOGIN.eventValue);
            values.put(PHONE.eventName, PHONE.eventValue);
            values.put(WEBSITE.eventName, WEBSITE.eventValue);
            values.put(CREATED_AT.eventName, CREATED_AT.eventValue);
            values.put(UPDATED_AT.eventName, UPDATED_AT.eventValue);
            values.put(LAST_REQUEST_AT.eventName, LAST_REQUEST_AT.eventValue);
            values.put(EXTERNAL_USER_ID.eventName, EXTERNAL_USER_ID.eventValue);
            values.put(TWITTER_ID.eventName, TWITTER_ID.eventValue);
            values.put(FACEBOOK_ID.eventName, FACEBOOK_ID.eventValue);
            return values;
        }

        static UsersFilterField getFieldByValue(String value) {
            UsersFilterField usersFilterField = null;
            if (value.equals(UsersFilterField.ID.eventValue)) {
                usersFilterField = ID;
            } else if (value.equals(FULL_NAME.eventValue)) {
                usersFilterField = FULL_NAME;
            } else if (value.equals(EMAIL.eventValue)) {
                usersFilterField = EMAIL;
            } else if (value.equals(LOGIN.eventValue)) {
                usersFilterField = LOGIN;
            } else if (value.equals(PHONE.eventValue)) {
                usersFilterField = PHONE;
            } else if (value.equals(WEBSITE.eventValue)) {
                usersFilterField = WEBSITE;
            } else if (value.equals(CREATED_AT.eventValue)) {
                usersFilterField = CREATED_AT;
            } else if (value.equals(UPDATED_AT.eventValue)) {
                usersFilterField = UPDATED_AT;
            } else if (value.equals(LAST_REQUEST_AT.eventValue)) {
                usersFilterField = LAST_REQUEST_AT;
            } else if (value.equals(EXTERNAL_USER_ID.eventValue)) {
                usersFilterField = EXTERNAL_USER_ID;
            } else if (value.equals(TWITTER_ID.eventValue)) {
                usersFilterField = TWITTER_ID;
            } else if (value.equals(FACEBOOK_ID.eventValue)) {
                usersFilterField = FACEBOOK_ID;
            }
            return usersFilterField;
        }
    }

    enum UsersFilterOperator {
        GT("GT", "gt"),
        LT("LT", "lt"),
        GE("GE", "ge"),
        LE("LE", "le"),
        EQ("EQ", "eq"),
        NE("NE", "ne"),
        BETWEEN("BETWEEN", "between"),
        IN("IN", "in");

        String eventName;
        String eventValue;

        UsersFilterOperator(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(GT.eventName, GT.eventValue);
            values.put(LT.eventName, LT.eventValue);
            values.put(GE.eventName, GE.eventValue);
            values.put(LE.eventName, LE.eventValue);
            values.put(EQ.eventName, EQ.eventValue);
            values.put(NE.eventName, NE.eventValue);
            values.put(BETWEEN.eventName, BETWEEN.eventValue);
            values.put(IN.eventName, IN.eventValue);
            return values;
        }

        static UsersFilterOperator getOperatorByValue(String value) {
            UsersFilterOperator usersFilterOperator = null;
            if (value.equals(GT.eventValue)) {
                usersFilterOperator = GT;
            } else if (value.equals(LT.eventValue)) {
                usersFilterOperator = LT;
            } else if (value.equals(GE.eventValue)) {
                usersFilterOperator = GE;
            } else if (value.equals(LE.eventValue)) {
                usersFilterOperator = LE;
            } else if (value.equals(EQ.eventValue)) {
                usersFilterOperator = EQ;
            } else if (value.equals(NE.eventValue)) {
                usersFilterOperator = NE;
            } else if (value.equals(BETWEEN.eventValue)) {
                usersFilterOperator = BETWEEN;
            } else if (value.equals(IN.eventValue)) {
                usersFilterOperator = IN;
            }
            return usersFilterOperator;
        }
    }
}