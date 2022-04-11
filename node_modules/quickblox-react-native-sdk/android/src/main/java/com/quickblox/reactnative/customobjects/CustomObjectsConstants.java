package com.quickblox.reactnative.customobjects;

import java.util.HashMap;
import java.util.Map;

class CustomObjectsConstants {

    static final String PERMISSIONS_LEVEL = "PERMISSIONS_LEVEL";

    static final String OBJECTS_SEARCH_OPERATOR = "OBJECTS_SEARCH_OPERATOR";
    static final String OBJECTS_UPDATE_OPERATOR = "OBJECTS_UPDATE_OPERATOR";

    static final String PULL_FILTER = "PULL_FILTER";

    private static final String INTEGER_TYPE = "INTEGER";
    private static final String FLOAT_TYPE = "FLOAT";
    private static final String STRING_TYPE = "STRING";
    private static final String BOOLEAN_TYPE = "BOOLEAN";
    private static final String ARRAY_TYPE = "ARRAY";

    private CustomObjectsConstants() {
        //empty
    }

    /*== PERMISSIONS LEVEL ==*/
    enum PermissionsLevelNames {

        OPEN("OPEN", "open"),
        OWNER("OWNER", "owner"),
        OPEN_FOR_USER_IDS("OPEN_FOR_USER_IDS", "open_for_users_ids"),
        OPEN_FOR_GROUPS("OPEN_FOR_GROUPS", "open_for_groups");

        String eventName;
        String eventValue;

        PermissionsLevelNames(String eventName, String eventValue) {
            this.eventName = eventName;
            this.eventValue = eventValue;
        }

        static Map<String, String> getPermissionsLevelNames() {
            Map<String, String> permissionsLevelNames = new HashMap<>();
            permissionsLevelNames.put(OPEN.eventName, OPEN.eventValue);
            permissionsLevelNames.put(OWNER.eventName, OWNER.eventValue);
            permissionsLevelNames.put(OPEN_FOR_USER_IDS.eventName, OPEN_FOR_USER_IDS.eventValue);
            permissionsLevelNames.put(OPEN_FOR_GROUPS.eventName, OPEN_FOR_GROUPS.eventValue);
            return permissionsLevelNames;
        }

        static PermissionsLevelNames getPermissionByValue(String value) {
            PermissionsLevelNames permissionsLevelNames = null;
            if (value.equals(OPEN.eventValue)) {
                permissionsLevelNames = OPEN;
            } else if (value.equals(OWNER.eventValue)) {
                permissionsLevelNames = OWNER;
            } else if (value.equals(OPEN_FOR_USER_IDS.eventValue)) {
                permissionsLevelNames = OPEN_FOR_USER_IDS;
            } else if (value.equals(OPEN_FOR_GROUPS.eventValue)) {
                permissionsLevelNames = OPEN_FOR_GROUPS;
            }
            return permissionsLevelNames;
        }
    }

    /*== SEARCH ==*/
    enum ForSearchType {
        FOR_TYPE("FOR_TYPE");

        String eventName;

        ForSearchType(String eventName) {
            this.eventName = eventName;
        }

        static Map<String, Map<String, Map<String, String>>> getTypes() {
            Map<String, Map<String, Map<String, String>>> values = new HashMap<>();
            values.put(FOR_TYPE.eventName, getAll());
            return values;
        }

        static Map<String, Map<String, String>> getAll() {
            Map<String, Map<String, String>> values = new HashMap<>();
            values.put(INTEGER_TYPE, getIntegerTypes());
            values.put(FLOAT_TYPE, getFloatTypes());
            values.put(STRING_TYPE, getStringTypes());
            values.put(BOOLEAN_TYPE, getBooleanTypes());
            values.put(ARRAY_TYPE, getArrayTypes());
            return values;
        }

        static Map<String, String> getIntegerTypes() {
            Map<String, String> values = new HashMap<>();
            values.put(IntegerSearchType.LT.eventName, IntegerSearchType.LT.eventName);
            values.put(IntegerSearchType.LTE.eventName, IntegerSearchType.LTE.eventName);
            values.put(IntegerSearchType.GT.eventName, IntegerSearchType.GT.eventName);
            values.put(IntegerSearchType.GTE.eventName, IntegerSearchType.GTE.eventName);
            values.put(IntegerSearchType.NE.eventName, IntegerSearchType.NE.eventName);
            values.put(IntegerSearchType.IN.eventName, IntegerSearchType.IN.eventName);
            values.put(IntegerSearchType.NIN.eventName, IntegerSearchType.NIN.eventName);
            values.put(IntegerSearchType.OR.eventName, IntegerSearchType.OR.eventName);
            return values;
        }

        static Map<String, String> getFloatTypes() {
            Map<String, String> values = new HashMap<>();
            values.put(FloatSearchType.LT.eventName, FloatSearchType.LT.eventName);
            values.put(FloatSearchType.LTE.eventName, FloatSearchType.LTE.eventName);
            values.put(FloatSearchType.GT.eventName, FloatSearchType.GT.eventName);
            values.put(FloatSearchType.GTE.eventName, FloatSearchType.GTE.eventName);
            values.put(FloatSearchType.NE.eventName, FloatSearchType.NE.eventName);
            values.put(FloatSearchType.IN.eventName, FloatSearchType.IN.eventName);
            values.put(FloatSearchType.NIN.eventName, FloatSearchType.NIN.eventName);
            values.put(FloatSearchType.OR.eventName, FloatSearchType.OR.eventName);
            return values;
        }

        static Map<String, String> getStringTypes() {
            Map<String, String> values = new HashMap<>();
            values.put(StringSearchType.NE.eventName, StringSearchType.NE.eventName);
            values.put(StringSearchType.IN.eventName, StringSearchType.IN.eventName);
            values.put(StringSearchType.NIN.eventName, StringSearchType.NIN.eventName);
            values.put(StringSearchType.OR.eventName, StringSearchType.OR.eventName);
            values.put(StringSearchType.CTN.eventName, StringSearchType.CTN.eventName);
            return values;
        }

        static Map<String, String> getBooleanTypes() {
            Map<String, String> values = new HashMap<>();
            values.put(BooleanSearchType.NE.eventName, BooleanSearchType.NE.eventName);
            return values;
        }

        static Map<String, String> getArrayTypes() {
            Map<String, String> values = new HashMap<>();
            values.put(ArraySearchType.ALL.eventName, ArraySearchType.ALL.eventName);
            return values;
        }
    }

    enum IntegerSearchType {
        LT("LT"),
        LTE("LTE"),
        GT("GT"),
        GTE("GTE"),
        NE("NE"),
        IN("IN"),
        NIN("NIN"),
        OR("OR");

        String eventName;

        IntegerSearchType(String eventName) {
            this.eventName = eventName;
        }
    }

    enum FloatSearchType {
        LT("LT"),
        LTE("LTE"),
        GT("GT"),
        GTE("GTE"),
        NE("NE"),
        IN("IN"),
        NIN("NIN"),
        OR("OR");

        String eventName;

        FloatSearchType(String eventName) {
            this.eventName = eventName;
        }
    }

    enum StringSearchType {
        NE("NE"),
        IN("IN"),
        NIN("NIN"),
        OR("OR"),
        CTN("CTN");

        String eventName;

        StringSearchType(String eventName) {
            this.eventName = eventName;
        }
    }

    enum BooleanSearchType {
        NE("NE");

        String eventName;

        BooleanSearchType(String eventName) {
            this.eventName = eventName;
        }
    }

    enum ArraySearchType {
        ALL("ALL");

        String eventName;

        ArraySearchType(String eventName) {
            this.eventName = eventName;
        }
    }

    /*== UPDATE ==*/
    enum ForUpdateType {
        FOR_TYPE("FOR_TYPE");

        String eventName;

        ForUpdateType(String eventName) {
            this.eventName = eventName;
        }

        static Map<String, Map<String, Map<String, String>>> getTypes() {
            Map<String, Map<String, Map<String, String>>> values = new HashMap<>();
            values.put(FOR_TYPE.eventName, getAll());
            return values;
        }

        static Map<String, Map<String, String>> getAll() {
            Map<String, Map<String, String>> values = new HashMap<>();
            values.put(INTEGER_TYPE, getIntegerTypes());
            values.put(FLOAT_TYPE, getFloatTypes());
            values.put(ARRAY_TYPE, getArrayTypes());
            return values;
        }

        static Map<String, String> getIntegerTypes() {
            Map<String, String> values = new HashMap<>();
            values.put(IntegerUpdateType.INC.eventName, IntegerUpdateType.INC.eventName);
            return values;
        }

        static Map<String, String> getFloatTypes() {
            Map<String, String> values = new HashMap<>();
            values.put(FloatUpdateType.INC.eventName, FloatUpdateType.INC.eventName);
            return values;
        }

        static Map<String, String> getArrayTypes() {
            Map<String, String> values = new HashMap<>();
            values.put(ArrayUpdateType.PULL.eventName, ArrayUpdateType.PULL.eventName);
            values.put(ArrayUpdateType.PULL_ALL.eventName, ArrayUpdateType.PULL_ALL.eventName);
            values.put(ArrayUpdateType.POP.eventName, ArrayUpdateType.POP.eventName);
            values.put(ArrayUpdateType.PUSH.eventName, ArrayUpdateType.PUSH.eventName);
            values.put(ArrayUpdateType.ADD_TO_SET.eventName, ArrayUpdateType.ADD_TO_SET.eventName);
            return values;
        }
    }

    enum IntegerUpdateType {
        INC("INC");

        String eventName;

        IntegerUpdateType(String eventName) {
            this.eventName = eventName;
        }
    }

    enum FloatUpdateType {
        INC("INC");

        String eventName;

        FloatUpdateType(String eventName) {
            this.eventName = eventName;
        }
    }

    enum ArrayUpdateType {
        PULL("PULL"),
        PULL_ALL("PULL_ALL"),
        POP("POP"),
        PUSH("PUSH"),
        ADD_TO_SET("ADD_TO_SET");

        String eventName;

        ArrayUpdateType(String eventName) {
            this.eventName = eventName;
        }
    }

    /*== PULL FILTER ==*/
    enum PullFilter {
        LT("LT"),
        LTE("LTE"),
        GT("GT"),
        GTE("GTE"),
        NE("NE"),
        IN("IN"),
        NIN("NIN"),
        OR("OR");

        String eventName;

        PullFilter(String eventName) {
            this.eventName = eventName;
        }

        static Map<String, String> getAll() {
            Map<String, String> values = new HashMap<>();
            values.put(LT.eventName, LT.eventName);
            values.put(LTE.eventName, LTE.eventName);
            values.put(GT.eventName, GT.eventName);
            values.put(GTE.eventName, GTE.eventName);
            values.put(NE.eventName, NE.eventName);
            values.put(IN.eventName, IN.eventName);
            values.put(NIN.eventName, NIN.eventName);
            values.put(OR.eventName, OR.eventName);
            return values;
        }
    }
}