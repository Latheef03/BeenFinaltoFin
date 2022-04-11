import * as React from 'react';
import {Root} from 'native-base'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//Login
import Splash from '../App/Component/Login/Splash';
import Register from '../App/Component/Login/Register'
import Login from '../App/Component/Login/Login';
import Otp from '../App/Component/Login/OTP'
import Forgot_Password from '../App/Component/Login/Forgot_Password'
import Reset_Password from '../App/Component/Login/Reset_Password'
//Login ENds
//User Profile 
import Profile from '../App/Component/UserProfile/Profile';
import FollowTab from '../App/Component/UserProfile/FollowerTab'
import FootPrints from '../App/Component/UserProfile/FootPrints'
import Badges from '../App/Component/UserProfile/Badges';
//UserProfile Ends

//Footer
import Visits from '../App/Component/Footer/Visits'
import VlogGet from '../App/Component/Footer/VlogGet'
import AddVisits from '../App/Component/Footer/AddVisits'
import AddAlbum from '../App/Component/Footer/AddAlbum';
import AddSubAlbum from '../App/Component/Footer/AddSubAlbum';
import SubAlbumView from '../App/Component/Footer/SubAlbumView'
import UserProfileAlbums from '../App/Component/Footer/UserProfileAlbums'
import UserProfileMemories from '../App/Component/Footer/UserProfileMemories';
// End Footer


import MyPager from '../App/Component/Home/_ViewPager'
import searchExplore from "../App/Component/Explore/Search";

import { ChatUserList, OneToOneChat } from "../App/Component/Chats/";

/**@import Gallery Picker */
import { GalleryPicker,NFPicker } from '../App/Component/commoncomponent';
//**End of Gallery Picker */

/** Story */
import Camera from "../App/Component/Story/Camera";
import Camera1 from "../App/Component/Story/Camera1";
import ImageEditor from "../App/Component/Story/ImageEditor";
import Story from "../App/Component/Story/Story";
import StoryRead from "../App/Component/Story/StoryRead";
/** Story Ends */

/** NewsFeeds */
import Newsfeed from "../App/Component/NewsFeed/Newsfeed";
import NewsfeedUpload from "../App/Component/NewsFeed/NewsfeedUpload";
import Vlog from "../App/Component/NewsFeed/Vlog";
import ImageEditSlider from "../App/Component/NewsFeed/ImageEditSlider";
/** NewsFeeds Ends */

//Bussiness
import ProfileAnalytics from '../App/Component/BusinessProfile/ProfileAnalytics';
import Promote from '../App/Component/BusinessProfile/Promote'
import PromoteParticular from '../App/Component/BusinessProfile/PromoteParticular'
import PromoteMemories from '../App/Component/BusinessProfile/PromoteMemoies'
//Business Profile Ends

// Bussiness place
import BusinessPlaceHomeOther from '../App/Component/BusinessPlace/BusinessPlaceHomeOther'
import BusinessPlaceProfile from '../App/Component/BusinessPlace/BusinessPlaceProfile'
import GplacesBPlaceProfile from '../App/Component/BusinessPlace/GplacesBPlaceProfile';
import PlaceStories from '../App/Component/BusinessPlace/PlaceStories'
import BusinessPlaceMemories from '../App/Component/BusinessPlace/BusinessPlaceMemories'
import GetLocation from '../App/Component/BusinessPlace/GetLocation'
import TaggedPostOtherUser from '../App/Component/BusinessPlace/TaggedPostOtherUser';
//End Business place

//OthersProfile
import BusinessPlacProfileOthers from '../App/Component/OtherUserDashboards/BusinessPlacProfileOthers'
import OtherUserProfile from '../App/Component/OtherUserDashboards/OtherUserProfile'
import OtherTagged from '../App/Component/OtherUserDashboards/OtherTagged'
import OtherFollowers from '../App/Component/OtherUserDashboards/OtherFollowers'
import OtherFootPrints from '../App/Component/OtherUserDashboards/OtherFootPrints'
import OtherVisits from '../App/Component/OtherUserDashboards/OtherVisits'
import OtherBadges from '../App/Component/OtherUserDashboards/OtherBadges'
import OtherMemories from '../App/Component/OtherUserDashboards/OtherMemories'
import OtherAlbums from '../App/Component/OtherUserDashboards/OtherAlbums'
import OtherAddSubAlbum from '../App/Component/OtherUserDashboards/OtherAddSubAlbum'
import OtherSubAlbumView from '../App/Component/OtherUserDashboards/OtherSubAlbumView'
import OtherVlog from '../App/Component/OtherUserDashboards/OtherVlog'
//other profile ends


//Notification
import Notifications from '../App/Component/Notifications/Notifications';
import Notifications1 from "../App/Component/Notifications/Notifications1";
import NotificationPage from '../App/Component/Notifications/NotificationPage'
//Notification Ends

// Custom Component Screen
import GLListView from '../App/Component/CustomComponent/GLListView'
import CommentsLikes from '../App/Component/CustomComponent/CommentsLikes'
import GetPlaceHashTags from '../App/Component/CustomComponent/GetPlaceHashTags'
import Edit_Profile from "../App/Component/CustomComponent/Edit_Profile";
import PlaceReview from '../App/Component/CustomComponent/PlaceReview'
import EditPost from '../App/Component/CustomComponent/EditPost'
import TaggedPost from '../App/Component/CustomComponent/TaggedPost';
import AddTag from '../App/Component/CustomComponent/AddTag';
import GetTagData from '../App/Component/CustomComponent/GetTagData'
import GetTagOtherData from '../App/Component/CustomComponent/GetTagOtherData'
import ExploreStories from "../App/Component/CustomComponent/ExploreStories";
import Gplaces from '../App/Component/CustomComponent/googlePlaces'
import GetData from '../App/Component/CustomComponent/GetData'
import GetDataExplore from "../App/Component/CustomComponent/GetDataExplore";
import comments from '../App/Component/CustomComponent/comments';
import LikesView from '../App/Component/CustomComponent/LikesView'
import MultiImageView  from '../App/Component/CustomComponent/MultiImageview'
import GetStories  from '../App/Component/CustomComponent/GetStories'
// Custom Component Screen

//setting screen
import SettingsScreen from '../App/Component/Settings/SettingsScreen';
import SavedPlaces from '../App/Component/Settings/SavedPlaces';
import SavedFolderPlace from '../App/Component/Settings/SavedFolderPlace'
import savedPlaceList from '../App/Component/Settings/savedPlaceList'
import savedfolder from '../App/Component/Settings/savedfolder'
import savedpostlist from '../App/Component/Settings/savedpostlist'
import allplaces from '../App/Component/Settings/allplaces'
import savedpost from '../App/Component/Settings/savedpost';
import Allposts from '../App/Component/Settings/AllPosts';
import NotificationSetting from '../App/Component/Settings/NotificationSetting';
import Account from '../App/Component/Settings/Account';
import password from '../App/Component/Settings/password';
import TwoFactorAuth from '../App/Component/Settings/TwoFactorAuth'
import MutedAccount from '../App/Component/Settings/MutedAccount'
import SavedLoginInfo from '../App/Component/Settings/SavedLoginInfo'
import Privachy from '../App/Component/Settings/privacy'
import PrivateAccount from '../App/Component/Settings/PrivateAccount'
import BlockedAccount from '../App/Component/Settings/BlockedAccount'
import PostsYouHaveLiked from '../App/Component/Settings/PostsYouHaveLiked'
import PostsLikedAllPost from '../App/Component/Settings/PostsLikedAllPost'
import History from '../App/Component/Settings/History'
import ReportaProblem from '../App/Component/Settings/ReportaProblem'
import commentControl from '../App/Component/Settings/commentControl'
import Settings_Account_Verify from '../App/Component/Settings/Settings_Account_Verify'
import RequestVerification from '../App/Component/Settings/RequestVerification'
import Help from '../App/Component/Settings/Help'
import HelpCenter from '../App/Component/Settings/HelpCenter'
import DataPolicy from '../App/Component/Settings/DataPolicy'
import About from '../App/Component/Settings/About'
import Logout from '../App/Component/Settings/Logout';
import Terms from '../App/Component/Settings/Terms'
import AddAccLogin from '../App/Component/Settings/AddAccLogin'
import SwitchProfile from '../App/Component/Settings/SwitchProfile'
//End Settings

//LOCAL PROFILE
import LocalUserProfile from '../App/Component/LocalProfile/LocalUserProfile'
import User_profile from '../App/Component/Planner/User_profile'
import LocalProfileChat from '../App/Component/LocalProfile/LocalProfileChat'
import LocalProfileFullView from '../App/Component/LocalProfile/LocalProfileFullView'
import LocalProfileCreate from '../App/Component/LocalProfile/LocalProfileCreate'
import LocalProfileSave from '../App/Component/LocalProfile/LocalProfileSave'
import LocalProfile5 from '../App/Component/LocalProfile/LocalProfile5'
import LocalProfileSearchList from '../App/Component/LocalProfile/LocalProfileSearchList'
import PlacesAdd from '../App/Component/LocalProfile/PlacesAdd'
import SpotAddGroup from '../App/Component/LocalProfile/SpotAddGroup'
import SpotAdd from '../App/Component/LocalProfile/SpotsAdd'
import AddHangoutSpots from '../App/Component/LocalProfile/AddHangoutSpots'
import LocalOtherProfile from '../App/Component/LocalProfile/LocalOtherProfile'
import LocalProfReview from '../App/Component/LocalProfile/LocalProfReview'
import LpSearchList from '../App/Component/LocalProfile/LpSearchList'
//End Local PRofile

//planner
import Planner from '../App/Component/Planner/Planner'
import Search1 from '../App/Component/Planner/Search1'
import Ongoing from '../App/Component/Planner/Ongoing'
import Requests_List from '../App/Component/Planner/Requests_List'
import Create_group from '../App/Component/Planner/Create_group'
import Edit from '../App/Component/Planner/Edit'
import Open from '../App/Component/Planner/Open'
import NonMemOpen from '../App/Component/Planner/NonMemOpen'
import ReqPeople from '../App/Component/Planner/ReqPeople'
import SendReqPeople from '../App/Component/Planner/SendReqPeople'
import GetSeachPlanner from '../App/Component/Planner/GetSeachPlanner'
import RequestListAction from '../App/Component/Planner/RequestListAction'
import PeopleGoing from '../App/Component/Planner/PeopleGoing'
import PlannerMedia from '../App/Component/Planner/media';
import PlannerSearchList from '../App/Component/Planner/PlannerSearchList';
//End Planner


const Stack = createStackNavigator();

function Navigation() {
  return (
    <Root>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="NewsfeedUpload" component={NewsfeedUpload} /> 
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} /> 
        <Stack.Screen name="Register" component={Register} /> 
        <Stack.Screen name="OTP" component={Otp} /> 
        <Stack.Screen name="Forgot_Password" component={Forgot_Password} /> 
        <Stack.Screen name="Reset_Password" component={Reset_Password} /> 
        <Stack.Screen name="MyPager" component={MyPager} /> 

        {/*Profile Screen  Starts */}
        <Stack.Screen name="Profile" component={Profile} /> 
        <Stack.Screen name="Badges" component={Badges} /> 
        <Stack.Screen name="FollowTab" component={FollowTab} /> 
        <Stack.Screen name="FootPrints" component={FootPrints} /> 
        {/*Profile Screen  Starts */}
       {/*Footer Screen  Starts */}
        <Stack.Screen name="Visits" component={Visits} /> 
        <Stack.Screen name="AddVisits" component={AddVisits} /> 
        <Stack.Screen name="UserProfileAlbums" component={UserProfileAlbums} /> 
        <Stack.Screen name="UserProfileMemories" component={UserProfileMemories} /> 
        <Stack.Screen name="VlogGet" component={VlogGet} /> 
        <Stack.Screen name="AddAlbum" component={AddAlbum} /> 
        <Stack.Screen name="AddSubAlbum" component={AddSubAlbum} /> 
        <Stack.Screen name="SubAlbumView" component={SubAlbumView} />  
        {/*Footer Screen  Ends */}
        {/* Business Profile */}
        <Stack.Screen name="Promote" component={Promote} /> 
        <Stack.Screen name="ProfileAnalytics" component={ProfileAnalytics} /> 
        <Stack.Screen name="PromoteParticular" component={PromoteParticular} /> 
        <Stack.Screen name="PromoteMemories" component={PromoteMemories} /> 
        {/* End Business Profile */}
       {/* Business Place */}
        <Stack.Screen name="BusinessPlaceHomeOther" component={BusinessPlaceHomeOther} /> 
        <Stack.Screen name="BusinessPlaceProfile" component={BusinessPlaceProfile} /> 
        <Stack.Screen name="BusinessPlacProfileOthers" component={BusinessPlacProfileOthers} /> 
        <Stack.Screen name="GplacesBPlaceProfile" component={GplacesBPlaceProfile} /> 
        <Stack.Screen name="BusinessPlaceMemories" component={BusinessPlaceMemories} /> 
        <Stack.Screen name="GetLocation" component={GetLocation} /> 
        <Stack.Screen name="PlaceStories" component={PlaceStories} /> 
        <Stack.Screen name="TaggedPostOtherUser" component={TaggedPostOtherUser} /> 
      {/* End Business Place */}

         {/* chats */}
        <Stack.Screen name="ChatUserList" component={ChatUserList} /> 
        <Stack.Screen name="OneToOneChat" component={OneToOneChat} /> 
        {/* chats  Ends*/}
        <Stack.Screen name="searchExplore" component={searchExplore} /> 
        <Stack.Screen name="ExploreStories" component={ExploreStories} /> 
       
        <Stack.Screen name="MultiImageView" component={MultiImageView} /> 
        <Stack.Screen name="GetData" component={GetData} /> 
        <Stack.Screen name="GetDataExplore" component={GetDataExplore} /> 
        <Stack.Screen name="GetStories" component={GetStories} /> 
        <Stack.Screen name="comments" component={comments} />
        <Stack.Screen name="LikesView" component={LikesView} /> 
        <Stack.Screen name="Gplaces" component={Gplaces} />
        <Stack.Screen name="GLListView" component={GLListView} />
        <Stack.Screen name="CommentsLikes" component={CommentsLikes} />
        <Stack.Screen name="GetPlaceHashTags" component={GetPlaceHashTags} />
        <Stack.Screen name="Edit_Profile" component={Edit_Profile} />
        <Stack.Screen name="PlaceReview" component={PlaceReview} />
        <Stack.Screen name="EditPost" component={EditPost} />
        <Stack.Screen name="TaggedPost" component={TaggedPost} />
        <Stack.Screen name="AddTag" component={AddTag} />
        <Stack.Screen name="GetTagData" component={GetTagData} />
        <Stack.Screen name="GetTagOtherData" component={GetTagOtherData} />

         {/* Story Screens  Starts*/}
        <Stack.Screen name="Camera" component={Camera} /> 
        <Stack.Screen name="Camera1" component={Camera1} /> 
        <Stack.Screen name="ImageEditor" component={ImageEditor} /> 
        <Stack.Screen name="Story" component={Story} /> 
        <Stack.Screen name="StoryRead" component={StoryRead} /> 
       {/* Story Screens  Ends*/}
       
       <Stack.Screen name="GalleryPicker" component={GalleryPicker} /> 
       <Stack.Screen name="NFPicker" component={NFPicker} />
       {/* NewsFeeds */ }
       <Stack.Screen name="ImageEditSlider" component={ImageEditSlider} /> 
       <Stack.Screen name="Newsfeed" component={Newsfeed} /> 
     
       <Stack.Screen name="Vlog" component={Vlog} /> 
       {/* NewsFeeds Ends */ }
  
      {/* Other Dashboard Page Start*/}
        <Stack.Screen name="OtherUserProfile" component={OtherUserProfile} /> 
        <Stack.Screen name="OtherTagged" component={OtherTagged} /> 
        <Stack.Screen name="OtherFollowers" component={OtherFollowers} /> 
        <Stack.Screen name="OtherFootPrints" component={OtherFootPrints} /> 
        <Stack.Screen name="OtherVisits" component={OtherVisits} /> 
        <Stack.Screen name="OtherBadges" component={OtherBadges} /> 
        <Stack.Screen name="OtherMemories" component={OtherMemories} /> 
        <Stack.Screen name="OtherAlbums" component={OtherAlbums} /> 
        <Stack.Screen name="OtherAddSubAlbum" component={OtherAddSubAlbum} /> 
        <Stack.Screen name="OtherSubAlbumView" component={OtherSubAlbumView} /> 
        <Stack.Screen name="OtherVlog" component={OtherVlog} /> 
         {/* Other Dashboard Page Start*/}
        {/* Notification Page Start*/}
        <Stack.Screen name="Notifications" component={Notifications} /> 
        <Stack.Screen name="Notifications1" component={Notifications1} /> 
        <Stack.Screen name="NotificationPage" component={NotificationPage} /> 
        {/* Notification Page End*/}
        {/* Local Profile Screens */}
        <Stack.Screen name="LocalUserProfile" component={LocalUserProfile} /> 
        <Stack.Screen name="User_profile" component={User_profile} /> 
        <Stack.Screen name="LocalProfileSearchList" component={LocalProfileSearchList} /> 
        <Stack.Screen name="LocalProfile5" component={LocalProfile5} /> 
        <Stack.Screen name="LocalProfileChat" component={LocalProfileChat} /> 
        <Stack.Screen name="LocalProfileFullView" component={LocalProfileFullView} /> 
        <Stack.Screen name="LocalProfileCreate" component={LocalProfileCreate} /> 
        <Stack.Screen name="LocalProfileSave" component={LocalProfileSave} /> 
        <Stack.Screen name="PlacesAdd" component={PlacesAdd} /> 
        <Stack.Screen name="SpotAddGroup" component={SpotAddGroup} /> 
        <Stack.Screen name="SpotAdd" component={SpotAdd} /> 
        <Stack.Screen name="AddHangoutSpots" component={AddHangoutSpots} /> 
        <Stack.Screen name="LocalOtherProfile" component={LocalOtherProfile} /> 
        <Stack.Screen name="LocalProfReview" component={LocalProfReview} /> 
        <Stack.Screen name="LpSearchList" component={LpSearchList} /> 
        {/* End of Local Profile Screens */}
        {/* Planner Screen Navigations */}
        <Stack.Screen name="Planner" component={Planner} /> 
        <Stack.Screen name="Ongoing" component={Ongoing} /> 
        <Stack.Screen name="Requests_List" component={Requests_List} /> 
        <Stack.Screen name="Search1" component={Search1} /> 
        <Stack.Screen name="Create_group" component={Create_group} /> 
        <Stack.Screen name="Edit" component={Edit} /> 
        <Stack.Screen name="Open" component={Open} /> 
        <Stack.Screen name="NonMemOpen" component={NonMemOpen} /> 
        <Stack.Screen name="ReqPeople" component={ReqPeople} /> 
        <Stack.Screen name="SendReqPeople" component={SendReqPeople} /> 
        <Stack.Screen name="GetSeachPlanner" component={GetSeachPlanner} /> 
        <Stack.Screen name="RequestListAction" component={RequestListAction} /> 
        <Stack.Screen name="PeopleGoing" component={PeopleGoing} /> 
        <Stack.Screen name="PlannerMedia" component={PlannerMedia} /> 
        <Stack.Screen name="PlannerSearchList" component={PlannerSearchList} />
        {/* End of Planner Screen Navigations */}
        

        {/* Settings  Screen Navigations */}
         <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="Privachy" component={Privachy} />
         <Stack.Screen name="savedpost" component={savedpost} /> 
        <Stack.Screen name="savedpostlist" component={savedpostlist} /> 
        <Stack.Screen name="Settings_Account_Verify" component={Settings_Account_Verify} /> 
        <Stack.Screen name="SavedPlaces" component={SavedPlaces} />
        <Stack.Screen name="SavedFolderPlace" component={SavedFolderPlace} /> 
        <Stack.Screen name="savedPlaceList" component={savedPlaceList} /> 
        <Stack.Screen name="savedfolder" component={savedfolder} /> 
        <Stack.Screen name="allplaces" component={allplaces} /> 
        <Stack.Screen name="Allposts" component={Allposts} /> 
        <Stack.Screen name="NotificationSetting" component={NotificationSetting} /> 
        <Stack.Screen name="Account" component={Account} /> 
        <Stack.Screen name="password" component={password} />
        <Stack.Screen name="SavedLoginInfo" component={SavedLoginInfo} /> 
        <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuth} /> 
        <Stack.Screen name="MutedAccount" component={MutedAccount} />
        <Stack.Screen name="ReportaProblem" component={ReportaProblem} /> 
        <Stack.Screen name="PrivateAccount" component={PrivateAccount} /> 
        <Stack.Screen name="BlockedAccount" component={BlockedAccount} />
        <Stack.Screen name="PostsYouHaveLiked" component={PostsYouHaveLiked} /> 
        <Stack.Screen name="PostsLikedAllPost" component={PostsLikedAllPost} /> 
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="About" component={About} /> 
        <Stack.Screen name="Help" component={Help} /> 
        <Stack.Screen name="SwitchProfile" component={SwitchProfile} /> 
        <Stack.Screen name="HelpCenter" component={HelpCenter} /> 
        <Stack.Screen name="commentControl" component={commentControl} /> 
        <Stack.Screen name="RequestVerification" component={RequestVerification} />  
         <Stack.Screen name="DataPolicy" component={DataPolicy} /> 
         <Stack.Screen name="AddAccLogin" component={AddAccLogin} /> 
        <Stack.Screen name="Terms" component={Terms} /> 
        <Stack.Screen name="Logout" component={Logout} /> 
        {/* End of Settings Screen Navigations */}
      </Stack.Navigator>
    </NavigationContainer>
    </Root>
  );
}

export default Navigation;
