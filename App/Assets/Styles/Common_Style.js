import React, { StyleSheet, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import DeviceInfo from "react-native-device-info";
import {
  Common_Color,
  TitleHeader,
  Username,
  profilename,
  Description,
  Viewmore,
  UnameStory,
  Timestamp,
  Searchresult,
} from "../Colors";

export default StyleSheet.create({
  // Splash Screen
  Splash_View: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  splashText: {
    color: "#ff2603",
    textAlign: "center",
    fontSize: 60,
    marginTop: "45%",
  },
  splashProductText: {
    fontSize: 16,
    position: "absolute",
    color: "#aeaeae",
    position: "absolute",
    bottom: 45,
    margin: 10,
  },
  splashProductText1: {
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    color: "#000",
    position: "absolute",
    bottom: 20,
    margin: 10,
  },

  // Common-Spinner
  Spinner_View_style: { justifyContent: "center", alignItems: "center" },

  //TextInput New
  textInputNew: {
    backgroundColor: "#fff",
    width: "84%",
    height: 45,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
    fontSize: profilename.FontSize,
    fontFamily: profilename.Font,
  },
  textInputNewDesc: {
    backgroundColor: "#fff",
    width: "84%",
    height: 65,
    alignSelf: "center",
    fontWeight: "normal",
    marginTop: 8,
    marginBottom: 8,
  },
  // textInputSignUp: { backgroundColor: '#fff', width: '84%', height: 37, alignSelf: 'center', marginTop: 8, marginBottom: 6, borderRadius: 10, fontFamily: Common_Color.fontMedium },

  textInputSignUp: {
    backgroundColor: "#fff",
    width: "84%",
    height: 37,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 6,
    borderRadius: 10,
    fontSize: profilename.FontSize,
    //fontFamily: profilename.Font
  },

  textInputNew1: {
    backgroundColor: "#fff",
    width: "100%",
    height: 45,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
    fontSize: profilename.FontSize,
    fontFamily: profilename.Font,
  },

  //Header
  headerImg: { width: 24, height: 28 },

  // BigUserImage
  avatarProfile: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    backgroundColor: "grey",
    marginTop: 4,
    marginLeft: 4,
  },
  mediumAvatar: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: "grey",
    marginTop: 8,
    marginLeft: 4,
  },
  //TIckImage
  tickImage: {
    width: 18,
    height: 18,
    alignSelf: "flex-end",
    position: "absolute",
    right: 1,
    borderRadius: 18 / 2,
    borderColor: "#fff",
    borderWidth: 1,
  },
  tickImagesmall: {
    width: 10,
    height: 10,
    alignSelf: "flex-end",
    position: "absolute",
    right: 1,
    borderRadius: 10 / 2,
    borderColor: "#fff",
    borderWidth: 1,
  },

  //location Shadow View
  locationShadowView: {
    flex: 1,
    maxWidth: "46%",
    marginLeft: "2.8%",
    marginBottom: "2.5%",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  ShadowViewImage: {
    width: wp(46),
    height: hp(38),
    borderRadius: 18,
    backgroundColor: "#c1c1c1",
    overflow: "hidden",
  },
  overlayImage: {
    width: wp(46),
    height: hp(38),
    borderRadius: 18,
    backgroundColor: "#c1c1c1",
    overflow: "hidden",
  },

  //Username
  textView: { width: wp("52%"), marginLeft: "2%" },
  name1: {
    color: "#000",
    fontSize: Username.FontSize,
    fontFamily: Username.Font,
  },
  name2: {
    marginBottom: "auto",
    fontSize: Username.FontSize,
    color: "#cccccc",
    fontFamily: Username.Font,
    marginTop: 5,
  },

  //NewImage
  requestImage: { width: "17%", height: hp("9%") },
  newUerView: {
    width: wp("100%"),
    height: hp(10),
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  likeView: {
    width: wp("100%"),
    height: hp(10),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
  },
  //CommonSearch
  searchView: {
    alignItems: "center",
    marginTop: hp("2.5%"),
    marginBottom: hp("0%"),
  },
  searchTextInput: {
    borderWidth: 1,
    width: "96%",
    borderColor: "#e1e1e1",
    height: 40,
    borderRadius: 10,
    paddingLeft: "8%",
    backgroundColor: "#ebebeb",
  },
  searchBar: {
    backgroundColor: "#ebebeb",
    width: wp("95%"),
    height: hp("6%"),
    alignSelf: "center",
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#e1e1e1",
    borderRadius: 10,
  },

  //Lp5
  LpText: {
    fontSize: Username.FontSize,
    fontFamily: Common_Color.fontRegular,
    color: "black",
  },

  //Empty Button

  emptyButtonView: {
    borderWidth: 1.5,
    width: wp("27%"),
    borderRadius: 5,
    height: hp("5%"),
    borderColor: "#e7e3e2",
    marginTop: 13,
  },
  emptyButtonViewBorder: {
    borderWidth: 0.7,
    justifyContent: "center",
    width: wp("27%"),
    borderRadius: 18,
    height: hp("5%"),
    borderColor: "#000",
    marginTop: 13,
  },
  //responsive width and height
  responsive_width: { width: wp("100%") },
  responsive_height: { height: hp("100%") },

  // Background Styles
  common_baground: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },

  //Terms
  termsText: {
    fontSize: Timestamp.FontSize,
    color: "#3c3c3c",
    fontFamily: Timestamp.Font,
  },
  termsText1: {
    fontSize: Timestamp.FontSize,
    color: "#0c85c7",
    fontFamily: Timestamp.Font,
  },
  // Textinput
  common_txt_input: {
    backgroundColor: Common_Color.common_white,
    borderColor: Common_Color.common_bodercolor,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    height: 40,
    width: 300,
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
    marginTop: 10,
  },
  common_txt_input_width: { width: 270, color: Common_Color.txt_bold_gray },
  marginTop: { marginTop: 10 },
  common_text_In_style: {
    fontSize: Common_Color.baseFontSize,
    padding: 10,
    color: Common_Color.txt_bold_gray,
    width: 300,
  },
  hide_eye_Image: { height: 18, width: 22, marginTop: 3 },
  show_eye_Image: { height: 15, width: 22, marginTop: 3 },

  // Textinput Error
  common_text_input_error: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderColor: Common_Color.common_red,
    backgroundColor: Common_Color.common_white,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    height: 40,
    width: 300,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // been View
  been_View: { height: "33%", alignItems: "center" },
  txt_style: {
    fontSize: 54,
    color: Common_Color.common_white,
    marginTop: "5%",
  },
  errorInput1: {
    margin: 5,
    height: hp("15%"),
    width: wp("80%"),
    padding: 10,
    //fontFamily: "ProximaNova-Regular ",
    justifyContent: "center",
    borderColor: "red",
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: "#FAFAFA",
    height: 50,
    marginVertical: 7,
    borderRadius: 2,
  },
  input1: {
    margin: 5,
    height: hp("15%"),
    width: wp("80%"),
    padding: 10,
    //fontFamily: "ProximaNova-Regular ",
    justifyContent: "center",
    borderColor: "grey",
    borderWidth: 0.2,
    overflow: "hidden",
    backgroundColor: "#FAFAFA",
    height: 50,
    marginVertical: 7,
    borderRadius: 2,
  },
  // Common Button

  Common_button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 40,
    width: wp("96%"),
    marginTop: 10,
  },
  Common_btn_txt: {
    color: Common_Color.common_white,
    textAlign: "center",
    fontSize: Username.FontSize,
    fontFamily: Username.Font,
  },

  // sign Up
  Signup_View: { alignSelf: "flex-start", marginLeft: "18%" },
  sign_up: {
    color: "#000",
    marginTop: "8%",
    fontFamily: Searchresult.Font,
    fontSize: Searchresult.FontSize,
  },

  // Register_Page Style
  member_login: { flexDirection: "row", marginBottom: 10, marginTop: 5 },
  login_txt: {
    color: "#0c85c7",
    marginLeft: 5,
    fontFamily: Common_Color.fontMedium,
    fontSize: Common_Color.smallFontSize,
  },
  member_txt: {
    fontSize: Common_Color.smallFontSize,
    color: Common_Color.txt_bold_gray,
    fontFamily: Common_Color.fontMedium,
  },

  // Login Page
  forgot_view: { alignSelf: "flex-end", marginRight: "12%", marginTop: "2%" },
  forgot_txt: { fontSize: Common_Color.smallFontSize, color: "#0c85c7" },
  login_btn_View: { marginTop: "10%" },
  //85aae1
  // login_button: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: 40, width: 260 },
  // login_btn_txt: { color: Common_Color.common_white, fontSize: Common_Color.mediumFontSize },
  account_signup_View: { flex: 1, flexDirection: "row", marginTop: 5 },
  signup_txt: {
    color: Common_Color.btn_pink,
    fontSize: Common_Color.smallFontSize,
    marginLeft: 5,
  },
  account_txt: {
    fontSize: Common_Color.smallFontSize,
    color: Common_Color.txt_bold_gray,
  },

  // OTP Page
  Otp_View: { alignSelf: "flex-start", marginLeft: "18%" },
  Otp_txt: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
    marginTop: "10%",
  },
  Otp_msg_View: { marginTop: "5%" },
  otpDummyText: {
    color: Common_Color.txt_bold_gray,
    fontFamily: Common_Color.fontMedium,
    fontSize: Username.FontSize,
    textAlign: "center",
  },
  Otp_msg_txt: { textAlign: "center", fontSize: Common_Color.baseFontSize },
  signUp_btn_View: { marginTop: "5%" },
  member_login_otp: { flexDirection: "row", marginTop: 10 },
  login_txt_otp: {
    color: Common_Color.btn_blue,
    fontSize: Common_Color.smallFontSize,
    marginLeft: 5,
  },
  member_txt_otp: {
    fontSize: Common_Color.smallFontSize,
    color: Common_Color.txt_bold_gray,
  },
  resend_btn_View: { marginTop: "10%", flexDirection: "row" },
  resend_Img: { height: 20, width: 20 },
  OTPInput_style: {
    borderBottomWidth: 2,
    borderBottomColor: Common_Color.btn_pink,
    color: Common_Color.btn_pink,
  },
  resend_otp_button: {
    borderColor: Common_Color.common_bodercolor,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 40,
    width: 260,
  },
  resend_otp_btn_txt: {
    color: Common_Color.txt_gray,
    fontSize: Common_Color.mediumFontSize,
    marginLeft: 5,
    fontFamily: Common_Color.fontBold,
  },

  // Forgot Password Page
  submit_btn_View: { marginTop: "14%" },
  //submit_button: { backgroundColor: Common_Color.btn_blue, borderColor: Common_Color.btn_blue, borderWidth: 1, borderRadius: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: 40, width: 120 },
  // submit_btn_txt: { color: Common_Color.common_white, fontSize: Common_Color.mediumFontSize },

  // Reset Password Page
  Reset_Pwd_View: {
    alignSelf: "flex-start",
    marginLeft: "18%",
    marginBottom: "5%",
    marginTop: "25%",
  },
  Reset_Pwd_txt: { fontSize: 20, color: Common_Color.txt_bold_gray },

  //Common Header
  headerText: {
    fontSize: TitleHeader.FontSize,
    fontFamily: TitleHeader.Font,
    textAlign: "center",
    paddingLeft: 8,
    color: "rgb(51, 51, 51)",
    paddingTop: DeviceInfo.hasNotch() ? 30 : Platform.OS === "ios" ? 10 : 0,
  },
  headerTextNew: {
    fontSize: TitleHeader.FontSize,
    textAlign: "left",
    fontFamily: TitleHeader.Font,
  },
  //HitSlop for Touchable
  touchView: { top: 10, bottom: 10, left: 10, right: 10 },
  //Card View LParticular Location
  locationText: {
    color: "#fff",
    marginLeft: "4%",
    backgroundColor: "rgba(0,0,0,0)",
    fontFamily: TitleHeader.Font,
    fontSize: TitleHeader.FontSize,
  },

  noDataText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    fontFamily: Common_Color.fontLight,
  },
  likeCount: {
    fontSize: Username.FontSize,
    color: "#fff",
    //fontFamily: Username.Font
  },
  likeImage: { width: wp(7), height: hp(4.5), marginBottom: 5 },
  //CardView
  ShadowCurveView: {
    width: wp(45),
    height: hp(25),
    backgroundColor: "#fff",
    borderWidth: 0.6,
    borderColor: "#c1c1c1",
    borderRadius: 17,
  },
  cardViewLocationText: {
    fontSize: TitleHeader.FontSize,
    textAlign: "center",
    fontFamily: TitleHeader.Font,
  },
  descriptionText: {
    textAlign: "left",
    width: "100%",
    fontSize: Description.FontSize,
    fontFamily: Description.Font,
    marginBottom: 5,
  },
  hashtagColor: { color: "#0c85c7" },
  userName: {
    width: "80%",
    marginLeft: "5%",
    marginTop: 5,
    // fontFamily: Username.Font,
    fontSize: Username.FontSize,
  },
  viewMoreText: {
    color: "#6f94c9",
    fontSize: Viewmore.FontSize,
    fontFamily: Viewmore.Font,
    marginTop: "3%",
    marginBottom: "3%",
    marginLeft: "74%",
  },
  //Settings Text Bold
  modalTextSwitchAccount: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 12,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    color: "#010101",
    lineHeight: 20,
    fontFamily: Common_Color.fontMedium,
  },
  settingsHeader: {
    flexDirection: "row",
    width: wp("100%"),
    height: 50,
    marginTop: 5,
  },
  settingBoldText: {
    marginTop: 8,
    fontSize: Username.FontSize,
    fontFamily: Username.Font,
  },
  settingsSemiBold: {
    fontSize: profilename.FontSize,
    fontFamily: profilename.Font,
  },
  settingsMediumText: {
    color: "#010101",
    fontWeight: "normal",
    fontSize: 12,
    marginTop: hp("3%"),
    marginLeft: wp("3%"),
    fontFamily: Common_Color.fontLight,
  },
  //Modal
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    borderColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#010101",
    fontFamily: Common_Color.fontMedium,
    marginBottom: 5,
    marginTop: 5,
  },
  parentView: { width: "100%", borderRadius: 15, backgroundColor: "white" },
  icon: {
    width: wp(8),
    height: hp(4.5),
    marginLeft: "45%",
    marginBottom: "5%",
    marginTop: "5%",
  },
  header: {
    fontSize: Common_Color.userNameFontSize,
    fontFamily: Common_Color.fontMedium,
    marginTop: 10,
    textAlign: "center",
    alignSelf: "center",
    textAlign: "center",
    color: "#000",
  },
  subHeader: {
    marginTop: 15,
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center",
    fontWeight: "normal",
    color: "#959595",
  },
  contentView: { width: "95%", textAlign: "center" },
  content: {
    marginTop: 10,
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center",
    color: "#9e9e9e",
  },
  inputView: {
    borderColor: "#a5a5a5",
    borderWidth: 1,
    width: "85%",
    padding: 5,
    height: "35%",
    marginLeft: 25,
    color: "grey",
    marginTop: 25,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonView: {
    height: 37,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 10,
    justifyContent: "space-evenly",
    margin: 10,
    marginLeft: 20,
  },

  headerText: {
    textAlign: "center",
    marginTop: hp("2%"),
    fontSize: TitleHeader.FontSize,
    fontFamily: TitleHeader.Font,
  },
  subView: { width: wp("27%"), marginLeft: wp("2%") },
  subViewText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: TitleHeader.Font,
  },
  countsAnalytic: {
    textAlign: "center",
    fontSize: 12,
    marginTop: hp("2%"),
    fontFamily: Common_Color.fontMedium,
  },
  counts: {
    textAlign: "center",
    color: "#868686",
    fontSize: 15,
    marginTop: hp("2%"),
  },
  countFont: {
    fontSize: Viewmore.FontSize,
    // fontFamily: Viewmore.Font,
    margin: 4,
  },

  // success msg  View
  headerInModalTwo: {
    fontSize: Common_Color.userNameFontSize,
    fontFamily: Common_Color.fontMedium,
    marginTop: 25,
    textAlign: "center",
    alignSelf: "center",
    textAlign: "center",
    color: "#000",
  },
  contentViewInModalTwo: { width: "95%", textAlign: "center" },
  contentTextInModalTwo: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center",
    color: "#9e9e9e",
  },
  okayButton: {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 40,
    justifyContent: "space-evenly",
    margin: 10,
    marginLeft: 20,
    fontWeight: "bold",
  },
  okayButtonText: {
    color: "#d12c5e",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 25,
    fontWeight: "bold",
  },

  //Star Image
  star: { height: 30, width: 30, marginTop: 15, marginLeft: 5 },
  starUser: { height: 35, width: 35, margin: 10 },
  //Story Username
  title: {
    fontSize: UnameStory.FontSize,
    fontFamily: UnameStory.Font,
    textAlign: "left",
    color: "#fff",
    fontWeight: "400",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    marginTop: 3,
    fontFamily: Common_Color.fontBold,
  },

  //Report Common Modal
  parentViewReport: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: "white",
  },
  iconReport: {
    width: 27,
    height: 27.2,
    marginLeft: "45%",
    marginBottom: "2%",
    marginTop: "5%",
  },
  headerReport: {
    fontSize: Username.FontSize,
    fontFamily: Username.Font,
    marginTop: 10,
    textAlign: "center",
    alignSelf: "center",
  },
  subHeaderReport: {
    marginTop: 15,
    textAlign: "center",
    alignSelf: "center",
    fontSize: Username.FontSize,
    fontFamily: Username.Font,
  },
  contentViewReport: {
    marginTop: 10,
    width: "95%",
    fontFamily: Common_Color.fontMedium,
    color: "#010101",
  },
  contentReport: {
    marginTop: 10,
    fontSize: Username.FontSize,
    fontFamily: Timestamp.Font,
    textAlign: "center",
    alignSelf: "center",
    color: "#010101",
  },
  TstyleReport: {
    marginTop: 10,
    backgroundColor: "#fff",
    width: "95%",
    marginLeft: 8,
    fontSize: profilename.FontSize,
    fontFamily: profilename.Font,
  },
  PstyleReport: {
    fontFamily: profilename.Font,
    fontSize: profilename.FontSize,
  },
  buttonViewReport: {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 10,
    justifyContent: "space-evenly",
    margin: 10,
    marginLeft: 20,
    height: 70,
  },
  ButtonReport: {
    marginVertical: 20,
    marginRight: "4%",
    height: hp("5%"),
    width: wp("86%"),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ButtonTextReport: {
    color: "white",
    textAlign: "center",
    fontSize: Username.FontSize,
    fontFamily: Username.Font,
  },
  ButtonCancel: {
    marginRight: "4%",
    width: wp("86%"),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  CancelButtonTextReport: {
    textAlign: "center",
    fontSize: Username.FontSize,
    fontFamily: Username.Font,
  },

  //Thanks Report Modal
  TparentView: { width: "100%", borderRadius: 15, backgroundColor: "white" },
  TheaderInModalTwo: {
    fontSize: Username.FontSize,
    fontFamily: Username.Font,
    marginTop: 20,
    textAlign: "center",
    alignSelf: "center",
  },
  TcontentViewInModalTwo: { width: "95%", textAlign: "center", marginTop: 20 },
  TcontentTextInModalTwo: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: Username.FontSize,
    fontFamily: Timestamp.Font,
    color: "#010101",
  },
  TcontentViewInModalTwo1: { width: "95%", textAlign: "center", marginTop: 20 },
  TcontentTextInModalTwo1: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: Timestamp.FontSize,
    fontFamily: Timestamp.Font,
  },
  TokayButton: {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 20,
    justifyContent: "space-evenly",
    margin: 10,
    marginLeft: 20,
    marginBottom: 20,
  },
  TokayButtonText: {
    color: "#d12c5e",
    textAlign: "center",
    justifyContent: "center",
    fontSize: Username.FontSize,
    fontFamily: Username.Font,
  },

  //Notification Accept/Rej

  NotifyParentView: { flexDirection: "row", width: "100%", marginLeft: "-3%" },
  AcceptView: {
    width: wp("15%"),
    height: hp("4%"),
    borderRadius: 5,
    marginRight: wp("100%"),
    position: "absolute",
  },
  CancelView: {
    width: wp("15%"),
    height: hp("4%"),
    borderWidth: 0.5,
    borderRadius: 5,
    marginLeft: wp("17%"),
    borderColor: "#4f4f4f",
  },
  AcceptText: {
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
    color: "#fff",
    fontFamily: Common_Color.fontBold,
  },
  CancelText: {
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
    fontFamily: Common_Color.fontBold,
  },

  //ListView
  parentViewList: { flex: 1, marginBottom: 10 },
  ImgView: { flexDirection: "row", width: "65%", marginTop: 8 },
  nameParentView: { width: "100%", height: 45, marginLeft: 4 },
  nameView: { marginLeft: "2%", width: "100%", marginTop: "6%" },
  StatusView: { alignItems: "flex-end", paddingEnd: "10%" },
  AcceptFollow: {
    backgroundColor: "#fb0042",
    borderRadius: 5,
    paddingLeft: 23.5,
    paddingRight: 23.5,
    paddingTop: 3,
    paddingBottom: 3,
  },
  PendingStatus: {
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderColor: "#4f4f4f",
  },
  FollowingStatus: {
    borderWidth: 0.5,
    borderRadius: 5,
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 3,
    paddingBottom: 3,
    borderColor: "#4f4f4f",
  },
  NewFollow: {
    backgroundColor: "#fb0042",
    borderRadius: 5,
    paddingLeft: 23.5,
    paddingRight: 23.5,
    paddingTop: 3,
    paddingBottom: 3,
  },
  nameText1: {
    marginBottom: "auto",
    color: "#000",
    // fontFamily: Username.Font,
    fontSize: Username.FontSize,
    marginTop: "1%",
  },
  nameText2: {
    marginBottom: "auto",
    color: "#b3afaf",
    // fontFamily: profilename.Font,
    fontSize: profilename.FontSize,
  },
  TextHeader: { marginTop: hp("2%") },
  Search: {
    alignItems: "center",
    marginTop: hp("2.5%"),
    marginBottom: hp("2%"),
  },

  UserNameCommon: {
    color: "#000",
    //fontFamily: Username.Font,
    fontSize: Username.FontSize,
    marginTop: 2,
    marginBottom: 3,
  },
  SurNameCommon: {
    color: "#b3afaf",
    //fontFamily: profilename.Font,
    fontSize: profilename.FontSize,
  },
  //TagPeople
  nameTag: {
    marginTop: 20,
    fontSize: Username.FontSize,
    marginLeft: 5,
    color: "#010101",
    //fontFamily: Common_Color.fontRegular,
  },
});
