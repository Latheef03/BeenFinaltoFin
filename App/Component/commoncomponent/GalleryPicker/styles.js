import {deviceWidth as dw , deviceHeight as dh} from '../../_utils/CommonUtils';

const styles = {
    maincontainer:{
        flex:1,
        backgroundColor : '#fff'
    },
    topView:{
        width:dw,
        height: dh * .1,
        backgroundColor:'#fff',
        flexDirection:'row',
        marginTop:'0%',
    },
    albumView:{
        width:dw * 0.5,
        height:'100%',
        // alignSelf:'flex-start',
        justifyContent:'center',
        // paddingLeft:20,
        // backgroundColor:'red'
        // flexDirection:'row'
    },
    albumViewForNF:{
        width:dw ,
        height:'100%',
        // alignItems:'center',
        justifyContent:'center',
        paddingLeft:0,
        flexDirection:'row',
        
    },
    multiSelectionView:{
        width:dw * 0.5,
        height:'100%',
        justifyContent:'center',
        alignItems:'flex-end',
        paddingRight:25, 
        // backgroundColor:'yellow'
    },
    boxBack:{
        width:20,
        height:20,
        borderWidth:1.5,
        //borderColor:'#181818',
        borderRadius:5
    },
    boxFront:{
        width:20,
        height:20,
        borderWidth:1.5,
        //borderColor:'#181818',
        borderRadius:5,
        bottom:5,
        right:5.5,
        position:'absolute',
    },
    imageView:{
        width: dw / 3,
        height: 150,
        backgroundColor:'grey',
        borderRightColor:'#fff',
        borderBottomWidth:1,
        borderBottomColor:'#fff',
        overflow:'hidden'
    },
    imageViewForNF:{
        width: dw * 1 / 3,
        height: 100,
        // borderRadius:8,
        backgroundColor:'grey',
        borderLeftWidth :10,
        borderLeftColor:'#fff',
        overflow:'hidden',
        marginBottom:6
    },
    selectCircle:{
        width: 18,
        height: 18, 
        borderRadius: 18 / 2, 
        // borderWidth: 0.5,
        // borderColor: '#181818', 
        justifyContent: 'center',
        right: 8, 
        top: 8, 
        position: 'absolute',
    },
    selectCircleForNF:{
        width: 15,
        height: 15, 
        borderRadius: 15 / 2, 
        borderWidth:0,
        // borderColor: '#181818', 
        justifyContent: 'center',
        right: 8, 
        top: 8, 
        position: 'absolute',
    },
    tick:{
        alignSelf:'center',
        width:10,
        height:10,
        position:'relative'
    },
    bottomView:{
        bottom:0,
        right:0,
        position:'absolute',
    //  backgroundColor:'plum',
        justifyContent:'center',
        width:dw * 0.27,
        height:dh * .08
    },
    buttonView:{
        alignSelf:'flex-end',
        backgroundColor:'#fff',
        // borderWidth:0.5,
        // borderColor:"#181818",
        paddingTop:6,
        paddingBottom:6,
        paddingRight:25,
        paddingLeft:25,
        marginRight:10,
        borderRadius:25
    },
    text:{
        fontSize:14,
        color:'red'
    }
}

export default styles;