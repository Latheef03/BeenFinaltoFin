import { Platform, Dimensions, PixelRatio } from "react-native";

export const deviceWidth = Dimensions.get("window").width;
export const deviceHeight = Dimensions.get("window").height;

export const FHEIGHT = 30

export const isIOSXandAbove = () => {
  return (
    (Platform.OS === "ios" && deviceHeight === 896 && deviceWidth === 414) ||
    (Platform.OS === "ios" && deviceHeight === 812 && deviceWidth === 375)
  );
};

export const USE_NATIVE_DRIVER = true;

const ADJ_HEIGHT = 250;
export const isEndDeviceYAxis = (offsetY) => {
  return Math.round(deviceHeight) < Math.round(offsetY) + ADJ_HEIGHT;
};

export const getPixels = (pixel) => {
  return Platform.select({
    ios: pixel,
    android: PixelRatio.getPixelSizeForLayoutSize(pixel),
  });
};

export const getPicNameExt = (str) => {
  let file = str.split("/").pop();
  return [
    file.substr(0, file.lastIndexOf(".")),
    file.substr(file.lastIndexOf(".") + 1, file.length),
  ];
};

export const invalidText = (str) => {
  if (
    str == "null" ||
    str == null ||
    str == "undefined" ||
    str == undefined ||
    str == ""
  ) {
    return true;
  }
  return false;
};

export const isValidMail = (mail) => {
  const mailformat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (mailformat.test(mail)) return true;
  else return false;
};

export const getHashTags = (inputText) => {
  var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
  var matches = [];
  var match;

  while ((match = regex.exec(inputText))) {
    matches.push(match[1]);
  }

  return matches;
};

export const getTime = (t) => {
  const digit = (n) => (n < 10 ? `0${n}` : `${n}`);
  const sec = digit(Math.floor(t % 60));
  const min = digit(Math.floor((t / 60) % 60));
  const hr = digit(Math.floor((t / 3600) % 60));
  const visHr = hr > 0 ? hr + ":" : "";
  return visHr + min + ":" + sec;
};

export const Days = () => {
  const d = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  day = days[d.getDay()];
  return day;
};

export const date = () => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let date = new Date().getDate(); //Current Date
  let month = monthNames[new Date().getMonth()];
  let year = new Date().getFullYear(); //Current Year
  fulldate = date + " " + month + " " + year;
  return fulldate;
};

export const timeCalcForChat = (date) => {
  const SECOND = 1;
  const MINUTE = 60;
  const HOUR = 3600;
  const DAY = 86400;
  const MONTH = 2629746;
  const YEAR = 31556952;
  const DECADE = 315569520;
  var now = new Date();
  var diff = Math.round((now - date) / 1000);

  var unit = "";
  var num = 0;
  var plural = false;

  switch (true) {
    case diff <= 0:
      return "just now";
      break;

    case diff < MINUTE:
      num = Math.round(diff / SECOND);
      unit = "s";
      plural = num > 1;
      break;

    case diff < HOUR:
      num = Math.round(diff / MINUTE);
      unit = "m";
      plural = num > 1;
      break;

    case diff < DAY:
      num = Math.round(diff / HOUR);
      unit = "h";
      plural = num > 1;
      break;

    case diff < MONTH:
      num = Math.round(diff / DAY);
      unit = "day";
      plural = num > 1;
      break;

    case diff < YEAR:
      num = Math.round(diff / MONTH);
      unit = "mth";
      plural = num > 1;
      break;

    case diff < DECADE:
      num = Math.round(diff / YEAR);
      unit = "year";
      plural = num > 1;
      break;

    default:
      num = Math.round(diff / YEAR);
      unit = "year";
      plural = num > 1;
  }

  var str = "";
  if (num) {
    str += `${num} `;
  }

  str += `${unit}`;

  //  if(plural){
  // 	 str += 's';
  //  }

  str += " ago";

  //var result = {time : str};
  return str;
};
